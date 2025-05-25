use redis::{AsyncCommands, Client};
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Clone)]
pub struct TranslationCache {
    client: Client,
    ttl: Duration,
}

impl TranslationCache {
    pub fn new(redis_url: &str, ttl_seconds: u64) -> Self {
        let client = Client::open(redis_url).unwrap();
        Self {
            client,
            ttl: Duration::from_secs(ttl_seconds),
        }
    }
}
