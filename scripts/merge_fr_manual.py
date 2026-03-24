#!/usr/bin/env python3
"""Merge scripts/fr_manual_i18n.py into src/assets/i18n/fr.json. Run from repo root: python3 scripts/merge_fr_manual.py"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from fr_manual_i18n import PRIVACY_FR, PROVABLY_FR

ROOT = Path(__file__).resolve().parents[1]
p = ROOT / "src" / "assets" / "i18n" / "fr.json"
data = json.loads(p.read_text(encoding="utf-8"))
data["PrivacyPolicy"] = PRIVACY_FR
data["ProvablyFair"] = PROVABLY_FR
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Updated fr.json PrivacyPolicy + ProvablyFair")
