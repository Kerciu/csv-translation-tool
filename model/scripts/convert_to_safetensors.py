from transformers import AutoModelForSeq2SeqLM
from safetensors.torch import save_file
import torch
import os
import sys


def main():
    if len(sys.argv) != 3:
        print("Usage: python convert_to_safetensor.py <model_id> <output_dir>")
        sys.exit(1)

    model_id = sys.argv[1]
    output_dir = sys.argv[2]
    os.makedirs(output_dir, exist_ok=True)

    print(f"Loading model {model_id}...")
    model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

    print("Saving PyTorch model in Hugging Face format...")
    model.save_pretrained(output_dir)

    print("Converting to safetensors...")
    tensors = {k: v.cpu() for k, v in model.state_dict().items()}
    safetensors_path = os.path.join(output_dir, "model.safetensors")
    save_file(tensors, safetensors_path)

    print(f"Model converted to safetensors and saved in {safetensors_path}")


if __name__ == "__main__":
    main()
