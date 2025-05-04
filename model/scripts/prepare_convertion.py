from convert_pt_to_safetensors import convert_pt_to_safetensors
from convert_slow_tokenizer import convert_slow_tokenizer
from download_pytorch_model import download_model
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.realpath(__file__))

    if len(sys.argv) != 3:
        print("Usage: python prepare_convertion.py <src_lang> <tgt_lang>")
        sys.exit(1)

    src_lang = sys.argv[1]
    tgt_lang = sys.argv[2]

    models_dir = os.path.join(script_dir, "converted_models")

    if os.path.exists(models_dir):
        print("Cleaning existing models directory...")
        for root, dirs, files in os.walk(models_dir, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        os.rmdir(models_dir)

    os.makedirs(models_dir, exist_ok=True)

    download_model(
        model_name=f"{src_lang}-{tgt_lang}",
        save_dir=models_dir
    )
    print("Pytorch model & config.json downloaded successfully.")
    convert_slow_tokenizer(src_lang=src_lang, tgt_lang=tgt_lang, dest_folder=models_dir)

    print("Slow tokenizer converted to fast tokenizer successfully.")
    convert_pt_to_safetensors(
        source_folder=models_dir,
        dest_folder=models_dir,
        delete_old=True
    )

    print("Conversion completed successfully. Saved in models directory.")

    print("All files are in the models directory.")
    print("You can now use the models for inference.")
