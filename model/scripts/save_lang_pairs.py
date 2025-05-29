import json
from huggingface_hub import list_models
from allowed_langs import ALLOWED_LANGS as allowed_langs

models = list_models(search="Helsinki-NLP/opus-mt")

language_pairs = []
true_casing = False
big = False
base = False

translations_map = {}

for model in models:
    model_id = model.id

    if model_id.startswith("Helsinki-NLP/opus-mt-"):

        print("Found model: ", model_id)

        parts = model_id.split("/")
        name = parts[-1]

        lang_part = name[len("opus-mt-"):]

        if lang_part.endswith("-tc"):
            lang_part = lang_part[:-3]
            true_casing = True

        if lang_part.startswith("big"):
            lang_part = lang_part[3:]
            big = True

        if lang_part.startswith("base"):
            lang_part = lang_part[4:]
            base = True

        langs = lang_part.split("-")
        if len(langs) == 2:
            src_lang, tgt_lang = langs

            if src_lang in allowed_langs and tgt_lang in allowed_langs:
                language_pairs.append({
                    "src_lang": src_lang,
                    "tgt_lang": tgt_lang,
                    "model_id": model_id,
                    "true_casing": true_casing,
                    "big": big,
                    "base": base,
                })

                if src_lang not in translations_map:
                    translations_map[src_lang] = set()
                translations_map[src_lang].add(tgt_lang)

    true_casing = False
    big = False
    base = False

translations_map = {k: sorted(list(v)) for k, v in translations_map.items()}

with open("language_pairs.json", "w", encoding="utf-8") as f:
    json.dump(language_pairs, f, ensure_ascii=False, indent=4)

with open("translations_map.json", "w", encoding="utf-8") as f:
    json.dump(translations_map, f, ensure_ascii=False, indent=4)

print(f"Saved {len(language_pairs)} models to language_pairs.json")
print("Saved translations map translations_map.json")
