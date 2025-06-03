#[cfg(test)]
mod tests {
    use translation_module::translation::cache::TranslationCache;
    use tokio;

    fn test_cache() -> TranslationCache {
        TranslationCache::new("redis://redis:6379/1", 60)
    }

    async fn redis_available() -> bool {
        let cache = test_cache();
        cache.client.get_connection().is_ok()
    }
}