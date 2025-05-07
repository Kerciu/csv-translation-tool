use anyhow::{Result, Error};
use candle::{Device, Tensor, DType};
use clap::ValueEnum;
use candle_transformers::models::marian::MTModel;
use tokenizers::Tokenizer;
use candle_transformers::generation::LogitsProcessor;
use hf_hub::api::sync::Api;

use crate::{config::ModelConfig, translation::loader::load_from_candle, translation::loader::convert_and_load};

#[derive(Clone, Debug, Copy, ValueEnum)]
enum Which {
    Base,
    Big,
}

#[derive(Clone, Debug, Copy, PartialEq, Eq, ValueEnum)]
enum LanguagePair {
    #[value(name = "fr-en")]
    FrEn,
    #[value(name = "en-zh")]
    EnZh,
    #[value(name = "en-hi")]
    EnHi,
    #[value(name = "en-es")]
    EnEs,
    #[value(name = "en-fr")]
    EnFr,
    #[value(name = "en-ru")]
    EnRu,
}

pub struct TranslationModel {
    pub model: MTModel,
    pub tokenizer: Tokenizer,
    pub tokenizer_dec: Tokenizer,
    pub config: ModelConfig,
    pub device: Device,
}

impl TranslationModel {

    fn has_candle_support(model_id: &str) -> bool {
        matches!(model_id,
            "Helsinki-NLP/opus-mt-fr-en" |
            "Helsinki-NLP/opus-mt-en-zh" |
            "Helsinki-NLP/opus-mt-en-hi" |
            "Helsinki-NLP/opus-mt-en-es" |
            "Helsinki-NLP/opus-mt-en-ru"
        )
    }

    pub fn new(model_config: ModelConfig) -> Result<Self> {
        let device = Device::cuda_if_available(0)?;
        let api = Api::new()?;

        if Self::has_candle_support(&model_config.model_id) {
            load_from_candle(&api, model_config, device)
        }
        else {
            convert_and_load(model_config, device)
        }

    }

    fn tokenize_input(&self, text: &str) -> Result<Vec<u32>> {
        println!("Tokenizing input: {}", text);
        let input_text = format!("{} {} {}",
            self.config.src_token,
            text,
            self.config.tgt_token
        );

        let encoding = self.tokenizer.encode(input_text, true)
        .map_err(|e| Error::msg(format!("Encoding error: {}", e)))?;

        println!("Token IDs: {:?}", encoding.get_ids());
        println!("Tokens: {:?}", encoding.get_tokens());

        Ok(encoding.get_ids().to_vec())
    }

    fn prepare_input(&mut self, text: &str) -> Result<Tensor> {
        println!("Preparing input: {}", text);
        let tokens = self.tokenize_input(text)?;
        Tensor::new(tokens.as_slice(), &self.device)?
            .to_dtype(DType::I64)?
            .unsqueeze(0)
            .map_err(Into::into)
    }

    pub fn translate(&mut self, text: &str) -> Result<String> {
        println!("\n[TRANSLATION START] Input: '{}'", text);
        println!("[CONFIG] Model ID: {}", self.config.model_id);
        println!("[CONFIG] Device: {:?}", self.device);

        let tokens_tensor = self.prepare_input(text)?;
        println!("[DEBUG] Input tensor shape: {:?}", tokens_tensor.dims());

        let encoder_output = self.model.encoder().forward(&tokens_tensor, 0)?;
        println!("[DEBUG] Encoder output shape: {:?}", encoder_output.dims());

        let mut token_ids = vec![self.config.decoder_start_token_id];
        let mut logits_processor = LogitsProcessor::new(299792458, None, None);

        println!("[DECODER] Max steps: {}", self.config.max_position_embeddings);
        println!("[DECODER] Start token: {}", self.config.decoder_start_token_id);
        println!("[DECODER] EOS token: {}", self.config.eos_token_id);

        for step in 0..self.config.max_position_embeddings {
            let context_size = if token_ids.len() <= 1 { token_ids.len() } else { 1 };
            let start_pos = token_ids.len().saturating_sub(context_size);

            println!("\n[STEP {}] Current tokens: {:?}", step, token_ids);

            let input_ids = Tensor::new(&token_ids[start_pos..], &self.device)?.unsqueeze(0)?;
            println!("[STEP {}] Decoder input shape: {:?}", step, input_ids.dims());

            let logits = self.model.decode(&input_ids, &encoder_output, start_pos)?;
            println!("[STEP {}] Logits shape: {:?}", step, logits.dims());

            let logits = logits.squeeze(0)?.get(logits.dim(0)? - 1)?;
            let next_token = logits_processor.sample(&logits)?;

            println!("[STEP {}] Sampled token: {}", step, next_token);

            token_ids.push(next_token);
            if next_token == self.config.eos_token_id {
                println!("[EOS] Stopping at step {}", step);
                break;
            }
        }

        println!("[FINAL TOKENS] {:?}", token_ids);

        let decoded = self.tokenizer_dec.decode(&token_ids, true)
            .map_err(|e| {
                println!("[ERROR] Decoding failed for tokens: {:?}", token_ids);
                Error::msg(format!("Decoding error: {}", e))
            })?;

        println!("[RAW DECODED] '{}'", decoded);

        let cleaned = decoded
            .replace("<NIL>", "")
            .replace(&self.config.tgt_token, "")
            .trim()
            .to_string();

        println!("[CLEANED RESULT] '{}'", cleaned);
        Ok(cleaned)
    }

}
