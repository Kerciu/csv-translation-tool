use anyhow::Result;
use candle::{Device, DType};
use candle_nn::VarBuilder;
use candle_transformers::models::marian::Config;

#[derive(Clone)]
pub struct TranslatorConfig {
    pub model_config: Config,
    pub device: Device,
}

impl TranslatorConfig {
    pub fn new(config_path: &str) -> Result<Self> {
        let device = Device::cuda_if_available(0)?;
        let config = Self::load_config_from_file(config_path);

        Ok(Self {
            model_config: config,
            device,
        })
    }

    pub fn load_config_from_file(_config_path: &str) -> Config {
        Config {
            vocab_size: 69667,
            decoder_vocab_size: Some(69667),
            max_position_embeddings: 1024,
            encoder_layers: 6,
            encoder_ffn_dim: 4096,
            encoder_attention_heads: 16,
            decoder_layers: 6,
            decoder_ffn_dim: 4096,
            decoder_attention_heads: 16,
            use_cache: true,
            is_encoder_decoder: true,
            activation_function: candle_nn::Activation::Relu,
            d_model: 1024,
            decoder_start_token_id: 69666,
            scale_embedding: true,
            pad_token_id: 69666,
            eos_token_id: 524,
            forced_eos_token_id: 524,
            share_encoder_decoder_embeddings: true,
        }
    }

    pub fn load_var_builder(&self, model_path: &str) -> Result<VarBuilder> {
        unsafe {
            VarBuilder::from_mmaped_safetensors(&[model_path], DType::F32, &self.device).map_err(Into::into)
        }
    }

    pub fn config(&self) -> &Config {
        &self.model_config
    }
}