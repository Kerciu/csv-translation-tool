import requests
import os


def build_model_name(model_name):
    return f"Helsinki-NLP/opus-mt-{model_name}"


def download_file(url, save_path):
    response = requests.get(url)

    if response.status_code == 200:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded and saved to {save_path}")
    else:
        print(f"Failed to download from {url}. Status code: {response.status_code}")


def download_model(model_name, save_dir):
    base_url = f"https://huggingface.co/{build_model_name(model_name)}/resolve/main"

    model_path = os.path.join(save_dir, "pytorch_model.bin")
    download_file(f"{base_url}/pytorch_model.bin", model_path)

    config_path = os.path.join(save_dir, "config.json")
    download_file(f"{base_url}/config.json", config_path)
