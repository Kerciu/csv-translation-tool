use anyhow::{Result, Error};
use candle::{Device, Tensor, DType};
use clap::ValueEnum;
use candle_nn::VarBuilder;
use candle_transformers::models::{based::Model, marian::MTModel};
use tokenizers::Tokenizer;
use candle_transformers::generation::LogitsProcessor;
use hf_hub::{api::sync::Api, Repo, RepoType};

use crate::{config::ModelConfig, convert::convert_to_safetensors};

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
    model: MTModel,
    tokenizer: Tokenizer,
    tokenizer_dec: Tokenizer,
    config: ModelConfig,
    device: Device,
}

impl TranslationModel {

    fn has_candle_support(lang_pair: &LanguagePair) -> bool {
        match lang_pair {
            LanguagePair::FrEn => true,
            LanguagePair::EnZh => true,
            LanguagePair::EnHi => true,
            LanguagePair::EnEs => true,
            LanguagePair::EnFr => true,
            LanguagePair::EnRu => true,
        }
    }

    fn load_from_candle(api: &Api, model_config: ModelConfig, device: Device, src_lang: &str, tgt_lang: &str) -> Result<Self> {
        let model_repo = api.repo(Repo::with_revision(
            model_config.model_id.clone(),
            RepoType::Model,
            match (src_lang, tgt_lang) {
                ("fr", "en") => "refs/pr/4",
                ("en", "zh") => "refs/pr/13",
                ("en", "hi") => "refs/pr/3",
                ("en", "es") => "refs/pr/4",
                ("en", "fr") => "refs/pr/9",
                ("en", "ru") => "refs/pr/7",
                _ => "main",
            }.to_string(),
        ));

        let tokenizer = {
            let repo = match (src_lang, tgt_lang) {
                ("fr", "en") => "lmz/candle-marian",
                _ => "KeighBee/candle-marian",
            };
            let filename = match (src_lang, tgt_lang) {
                ("fr", "en") => "tokenizer-marian-base-fr.json",
                ("en", "fr") => "tokenizer-marian-base-en-fr-en.json",
                ("en", "zh") => "tokenizer-marian-base-en-zh-en.json",
                ("en", "hi") => "tokenizer-marian-base-en-hi-en.json",
                ("en", "es") => "tokenizer-marian-base-en-es-en.json",
                ("en", "ru") => "tokenizer-marian-base-en-ru-en.json",
                _ => return Err(Error::msg("Unsupported language pair")),
            };
            let path = Api::new()?.model(repo.to_string()).get(filename)?;
            Tokenizer::from_file(path).map_err(|e| Error::msg(format!("Failed to load tokenizer: {}", e)))?
        };

        let tokenizer_dec = {
            let repo = match (src_lang, tgt_lang) {
                ("fr", "en") => "lmz/candle-marian",
                _ => "KeighBee/candle-marian",
            };
            let filename = match (src_lang, tgt_lang) {
                ("fr", "en") => "tokenizer-marian-base-en.json",
                ("en", "fr") => "tokenizer-marian-base-en-fr-fr.json",
                ("en", "zh") => "tokenizer-marian-base-en-zh-zh.json",
                ("en", "hi") => "tokenizer-marian-base-en-hi-hi.json",
                ("en", "es") => "tokenizer-marian-base-en-es-es.json",
                ("en", "ru") => "tokenizer-marian-base-en-ru-ru.json",
                _ => return Err(Error::msg("Unsupported language pair")),
            };
            let path = Api::new()?.model(repo.to_string()).get(filename)?;
            Tokenizer::from_file(path).map_err(|e| Error::msg(format!("Failed to load decoder tokenizer: {}", e)))?
        };

        let vb = {
            let model_file = model_repo.get("model.safetensors")
                .or_else(|_| model_repo.get("pytorch_model.bin"))?;
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

    fn load_with_convertion(api: &Api, model_config: ModelConfig, device: Device, src_lang: &str, tgt_lang: &str) -> Result<Self> {
        const files_to_get_if_no_safetensors_format: [&str; 5] = [
            "config.json",
            "pytorch_model.bin",
            "tokenizer_config.json",
            "source.spm",
            "target.spm"
        ];

        /* ... */
    }

    pub fn new(model_config: ModelConfig) -> Result<Self> {
        let device = Device::cuda_if_available(0)?;
        let api = Api::new()?;
        let (src_lang, tgt_lang) = (
            model_config.src_token.trim_matches(|c| c == '<' || c == '>'),
            model_config.tgt_token.trim_matches(|c| c == '<' || c == '>'),
        );

        let lang_pair = match (src_lang, tgt_lang) {
            ("fr", "en") => LanguagePair::FrEn,
            ("en", "zh") => LanguagePair::EnZh,
            ("en", "hi") => LanguagePair::EnHi,
            ("en", "es") => LanguagePair::EnEs,
            ("en", "fr") => LanguagePair::EnFr,
            ("en", "ru") => LanguagePair::EnRu,
        };

        if Self::has_candle_support(&lang_pair) {
            Self::load_from_candle(&api, model_config, device, src_lang, tgt_lang)
        }
        else {
            Self::load_with_convertion(&api, model_config, device, src_lang, tgt_lang)
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
