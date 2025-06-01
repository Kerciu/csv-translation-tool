use md5;
use redis::AsyncCommands;
use redis::Client;
use std::time::Duration;

#[derive(Clone)]
pub struct TranslationCache {
    pub client: Client,
    pub ttl: Duration,
}

impl TranslationCache {
    pub fn new(redis_url: &str, ttl_seconds: u64) -> Self {
        let client = Client::open(redis_url).expect("Failed to create Redis client");
        Self {
            client,
            ttl: Duration::from_secs(ttl_seconds),
        }
    }

    pub fn cache_key(&self, src_lang: &str, tgt_lang: &str, text: &str) -> String {
        let hash = format!("{:x}", md5::compute(text));
        format!("translation:{}:{}:{}", src_lang, tgt_lang, hash)
    }

    pub fn language_cache_key(&self, text: &str) -> String {
        let hash = format!("{:x}", md5::compute(text));
        format!("lang_detect:{}", hash)
    }

    pub async fn get_cached(&self, src_lang: &str, tgt_lang: &str, text: &str) -> Option<String> {
        let mut conn = self.client.get_multiplexed_async_connection().await.ok()?;
        let key = self.cache_key(src_lang, tgt_lang, text);
        conn.get(&key).await.ok()?
    }

    pub async fn set_cached(&self, src_lang: &str, tgt_lang: &str, text: &str, translation: &str) {
        let Ok(mut conn) = self.client.get_multiplexed_async_connection().await else { return };
        let key = self.cache_key(src_lang, tgt_lang, text);
        let _: Result<(), _> = conn.set_ex(&key, translation, self.ttl.as_secs()).await;
    }

    pub async fn get_cached_language(&self, text: &str) -> Option<String> {
        let mut conn = self.client.get_multiplexed_async_connection().await.ok()?;
        let key = self.language_cache_key(text);
        conn.get(&key).await.ok()?
    }

    pub async fn set_cached_language(&self, text: &str, language: &str) {
        let Ok(mut conn) = self.client.get_multiplexed_async_connection().await else { return };
        let key = self.language_cache_key(text);
        let _: Result<(), _> = conn.set_ex(&key, language, self.ttl.as_secs()).await;
    }
}