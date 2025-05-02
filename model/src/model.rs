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

    fn create_input_tensor(&self, tokens: &[u32]) -> Result<Tensor> {
        Tensor::new(tokens, &self.device)?.unsqueeze(0)
    }

    fn run_encoder(&self, tokens_tensor: &Tensor) -> Result<Tensor> {
        self.model.encoder().forward(tokens_tensor, 0)
    }

    pub fn translate(&self, text: &str) -> Result<String> {

        let tokens = self.tokenize_input(text);
        // let tokens_tensor = Tensor::new(tokens.as_slice(), &self.device)?.unsqueeze(0)?;

        // let encoder_output = self.model.encoder().forward(&tokens_tensor, 0)?;

        // let mut decoded_ids = vec![self.config.eos_token_id];
        // let mut logits = None;
        Ok("");

    }
}
