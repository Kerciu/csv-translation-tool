import os

import requests


def build_model_name(model_name):
    return f"Helsinki-NLP/opus-mt-{model_name}"


def download_file(url, save_path):
    response = requests.get(url)

    if response.status_code == 200:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(response.content)
        print(f"Downloaded and saved to {save_path}")
    else:
        print(f"Failed to download from {url}. Status code: {response.status_code}")


def download_model(
    model_name,
    save_dir,
    src_lang,
    tgt_lang,
):
    base_url = f"https://huggingface.co/{build_model_name(model_name)}/resolve/main"

    # Original files from Hugging Face
    hf_model_file = "pytorch_model.bin"
    hf_config_file = "config.json"

    # Local files with language tags
    local_model_file = f"pytorch_model-{src_lang}-{tgt_lang}.bin"
    local_config_file = f"config-{src_lang}-{tgt_lang}.json"

    # Download model with language-specific naming
    model_path = os.path.join(save_dir, local_model_file)
    download_file(f"{base_url}/{hf_model_file}", model_path)

    # Download config with language-specific naming
    config_path = os.path.join(save_dir, local_config_file)
    download_file(f"{base_url}/{hf_config_file}", config_path)
