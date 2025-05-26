use anyhow::{Context, Result};
use candle::{Device, Tensor, DType};
use candle_transformers::models::marian::MTModel;
use tokenizers::Tokenizer;
use candle::IndexOp;

use super::config::TranslatorConfig;

pub struct BatchTranslator {
    model: MTModel,
    model_config: TranslatorConfig,
    source_tokenizer: Tokenizer,
    target_tokenizer: Tokenizer,
    device: Device,
}

impl BatchTranslator {
    pub fn new(
        config: &TranslatorConfig,
        source_tokenizer_path: &str,
        target_tokenizer_path: &str,
        model_path: &str,
    ) -> Result<Self> {
        let vb = config.load_var_builder(model_path)?;

        let model = MTModel::new(&config.model_config, vb)
            .context("Failed to initialize Marian model")?;

        let source_tokenizer = Tokenizer::from_file(source_tokenizer_path)
            .map_err(|e| anyhow::anyhow!("Failed to load source tokenizer: {}", e))?;

        let target_tokenizer = Tokenizer::from_file(target_tokenizer_path)
            .map_err(|e| anyhow::anyhow!("Failed to load target tokenizer: {}", e))?;

        Ok(Self {
            model,
            model_config: config.clone(),
            source_tokenizer,
            target_tokenizer,
            device: config.device.clone(),
        })
    }

    pub fn translate_batch(&mut self, texts: Vec<String>, tgt_lang: &str, max_length: Option<usize>) -> Result<Vec<String>> {
        let max_length = max_length.unwrap_or(512);
        let formatted_texts = super::tagger::format_batch(&texts, tgt_lang);

        // encode inputs
        let encodings = self.source_tokenizer
            .encode_batch(formatted_texts, true)
            .map_err(|e| anyhow::anyhow!("Tokenization error: {}", e))?;

        let input_ids: Vec<Vec<u32>> = encodings.iter()
            .map(|e| e.get_ids().to_vec())
            .collect();
        let input_tensor = Tensor::new(input_ids, &self.device)?;

        // encode with model
        let encoder_outputs = self.model.encoder().forward(&input_tensor, 0)?;

        // initialize decoder inputs
        let start_token = self.model_config.config().decoder_start_token_id as u32;
        let mut decoder_input_ids = Tensor::new(&[[start_token]], &self.device)?
            .repeat((input_tensor.dim(0)?, 1))?;

        let mut outputs = vec![vec![]; input_tensor.dim(0)?]; // store outputs for each sequence

        for _ in 0..max_length {
            let dummy_tensor = Tensor::zeros((), DType::F32, &self.device)?;
            let decoder_outputs = self.model.decoder().forward(
                &decoder_input_ids,
                Some(&encoder_outputs),
                0,
                &dummy_tensor,
            )?;

            let logits = decoder_outputs;
            // handle negative indices properly
            let seq_len = decoder_input_ids.dim(1)?;
            let last_idx = seq_len.checked_sub(1)
                .ok_or_else(|| anyhow::anyhow!("Sequence length too short"))?;
            let next_tokens = logits.i((.., last_idx))?.argmax(1)?.to_vec1::<u32>()?;

            // update decoder inputs
            decoder_input_ids = Tensor::new(next_tokens.clone(), &self.device)?
                .unsqueeze(1)?;

            // store tokens per sequence
            for (i, token) in next_tokens.iter().enumerate() {
                if *token == self.model_config.config().eos_token_id {
                    continue;
                }
                outputs[i].push(*token);
            }

            // check for EOS in all sequences
            if outputs.iter().all(|seq| seq.contains(&self.model_config.config().eos_token_id)) {
                break;
            }
        }

        // decode each sequence individually
        outputs.into_iter()
            .map(|tokens| {
                self.target_tokenizer.decode(&tokens, true)
                    .map_err(|e| anyhow::anyhow!("Decoding failed: {}", e))
            })
            .collect()
    }
}
