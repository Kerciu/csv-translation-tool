#[cfg(test)]
mod tests {
    use redis::AsyncCommands;
    use translation_module::translation::cache::TranslationCache;
    use std::time::Duration;
    use tokio;

    fn test_cache() -> TranslationCache {
        TranslationCache::new("redis://redis:6379/1", 60)
    }

    async fn redis_available() -> bool {
        let cache = test_cache();
        cache.client.get_connection().is_ok()
    }

    async fn delete_key(cache: &TranslationCache, key: &str) {
        if let Ok(mut conn) = cache.client.get_multiplexed_async_connection().await {
            let _: Result<(), _> = conn.del(key).await;
        }
    }

    #[test]
    fn cache_key_hashed_with_md5() {
        let cache = test_cache();
        let key = cache.cache_key("en", "fr", "Hello");
        assert_eq!(key, "translation:en:fr:8b1a9953c4611296a827abf8c47804d7");
    }

    #[test]
    fn cache_language_detected_key() {
        let cache = test_cache();
        let key = cache.language_cache_key("Bonjour");
        assert_eq!(key, "lang_detect:ebc58ab2cb4848d04ec23d83f7ddf985");
    }

    #[tokio::test]
    async fn test_get_set_translation() {
        let cache = test_cache();
        if !redis_available().await { return; }

        let text = "Bonjour";
        let key = cache.cache_key("fr", "en", text);
        delete_key(&cache, &key).await;

        // cache miss
        assert!(cache.get_cached("fr", "en", text).await.is_none());

        cache.set_cached("fr", "en", text, "Hello").await;
        let result = cache.get_cached("fr", "en", text).await;
        assert_eq!(result, Some("Hello".to_string()));

        delete_key(&cache, &key).await;
    }

    #[tokio::test]
    async fn test_get_set_language() {
        let cache = test_cache();
        if !redis_available().await { return; }

        let text = "Bonjour";
        let key = cache.language_cache_key(text);
        delete_key(&cache, &key).await;

        // cache miss
        assert!(cache.get_cached_language(text).await.is_none());

        cache.set_cached_language(text, "fr").await;
        let result = cache.get_cached_language(text).await;
        assert_eq!(result, Some("fr".to_string()));

        delete_key(&cache, &key).await;
    }

    #[tokio::test]
    async fn test_redis_connection_failure() {
        let bad_cache = TranslationCache::new("redis://invalid-url:9999", 60);
        assert!(bad_cache.get_cached("en", "fr", "test").await.is_none());
    }

    #[tokio::test]
    async fn test_cache_expiry() {
        let cache = TranslationCache::new("redis://redis:6379/1", 1);
        if !redis_available().await { return; }

        let text = "Hola";
        let key = cache.cache_key("en", "es", text);
        delete_key(&cache, &key).await;
        
        cache.set_cached("en", "es", text, "Hello").await;
        tokio::time::sleep(Duration::from_secs(2)).await;
        
        assert!(cache.get_cached("en", "es", text).await.is_none());
        delete_key(&cache, &key).await;
    }

    #[tokio::test]
    async fn test_empty_input() {
        let cache = test_cache();
        if !redis_available().await { return; }

        let key = cache.cache_key("", "", "");
        delete_key(&cache, &key).await;

        cache.set_cached("", "", "", "empty").await;
        assert_eq!(
            cache.get_cached("", "", "").await,
            Some("empty".to_string())
        );

        delete_key(&cache, &key).await;
    }
}