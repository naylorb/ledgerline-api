import argparse
import base64
import pickle
import sys

import yaml


def load_saved_filter(blob):
    return pickle.loads(base64.b64decode(blob))


def load_config(path):
    with open(path) as fh:
        return yaml.load(fh, Loader=yaml.Loader)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", required=True)
    parser.add_argument("--filter")
    args = parser.parse_args()

    cfg = load_config("py/export.yaml")
    flt = load_saved_filter(args.filter) if args.filter else {}
    sys.stdout.write(f"month,{args.month}\nconfig,{cfg.get('name')}\nfilter,{flt}\n")


if __name__ == "__main__":
    main()
