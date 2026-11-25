#!/usr/bin/env python3
"""Mârifetnâme PDF'inden ham metni çıkarır ve ilgili sayfaları listeler.

Kullanım:
    python3 -m pip install pypdf
    python3 scripts/extract_pdf.py "/yol/Marifetname.pdf" --out data/raw.txt
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


KEYWORDS = [
    "burç", "burc", "koç", "boğa", "ikizler", "yengeç", "aslan", "başak",
    "terazi", "akrep", "yay", "oğlak", "kova", "balık", "mizaç", "mizac",
    "zühal", "müşteri", "merih", "şems", "zühre", "utarit", "kamer",
    "menzil", "gezegen", "unsur", "mevsim",
]


def main() -> int:
    parser = argparse.ArgumentParser(description="PDF'ten sayfa metni ve burç/gezegen sayfa haritası çıkarır.")
    parser.add_argument("pdf", type=Path, help="Mârifetnâme PDF dosyası")
    parser.add_argument("--out", type=Path, default=Path("data/raw.txt"), help="Ham metin çıktısı")
    args = parser.parse_args()

    try:
        from pypdf import PdfReader
    except ImportError:
        print("pypdf bulunamadı. Kurulum: python3 -m pip install pypdf", file=sys.stderr)
        return 1

    if not args.pdf.exists():
        print(f"Dosya bulunamadı: {args.pdf}", file=sys.stderr)
        return 1

    reader = PdfReader(str(args.pdf))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    chunks: list[str] = []
    hits: list[tuple[int, list[str]]] = []

    for i, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
        except Exception as exc:  # bozuk sayfaları atla
            print(f"Sayfa {i} okunamadı: {exc}", file=sys.stderr)
            text = ""
        chunks.append(f"\n===== PAGE {i} =====\n{text}")
        low = text.lower()
        found = [k for k in KEYWORDS if k in low]
        if found:
            hits.append((i, sorted(set(found))))

    args.out.write_text("".join(chunks), encoding="utf-8")
    print(f"Toplam sayfa: {len(reader.pages)}")
    print(f"Ham metin: {args.out} ({args.out.stat().st_size / 1024:.0f} KB)")
    print("\nBurç/gezegen geçen sayfalar:")
    for page, found in hits:
        print(f"  s. {page}: {', '.join(found)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
