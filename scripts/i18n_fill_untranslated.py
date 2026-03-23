#!/usr/bin/env python3
"""
Fill i18n strings that still match English (per locale vs en.json).
Uses MyMemory public API (rate-limited). Run from repo root:
  python3 scripts/i18n_fill_untranslated.py
  python3 scripts/i18n_fill_untranslated.py --only fr,de
Optional: MYMEMORY_EMAIL=you@example.com (higher fair-use quota per MyMemory docs)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "src" / "assets" / "i18n"

# MyMemory langpair target codes (second part of en|XX)
LANG_MAP = {
    "ar": "ar",
    "az": "az",
    "de": "de",
    "el": "el",
    "es": "es",
    "fa": "fa",
    "fr": "fr",
    "he": "he",
    "it": "it",
    "pt": "pt",
    "ru": "ru",
    "tr": "tr",
}

SLEEP_SEC = 0.42
CHUNK_MAX = 420
MAX_RETRIES = 10


def flatten(d: dict, p: str = "") -> dict[str, str]:
    o: dict[str, str] = {}
    for k, v in d.items():
        nk = f"{p}.{k}" if p else k
        if isinstance(v, dict):
            o.update(flatten(v, nk))
        else:
            o[nk] = v
    return o


def unflatten(flat: dict[str, str]) -> dict:
    root: dict = {}
    for path, val in flat.items():
        parts = path.split(".")
        cur = root
        for part in parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[parts[-1]] = val
    return root


def should_skip_value(text: str) -> bool:
    t = text.strip()
    if len(t) < 2:
        return True
    if not any(c.isalpha() for c in t):
        return True
    if t.startswith("http://") or t.startswith("https://"):
        return True
    # lone email-like
    if re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", t):
        return True
    return False


def split_chunks(text: str) -> list[str]:
    if len(text) <= CHUNK_MAX:
        return [text]
    # prefer paragraph / newline splits
    parts: list[str] = []
    buf = ""
    for line in text.split("\n"):
        if len(buf) + len(line) + 1 <= CHUNK_MAX:
            buf = (buf + "\n" + line).strip() if buf else line
        else:
            if buf:
                parts.append(buf)
            # hard-split long line
            s = line
            while s:
                parts.append(s[:CHUNK_MAX])
                s = s[CHUNK_MAX:]
            buf = ""
    if buf:
        parts.append(buf)
    return [p for p in parts if p.strip()]


_cache: dict[tuple[str, str], str] = {}


def translate_mymemory(text: str, target: str) -> str:
    key = (target, text)
    if key in _cache:
        return _cache[key]
    q = urllib.parse.quote(text, safe="")
    email = os.environ.get("MYMEMORY_EMAIL", "")
    url = f"https://api.mymemory.translated.net/get?q={q}&langpair=en|{target}"
    if email:
        url += f"&de={urllib.parse.quote(email)}"
    req = urllib.request.Request(url, headers={"User-Agent": "ichancy-frontend-i18n/1.0"})
    last_err: Exception | None = None
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if data.get("responseStatus") != 200:
                raise RuntimeError(f"MyMemory error: {data}")
            out = data["responseData"]["translatedText"]
            if not out or not str(out).strip():
                raise RuntimeError(f"Empty translation for target={target}")
            _cache[key] = out
            return out
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 429:
                wait = 45 + attempt * 25
                print(f"    (429 rate limit, sleeping {wait}s, retry {attempt + 1}/{MAX_RETRIES})")
                time.sleep(wait)
                continue
            raise
        except Exception as e:
            last_err = e
            wait = 8 + attempt * 4
            print(f"    (error {e!r}, sleeping {wait}s, retry {attempt + 1}/{MAX_RETRIES})")
            time.sleep(wait)
    raise last_err or RuntimeError("translate_mymemory failed")


def translate_long(text: str, target: str) -> str:
    chunks = split_chunks(text)
    if len(chunks) == 1:
        return translate_mymemory(chunks[0], target)
    return "\n".join(translate_mymemory(c, target) for c in chunks)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--only",
        type=str,
        default="",
        help="Comma-separated locale codes to process (e.g. fr,de). Default: all non-en.",
    )
    args = ap.parse_args()
    only = {x.strip().lower() for x in args.only.split(",") if x.strip()}

    en_flat = flatten(json.loads((I18N / "en.json").read_text(encoding="utf-8")))
    en_keys = set(en_flat)

    for loc_path in sorted(I18N.glob("*.json")):
        if loc_path.name == "en.json":
            continue
        lang = loc_path.stem
        if only and lang not in only:
            continue
        tgt = LANG_MAP.get(lang)
        if not tgt:
            print(f"skip unknown locale {lang}")
            continue

        loc_flat = flatten(json.loads(loc_path.read_text(encoding="utf-8")))
        to_fix: list[str] = []
        for k in en_keys & set(loc_flat):
            if not isinstance(en_flat[k], str):
                continue
            if en_flat[k].strip() != loc_flat[k].strip():
                continue
            if should_skip_value(en_flat[k]):
                continue
            to_fix.append(k)

        if not to_fix:
            print(f"{loc_path.name}: nothing to translate")
            continue

        print(f"{loc_path.name}: translating {len(to_fix)} paths...")
        for i, path in enumerate(to_fix):
            src = en_flat[path]
            try:
                loc_flat[path] = translate_long(src, tgt)
            except Exception as e:
                print(f"  FAIL {path}: {e!r}")
                raise
            time.sleep(SLEEP_SEC)
            if (i + 1) % 50 == 0:
                print(f"  ... {i + 1}/{len(to_fix)}")

        data = unflatten(loc_flat)
        loc_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{loc_path.name}: done")


if __name__ == "__main__":
    main()
