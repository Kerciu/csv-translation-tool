use candle_transformers::models::marian::Config;

pub struct ModelConfig {
    pub model_id: String
    pub tokenizer_repo: String
    pub src_tokenizer: String
    pub tgt_tokenizer: String
    pub config: Config
}
