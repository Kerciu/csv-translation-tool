use anyhow::{Result, Error};
use candle::{Device, Tensor, DType};
use clap::ValueEnum;
use candle_nn::VarBuilder;
use candle_transformers::models::marian::MTModel;
use tokenizers::Tokenizer;
use candle_transformers::generation::LogitsProcessor;
use hf_hub::{api::sync::Api, Repo, RepoType};
use std::{process::Command, path::PathBuf};


use crate::{config::ModelConfig, translation::loader::load_from_candle, translation::loader::load_with_convertion};

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

const SUPPORTED_LANGUAGES: &[LanguagePair] = {
    use LanguagePair::*;
    &[FrEn, EnZh, EnHi, EnEs, EnFr, EnRu]
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
            load_with_convertion(&api, model_config, device)
        }

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
        let tokens = self.tokenize_input(text)?;
        Tensor::new(tokens.as_slice(), &self.device)?
            .to_dtype(DType::I64)?
            .unsqueeze(0)
            .map_err(Into::into)
    }

    pub fn translate(&mut self, text: &str) -> Result<String> {
        let tokens_tensor = self.prepare_input(text)?;
        let encoder_output = self.model.encoder().forward(&tokens_tensor, 0)?;

        let mut token_ids = vec![self.config.decoder_start_token_id];
        let mut logits_processor = LogitsProcessor::new(299792458, None, None);

        let seq_len = tokens_tensor.dim(1)?;
        let attn_mask = Tensor::ones((1, seq_len), DType::F32, &self.device)?;

        for _ in 0..self.config.max_position_embeddings {

            let context_size = if token_ids.len() <= 1 { token_ids.len() } else { 1 };
            let start_pos = token_ids.len().saturating_sub(context_size);

            let input_ids = Tensor::new(&token_ids[start_pos..], &self.device)?.unsqueeze(0)?;

            let logits = self.model.decode(&input_ids, &encoder_output, start_pos)?;

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
