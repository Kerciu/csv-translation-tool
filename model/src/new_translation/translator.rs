use anyhow::{Context, Result};
use candle::{Device, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::models::marian::{Config, MTModel};
use tokenizers::Tokenizer;

use super::config::TranslatorConfig;

pub struct BatchTranslator {
    model: MTModel,
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
            source_tokenizer,
            target_tokenizer,
            device: config.device.clone(),
        })
    }
}
