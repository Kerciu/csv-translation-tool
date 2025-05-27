use redis::AsyncCommands;
use redis::Client;
use std::{time::Duration};
use md5;

#[derive(Clone)]
pub struct TranslationCache {
    client: Client,
    ttl: Duration,
}

impl TranslationCache {
    pub fn new(redis_url: &str, ttl_seconds: u64) -> Self {
        let client = Client::open(redis_url)
            .expect("Failed to create Redis client");
        Self {
            client,
            ttl: Duration::from_secs(ttl_seconds),
        }
    }

    async fn cache_key(&self, lang: &str, text: &str) -> String {
        let hash = format!("{:x}", md5::compute(text));
        format!("translation:{}:{}", lang, hash)
    }

    pub async fn get_cached(&self, lang: &str, text: &str) -> Option<String> {
        let mut conn = self.client.get_multiplexed_async_connection().await.ok()?;
        let key = self.cache_key(lang, text).await;

        conn.get(&key).await.ok()?
    }

    pub async fn set_cached(&self, lang: &str, text: &str, translation: &str) {
        let mut conn = match self.client.get_multiplexed_async_connection().await {
            Ok(c) => c,
            Err(_) => return,
        };

        let key = self.cache_key(lang, text).await;
        let _: Result<(), _> = redis::pipe()
            .set(&key, translation)
            .expire(&key, self.ttl.as_secs() as i64)
            .query_async(&mut conn)
            .await;
    }
}
