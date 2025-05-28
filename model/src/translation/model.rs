use anyhow::{Error, Result};
use candle::{DType, Device, Tensor};
use candle_transformers::generation::LogitsProcessor;

use candle_examples::token_output_stream::TokenOutputStream;
use hf_hub::api::sync::Api;
use rayon::prelude::*;

// use std::sync::{Arc, Mutex};

use crate::{
    config::ModelConfig, translation::loader::convert_and_load,
    translation::loader::load_from_candle,
};

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


    pub fn tokenize_input(&self, text: &str) -> Result<Vec<u32>> {
        println!("Tokenizing input: {}", text);

        let input_text = format!("{}{}{}",
            self.config.src_token,
            text,
            self.config.tgt_token
        );

        let encoding = self
            .tokenizer
            .encode(input_text, true)
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

        // Tokenize input with EOS
        let mut tokens = self.tokenizer.encode(text, true)
            .map_err(|e| Error::msg(format!("Encoding error: {}", e)))?
            .get_ids()
            .to_vec();
        tokens.push(self.config.eos_token_id);

        let tokens_tensor = Tensor::new(tokens.as_slice(), &self.device)?
            .unsqueeze(0)?;

        println!("[DEBUG] Input tensor shape: {:?}", tokens_tensor.dims());

        // Run encoder
        let encoder_output = self.model.encoder().forward(&tokens_tensor, 0)?;
        println!("[DEBUG] Encoder output shape: {:?}", encoder_output.dims());

        // Prepare decoder
        let mut token_ids = vec![self.config.decoder_start_token_id];
        let mut tokenizer_dec = TokenOutputStream::new(self.tokenizer_dec.clone());
        let mut logits_processor = LogitsProcessor::new(299792458, None, None);
        let mut output_string = String::new();


        for index in 0..self.config.max_position_embeddings {
            let context_size = if index >= 1 { 1 } else { token_ids.len() };
            let start_pos = token_ids.len().saturating_sub(context_size);
            let input_ids = Tensor::new(&token_ids[start_pos..], &self.device)?
                .unsqueeze(0)?;


            // Run decoder
            let logits = self.model.decode(&input_ids, &encoder_output, start_pos)?;
            let logits = logits.squeeze(0)?;
            let logits = logits.get(logits.dim(0)? - 1)?;

            let token = logits_processor.sample(&logits)?;
            token_ids.push(token);

            // Stream output tokens
            if let Some(t) = tokenizer_dec.next_token(token)? {
                output_string.push_str(&t);
            }

            // Stop condition
            if token == self.config.eos_token_id || token == self.config.forced_eos_token_id {
                break;
            }
        }


        // Finalize output
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

    // pub fn tokenize_batch(&self, texts: &[&str]) -> Result<Vec<Vec<u32>>> {
    //     let inputs: Vec<String> = texts.iter()
    //         .map(|text| format!("{}{}{}",
    //             self.config.src_token,
    //             text,
    //             self.config.tgt_token
    //         ))
    //         .collect();

    //     self.tokenizer.encode_batch(inputs, true)
    //         .map(|encodings| {
    //             encodings.iter()
    //                 .map(|e| e.get_ids().to_vec())
    //                 .collect()
    //         })
    //         .map_err(|e| anyhow::anyhow!("Batch tokenization failed: {}", e))
    // }

    // // Optimized batch translation
    // pub fn translate_batch(&mut self, texts: &[&str]) -> Result<Vec<String>> {
    //     let tokenized = self.tokenize_batch(texts)?;
    //     const BATCH_SIZE: usize = 8;
    //     let mut results = Vec::with_capacity(texts.len());

    //     for chunk in tokenized.chunks(BATCH_SIZE) {
    //         // Create tensors
    //         let tensors: Result<Vec<Tensor>> = chunk.iter()
    //             .map(|tokens| {
    //                 Tensor::new(tokens.as_slice(), &self.device)
    //                     .and_then(|t| t.to_dtype(DType::I64))
    //                     .and_then(|t| t.unsqueeze(0))
    //                     .map_err(anyhow::Error::from)
    //             })
    //             .collect();

    //         let input_tensors = tensors?;
    //         let stacked = Tensor::cat(&input_tensors, 0)?;

    //         // Lock model for batched encoding
    //         // let mut model = self.model.lock().unwrap();
    //         let encoder_output = self.model.encoder().forward(&stacked, 0)?;

    //         // Parallel decoding
    //         let chunk_results: Result<Vec<String>> = (0..chunk.len())
    //             .into_par_iter()
    //             .map(|i| {
    //                 let encoder_output_i = encoder_output.narrow(0, i, 1)?;
    //                 self.decode_single(encoder_output_i)
    //             })
    //             .collect();

    //         results.extend(chunk_results?);
    //     }

    //     Ok(results)
    // }

    // // Decode single sequence
    // fn decode_single(&mut self, encoder_output: Tensor) -> Result<String> {
    //     let mut token_ids = vec![self.config.decoder_start_token_id];
    //     let mut logits_processor = LogitsProcessor::new(299792458, None, None);

    //     for _ in 0..self.config.max_position_embeddings {
    //         let start_pos = token_ids.len().saturating_sub(1);
    //         let input_ids = Tensor::new(&token_ids[start_pos..], &self.device)?.unsqueeze(0)?;

    //         // Lock model for decoding
    //         // let mut model = self.model.lock().unwrap();
    //         let logits = self.model.decode(&input_ids, &encoder_output, start_pos)?;
    //         let logits = logits.squeeze(0)?.get(logits.dim(0)? - 1)?;
    //         let next_token = logits_processor.sample(&logits)?;

    //         token_ids.push(next_token);
    //         if next_token == self.config.eos_token_id {
    //             break;
    //         }
    //     }

    //     let decoded = self.tokenizer_dec.decode(&token_ids, true)
    //         .map_err(|e| anyhow::anyhow!("Decoding failed: {}", e))?;

    //     let cleaned = decoded
    //         .replace("<NIL>", "")
    //         .replace(&self.config.tgt_token, "")
    //         .trim()
    //         .to_string();

    //     Ok(cleaned)
    // }
}
