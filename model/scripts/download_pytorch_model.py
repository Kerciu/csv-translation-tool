import requests
import os


def build_model_name(model_name):
    return f"Helsinki-NLP/opus-mt-{model_name}"


def download_model(model_name, save_path):

    response = requests.get(f"https://huggingface.co/{build_model_name(model_name)}/resolve/main/pytorch_model.bin")

    if response.status_code == 200:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, 'wb') as f:
            f.write(response.content)

        print(f"Model downloaded and saved to {save_path}")
    else:
        print(f"Failed to download model. Status code: {response.status_code}")
        print("Please check the model name and try again.")
        return None
