from transformers import AutoModelForSeq2SeqLM
from convert_tokenizer import convert_marian_tokenizer
import sys
import os


def main():
    model_id = sys.argv[1]
    output_dir = sys.argv[2]

    model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
    model.save_pretrained(output_dir, safe_serialization=True)

    convert_marian_tokenizer(model_id, output_dir)


if __name__ == "__main__":
    main()
