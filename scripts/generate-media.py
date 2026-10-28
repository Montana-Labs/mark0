#!/usr/bin/env python3
"""
Generator aset media 3 tier untuk skripsi mark0.

Menghasilkan gambar produk dalam tiga tingkat beban media:
  light  :  50-150 KB
  medium : 200-800 KB
  heavy  : 1-3 MB

PENTING untuk validitas penelitian:
ketiga tier dihasilkan dari SATU gambar sumber yang sama per produk.
Yang berbeda hanya resolusi dan kualitas kompresi, bukan isi gambarnya.
Kalau isinya berbeda, yang terukur bukan lagi murni ukuran byte.

Sumber gambar:
  - Kalau folder media-source/ berisi NN.jpg (01..20), file itu yang dipakai.
  - Kalau kosong, script menghasilkan gambar sintetis deterministik
    (seed tetap -> hasil selalu sama, jadi pengujian reproducible).
"""

import csv
import os
from io import BytesIO

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(ROOT, "media-source")
OUT_DIR = os.path.join(ROOT, "api-middleware", "public", "media")
MANIFEST = os.path.join(ROOT, "media-manifest.csv")

PRODUCT_COUNT = 20
SOURCE_WIDTH = 3200

# tier -> (lebar px, min bytes, max bytes)
TIERS = {
    "light": (640, 50 * 1024, 150 * 1024),
    "medium": (1500, 200 * 1024, 800 * 1024),
    "heavy": (2800, 1024 * 1024, 3 * 1024 * 1024),
}


def synth_source(index: int) -> Image.Image:
    """Gambar sintetis deterministik. Sengaja detail/bertekstur supaya
    ukuran file setelah kompresi JPEG realistis seperti foto produk."""
    rnd = __import__("random").Random(1000 + index)
    w = h = SOURCE_WIDTH

    # gradien dibuat kecil lalu di-upscale -> jauh lebih cepat
    base = (rnd.randint(40, 200), rnd.randint(40, 200), rnd.randint(40, 200))
    small = Image.new("RGB", (2, 64))
    sp = small.load()
    for y in range(64):
        t = y / 63
        row = (
            int(base[0] * (1 - t) + 245 * t),
            int(base[1] * (1 - t) + 245 * t),
            int(base[2] * (1 - t) + 245 * t),
        )
        sp[0, y] = row
        sp[1, y] = row
    img = small.resize((w, h), Image.BILINEAR)

    # bentuk acak -> menambah entropi supaya tidak over-compress
    d = ImageDraw.Draw(img)
    for _ in range(260):
        x0, y0 = rnd.randint(0, w), rnd.randint(0, h)
        r = rnd.randint(40, 420)
        col = (rnd.randint(0, 255), rnd.randint(0, 255), rnd.randint(0, 255))
        if rnd.random() < 0.5:
            d.ellipse([x0, y0, x0 + r, y0 + r], fill=col)
        else:
            d.rectangle([x0, y0, x0 + r, y0 + r // 2], fill=col)

    # noise halus -> mendekati karakteristik foto asli
    noise = Image.effect_noise((w, h), 48).convert("L")
    img = Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.18)
    return img.filter(ImageFilter.GaussianBlur(0.4))


def load_source(index: int) -> Image.Image:
    path = os.path.join(SOURCE_DIR, f"{index:02d}.jpg")
    if os.path.exists(path):
        img = Image.open(path).convert("RGB")
        if img.width != SOURCE_WIDTH:
            ratio = SOURCE_WIDTH / img.width
            img = img.resize((SOURCE_WIDTH, int(img.height * ratio)), Image.LANCZOS)
        return img
    return synth_source(index)


def encode(img: Image.Image, width: int, quality: int) -> bytes:
    ratio = width / img.width
    resized = img.resize((width, max(1, int(img.height * ratio))), Image.LANCZOS)
    buf = BytesIO()
    resized.save(buf, format="JPEG", quality=quality, optimize=True, subsampling=0)
    return buf.getvalue()


def fit_to_range(img, width, lo, hi):
    """Cari kualitas JPEG agar ukuran file masuk rentang target.
    Kalau kualitas maksimum pun masih terlalu kecil, resolusi dinaikkan."""
    target = (lo + hi) // 2
    for attempt in range(6):
        best, best_q, best_diff = None, None, None
        q_lo, q_hi = 20, 97
        while q_lo <= q_hi:
            q = (q_lo + q_hi) // 2
            data = encode(img, width, q)
            diff = abs(len(data) - target)
            if best_diff is None or diff < best_diff:
                best, best_q, best_diff = data, q, diff
            if len(data) < target:
                q_lo = q + 1
            else:
                q_hi = q - 1
        if lo <= len(best) <= hi:
            return best, best_q, width
        width = int(width * (1.45 if len(best) < lo else 0.75))
    return best, best_q, width


def main() -> None:
    rows = []
    for tier in TIERS:
        os.makedirs(os.path.join(OUT_DIR, tier), exist_ok=True)

    for i in range(1, PRODUCT_COUNT + 1):
        src = load_source(i)   # SEKALI per produk, dipakai untuk ketiga tier
        print(f"  produk {i:02d}/{PRODUCT_COUNT}", flush=True)
        for tier, (width, lo, hi) in TIERS.items():
            out = os.path.join(OUT_DIR, tier)
            data, q, actual_w = fit_to_range(src, width, lo, hi)
            name = f"img-{i:02d}.jpg"
            with open(os.path.join(out, name), "wb") as fh:
                fh.write(data)
            rows.append(
                {
                    "tier": tier,
                    "file": name,
                    "bytes": len(data),
                    "kb": round(len(data) / 1024, 1),
                    "width_px": actual_w,
                    "jpeg_quality": q,
                    "in_range": lo <= len(data) <= hi,
                }
            )

    print()
    for tier in TIERS:
        sizes = [r["kb"] for r in rows if r["tier"] == tier]
        ok = sum(1 for r in rows if r["tier"] == tier and r["in_range"])
        print(
            f"{tier:7} {ok}/{PRODUCT_COUNT} dalam rentang | "
            f"min {min(sizes)} KB  max {max(sizes)} KB  "
            f"rata-rata {round(sum(sizes)/len(sizes),1)} KB"
        )

    with open(MANIFEST, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"\nManifest -> {MANIFEST}")


if __name__ == "__main__":
    main()
