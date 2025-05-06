
# Github: https://github.com/Silver267/pytorch-to-safetensor-converter/blob/main/convert_to_safetensor.py

import json
import os
import shutil
import torch
from collections import defaultdict
from safetensors.torch import load_file, save_file
from tqdm import tqdm

def shared_pointers(tensors):
    ptrs = defaultdict(list)
    for k, v in tensors.items():
        ptrs[v.data_ptr()].append(k)
    return [names for names in ptrs.values() if len(names) > 1]

def check_file_size(sf_filename, pt_filename):
    sf_size = os.stat(sf_filename).st_size
    pt_size = os.stat(pt_filename).st_size
    if (sf_size - pt_size) / pt_size > 0.01:
        raise RuntimeError(f"File size difference exceeds 1% between {sf_filename} and {pt_filename}")

def convert_file(pt_filename, sf_filename, copy_add_data=True):
    source_folder = os.path.dirname(pt_filename)
    dest_folder = os.path.dirname(sf_filename)
    loaded = torch.load(pt_filename, map_location="cpu")
    loaded = loaded.get("state_dict", loaded)
    shared = shared_pointers(loaded)

    for shared_weights in shared:
        for name in shared_weights[1:]:
            loaded.pop(name)

    loaded = {k: v.contiguous().half() for k, v in loaded.items()}

    os.makedirs(dest_folder, exist_ok=True)
    save_file(loaded, sf_filename, metadata={"format": "pt"})
    check_file_size(sf_filename, pt_filename)
    if copy_add_data:
        copy_additional_files(source_folder, dest_folder)

    reloaded = load_file(sf_filename)
    for k, v in loaded.items():
        if not torch.equal(v, reloaded[k]):
            raise RuntimeError(f"Mismatch in tensors for key {k}.")

def rename(pt_filename):
    return pt_filename.replace("pytorch_model", "model").replace(".bin", ".safetensors")

def copy_additional_files(source_folder, dest_folder):
    if os.path.abspath(source_folder) == os.path.abspath(dest_folder):
        print(f"Skipping copy - source and destination are the same: {source_folder}")
        return

    config_src = os.path.join(source_folder, "config.json")
    config_dst = os.path.join(dest_folder, "config.json")
    if os.path.exists(config_src) and not os.path.samefile(config_src, config_dst):
        shutil.copy(config_src, dest_folder)

    for file in os.listdir(source_folder):
        file_path = os.path.join(source_folder, file)
        dest_path = os.path.join(dest_folder, file)
        if os.path.isfile(file_path) and not (file.endswith('.bin') or file.endswith('.py')):
            if not os.path.exists(dest_path) or not os.path.samefile(file_path, dest_path):
                shutil.copy(file_path, dest_folder)

    config_path = os.path.join(source_folder, "config.json")
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config = json.load(f)

        print("Original config keys:", config.keys())

        if "decoder_vocab_size" not in config:
            print("Adding decoder_vocab_size from vocab_size")
            config["decoder_vocab_size"] = config.get("vocab_size", 58101)

        new_config_path = os.path.join(dest_folder, "config.json")
        with open(new_config_path, "w") as f:
            json.dump(config, f, indent=4)
            print("Saved modified config with decoder_vocab_size")

def find_index_file(source_folder):
    for file in os.listdir(source_folder):
        if file.endswith('.bin.index.json'):
            return file
    return None

def convert_files(source_folder, dest_folder, delete_old):
    index_file = find_index_file(source_folder)
    if not index_file:
        raise RuntimeError("Index file not found. Please ensure the correct folder is specified.")

    index_file = os.path.join(source_folder, index_file)
    with open(index_file) as f:
        index_data = json.load(f)

    for pt_filename in tqdm(set(index_data["weight_map"].values())):
        full_pt_filename = os.path.join(source_folder, pt_filename)
        sf_filename = os.path.join(dest_folder, rename(pt_filename))
        convert_file(full_pt_filename, sf_filename, copy_add_data=False)
        if delete_old:
            os.remove(full_pt_filename)

    copy_additional_files(source_folder, dest_folder)

    index_path = os.path.join(dest_folder, "model.safetensors.index.json")
    with open(index_path, "w") as f:
        new_map = {k: rename(v) for k, v in index_data["weight_map"].items()}
        json.dump({**index_data, "weight_map": new_map}, f, indent=4)


def convert_pt_to_safetensors(src_lang, tgt_lang, source_folder, dest_folder=None, delete_old=False):
    if not dest_folder:
        dest_folder = source_folder  # Keep same directory for conversion

    # Remove directory cleanup to preserve tokenizers
    os.makedirs(dest_folder, exist_ok=True)

    pt_path = os.path.join(source_folder, f"pytorch_model-{src_lang}-{tgt_lang}.bin")
    if os.path.exists(pt_path):
        print(f"Converting single file model: {pt_path}")
        sf_path = os.path.join(dest_folder, f"model-{src_lang}-{tgt_lang}.safetensors")
        convert_file(pt_path, sf_path, copy_add_data=True)
        if delete_old:  # Remove directory comparison
            print(f"Deleting original PyTorch file: {pt_path}")
            os.remove(pt_path)
        return
