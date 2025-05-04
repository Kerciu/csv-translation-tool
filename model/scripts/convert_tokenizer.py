from transformers import MarianTokenizer
import sentencepiece as spm
import json
import os
import base64


def convert_marian_tokenizer(model_id, output_dir):
    tokenizer = MarianTokenizer.from_pretrained(model_id)

    spm_source = spm.SentencePieceProcessor()
    spm_source.Load(str(tokenizer.spm_source_path))

    spm_target = spm.SentencePieceProcessor()
    spm_target.Load(str(tokenizer.spm_target_path))

    config = {
        "source_spm": base64.b64encode(spm_source.serialized_model_proto()).decode(),
        "target_spm": base64.b64encode(spm_target.serialized_model_proto()).decode(),
        "lang_tokens": tokenizer.lang_token_dict,
        "special_tokens": tokenizer.special_tokens_map
    }

    with open(os.path.join(output_dir, "tokenizer.json"), "w") as f:
        json.dump(config, f)
