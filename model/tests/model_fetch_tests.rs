use translation_module::translation::translation_map::TranslationMap;

#[tokio::test]
async fn test_translations_map_repo_url_exists() {
    let translation_map = TranslationMap::new();

    for (src, targets) in &*translation_map {
        for tgt in targets {
            let url = format!(
                "https://huggingface.co/Helsinki-NLP/opus-mt-{}-{}/",
                src, tgt
            );
            let response = reqwest::get(&url).await.unwrap();

            assert!(
                response.status().is_success(),
                "Repo URL for Helsinki-NLP/opus-mt-{}-{} not accessible (status: {})",
                src,
                tgt,
                response.status()
            );
        }
    }
}
