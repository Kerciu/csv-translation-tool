use anyhow::{Result, Error};
use candle::{Device, Tensor, DType};
use candle_nn::VarBuilder;
use candle_transformers::models::marian::{MTModel, Config};
use tokenizers::Tokenizer;
use hf_hub::{api::sync::Api, Repo};

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

    pub fn translate(&self, text: &str) -> String {
        format!("Translated: {}", text)
    }
}
