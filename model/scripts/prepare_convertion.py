import json
import os
import sys

from convert_pt_to_safetensors import convert_pt_to_safetensors
from convert_slow_tokenizer import convert_slow_tokenizer
from download_pytorch_model import download_model

sys.stdout.reconfigure(encoding="utf-8")


def required_files_exist(models_dir, src_lang, tgt_lang):
    """Check if all required converted files already exist"""
    required_files = [
        os.path.join(models_dir, f"model-{src_lang}-{tgt_lang}.safetensors"),
        os.path.join(models_dir, f"config-{src_lang}-{tgt_lang}.json"),
        os.path.join(models_dir, f"tokenizer-marian-base-{src_lang}-{tgt_lang}.json"),
        os.path.join(models_dir, f"tokenizer-marian-base-{tgt_lang}-{src_lang}.json"),
    ]
    return all(os.path.exists(f) for f in required_files)


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.realpath(__file__))

    if len(sys.argv) != 3:
        print("Usage: python prepare_convertion.py <src_lang> <tgt_lang>")
        sys.exit(1)

    src_lang = sys.argv[1]
    tgt_lang = sys.argv[2]
    models_dir = os.path.join(script_dir, "converted_models")

    # Only clean directory if it exists with invalid files
    if os.path.exists(models_dir):
        print("Removing invalid/partial conversion...")
        for root, dirs, files in os.walk(models_dir, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))

    os.makedirs(models_dir, exist_ok=True)

    # Conditional download
    pytorch_bin = os.path.join(models_dir, f"pytorch_model-{src_lang}-{tgt_lang}.bin")
    if not os.path.exists(pytorch_bin):
        print("Downloading PyTorch model...")
        download_model(
            model_name=f"{src_lang}-{tgt_lang}",
            save_dir=models_dir,
            src_lang=src_lang,
            tgt_lang=tgt_lang,
        )
    else:
        print("Using existing PyTorch model file")

    # Conditional tokenizer conversion
    src_tokenizer = os.path.join(
        models_dir, f"tokenizer-marian-base-{src_lang}-{tgt_lang}.json"
    )
    tgt_tokenizer = os.path.join(
        models_dir, f"tokenizer-marian-base-{tgt_lang}-{src_lang}.json"
    )

    if not os.path.exists(src_tokenizer) or not os.path.exists(tgt_tokenizer):
        print("Converting slow tokenizers...")
        convert_slow_tokenizer(
            src_lang=src_lang, tgt_lang=tgt_lang, dest_folder=models_dir
        )
    else:
        print("Using existing tokenizers")

    # conditional safetensors conversion
    safetensors = os.path.join(models_dir, f"model-{src_lang}-{tgt_lang}.safetensors")
    if not os.path.exists(safetensors):
        print("Converting to safetensors...")
        convert_pt_to_safetensors(
            src_lang=src_lang,
            tgt_lang=tgt_lang,
            source_folder=models_dir,
            dest_folder=models_dir,
            delete_old=True,
        )
    else:
        print("Using existing safetensors model")

    print("Conversion validation complete")
    print("All files are in the models directory.")
