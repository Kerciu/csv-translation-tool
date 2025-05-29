#[tokio::test]
async fn test_model_safetensors_format_exists() {
    let url =
        "https://huggingface.co/Helsinki-NLP/opus-mt-tc-big-fr-en/blob/main/model.safetensors";
    let response = reqwest::get(url).await.unwrap();

    assert!(
        response.status().is_success(),
        "model.safetensors not found, status = {}",
        response.status()
    );
}

#[tokio::test]
async fn test_repo_url_exists() {
    let url = "https://huggingface.co/Helsinki-NLP/opus-mt-tc-big-en-es/";
    let response = reqwest::get(url).await.unwrap();

    assert!(
        response.status().is_success(),
        "Repo URL not accessible (status: {})",
        response.status()
    );
}
