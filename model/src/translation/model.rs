use anyhow::{Error, Result};
use candle::{DType, Device, Tensor};
use candle_transformers::generation::LogitsProcessor;
use clap::ValueEnum;
use candle_examples::token_output_stream::TokenOutputStream;
use hf_hub::api::sync::Api;
use rayon::prelude::*;
use candle_transformers::models::marian::MTModel;
use tokenizers::Tokenizer;



// use std::sync::{Arc, Mutex};

use crate::{
    config::ModelConfig, translation::loader::convert_and_load,
    translation::loader::load_from_candle,
};

pub struct TranslationModel {
    pub model: MTModel,
    pub tokenizer: Tokenizer,
    pub tokenizer_dec: Tokenizer,
    pub config: ModelConfig,
    pub device: Device,
}

impl TranslationModel {
    fn has_candle_support(model_id: &str) -> bool {
        matches!(
            model_id,
            "Helsinki-NLP/opus-mt-fr-en"
                | "Helsinki-NLP/opus-mt-en-zh"
                | "Helsinki-NLP/opus-mt-en-hi"
                | "Helsinki-NLP/opus-mt-en-es"
                | "Helsinki-NLP/opus-mt-en-ru"
        )
    }

    pub fn new(model_config: ModelConfig) -> Result<Self> {
        let device = Device::cuda_if_available(0)?;
        let api = Api::new()?;

        if Self::has_candle_support(&model_config.model_id) {
            load_from_candle(&api, model_config, device)
        } else {
            convert_and_load(model_config, device)
        }
    }

    pub fn translate(&mut self, text: &str) -> Result<String> {
        println!("\n[TRANSLATION START] Input: '{}'", text);
        println!("[CONFIG] Model ID: {}", self.config.model_id);
        println!("[CONFIG] Device: {:?}", self.device);

        // tokenize input with EOS
        let mut tokens = self.tokenizer.encode(text, true)
            .map_err(|e| Error::msg(format!("Encoding error: {}", e)))?
            .get_ids()
            .to_vec();
        tokens.push(self.config.eos_token_id);

        let tokens_tensor = Tensor::new(tokens.as_slice(), &self.device)?
            .unsqueeze(0)?;

        println!("[DEBUG] Input tensor shape: {:?}", tokens_tensor.dims());

        // run encoder
        let encoder_output = self.model.encoder().forward(&tokens_tensor, 0)?;
        println!("[DEBUG] Encoder output shape: {:?}", encoder_output.dims());

        // prepare decoder
        let mut token_ids = vec![self.config.decoder_start_token_id];
        let mut tokenizer_dec = TokenOutputStream::new(self.tokenizer_dec.clone());
        let mut logits_processor = LogitsProcessor::new(299792458, None, None);
        let mut output_string = String::new();


        for index in 0..self.config.max_position_embeddings {
            let context_size = if index >= 1 { 1 } else { token_ids.len() };
            let start_pos = token_ids.len().saturating_sub(context_size);
            let input_ids = Tensor::new(&token_ids[start_pos..], &self.device)?
                .unsqueeze(0)?;


            // run decoder
            let logits = self.model.decode(&input_ids, &encoder_output, start_pos)?;
            let logits = logits.squeeze(0)?;
            let logits = logits.get(logits.dim(0)? - 1)?;

            let token = logits_processor.sample(&logits)?;
            token_ids.push(token);

            // stream output tokens
            if let Some(t) = tokenizer_dec.next_token(token)? {
                output_string.push_str(&t);
            }

            // stop condition
            if token == self.config.eos_token_id || token == self.config.forced_eos_token_id {
                break;
            }
        }


        // finalize output
        if let Some(rest) = tokenizer_dec.decode_rest()? {
            output_string.push_str(&rest);
        }

        println!("[RAW DECODED] '{}'", output_string);
        let cleaned = output_string
            .replace("<NIL>", "")
            .trim()
            .to_string();

        println!("[CLEANED RESULT] '{}'", cleaned);
        Ok(cleaned)
    }


    pub fn translate_batch_simple(&mut self, texts: &[&str]) -> Result<Vec<String>> {
        texts.iter()
            .map(|text| self.translate(text))
            .collect()
    }
}