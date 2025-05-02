use anyhow::{Result, Error};
use candle::{Device, Tensor, DType};
use candle_nn::VarBuilder;
use candle_transformers::models::marian::MTModel;
use tokenizers::Tokenizer;
use candle_transformers::generation::LogitsProcessor;
use hf_hub::api::sync::Api;

use crate::config::ModelConfig;

pub struct TranslationModel {
    model: MTModel,
    tokenizer: Tokenizer,
    tokenizer_dec: Tokenizer,
    config: ModelConfig,
    device: Device,
}

impl TranslationModel {
    pub fn new(model_config: ModelConfig) -> Result<Self> {
        let device = Device::cuda_if_available(0)?;
        let api = Api::new()?;

        let tokenizer = {
            let repo = api.model(model_config.model_id.clone());
            let path = repo.get("tokenizer.json")?;
            Tokenizer::from_file(path).map_err(|e| Error::msg(format!("Failed to load tokenizer: {}", e)))?
        };

        let tokenizer_dec = {
            let repo = api.model(model_config.model_id.clone());
            let path = repo.get("tokenizer_dec.json")?;
            Tokenizer::from_file(path).map_err(|e| Error::msg(format!("Failed to load decoder tokenizer: {}", e)))?
        };

        let vb = {
            let model_file = api.model(model_config.model_id.clone()).get("model.safetensors")?;
            unsafe {
                VarBuilder::from_mmaped_safetensors(&[model_file], DType::F32, &device)?
            }
        };

        let config = model_config.to_marian_config();
        let model = MTModel::new(&config, vb)?;

        Ok(Self {
            model,
            tokenizer,
            tokenizer_dec,
            config: model_config,
            device,
        })
    }

    fn tokenize_input(&self, text: &str) -> Result<Vec<u32>> {
        let input_text = format!("{} {} {}",
            self.config.src_token,
            text,
            self.config.tgt_token
        );

        let mut tokens = self.tokenizer.encode(input_text, true)
            .map_err(|e| Error::msg(format!("Encoding error: {}", e)))?
            .get_ids()
            .to_vec();
        tokens.push(self.config.eos_token_id);
        Ok(tokens)
    }

    fn prepare_input(&mut self, text: &str) -> Result<Tensor> {
        let input_text = format!("{} {} {}",
            self.config.src_token,
            text,
            self.config.tgt_token
        );

        let mut tokens = self.tokenizer.encode(input_text, true)
            .map_err(|e| Error::msg(format!("Encoding error: {}", e)))?
            .get_ids()
            .to_vec();
        tokens.push(self.config.eos_token_id);

        Tensor::new(tokens.as_slice(), &self.device)?
            .unsqueeze(0)
            .map_err(Into::into)
    }

    pub fn translate(&mut self, text: &str) -> Result<String> {
        let tokens_tensor = self.prepare_input(text)?;
        let encoder_output = self.model.encoder().forward(&tokens_tensor, 0)?;

        let mut token_ids = vec![self.config.decoder_start_token_id];
        let mut logits_processor = LogitsProcessor::new(299792458, None, None);

        let seq_len = tokens_tensor.dim(1)?;
        let attn_mask = Tensor::ones((1, seq_len), DType::U8, &self.device)?;

        for _ in 0..self.config.max_position_embeddings {
            let context_size = if token_ids.len() <= 1 { token_ids.len() } else { 1 };
            let start_pos = token_ids.len().saturating_sub(context_size);

            let input_ids = Tensor::new(&token_ids[start_pos..], &self.device)?.unsqueeze(0)?;
            let logits = self.model.decoder().forward(
                &input_ids,
                Some(&encoder_output),
                0,
                &attn_mask
            )?;

            let logits = logits.squeeze(0)?.get(logits.dim(0)? - 1)?;
            let next_token = logits_processor.sample(&logits)?;
            token_ids.push(next_token);

            if next_token == self.config.eos_token_id {
                break;
            }
        }

        self.tokenizer_dec.decode(&token_ids, true)
            .map_err(|e| Error::msg(format!("Decoding error: {}", e)))
    }

}
