#!/usr/bin/env python3
"""
Generator video produk 3 tier untuk skripsi mark0.

Menghasilkan satu video pan-zoom per produk per tier, dari foto produk
yang sama dengan generate-media.py (media-source/NN.jpg). Pendekatan ini
dipilih karena sumber video produk berlisensi bebas sangat terbatas,
sedangkan gerakan pan-zoom perlahan adalah pola umum pada video produk
e-commerce sederhana.

Tier (sesuai kolokium 8.2.1):
  light  : 1-5 MB
  medium : 5-15 MB
  heavy  : 15-50 MB

Durasi tetap 4 detik di ketiga tier -- yang bervariasi adalah bitrate,
sehingga variabel yang diuji murni ukuran byte, bukan durasi.

Pemakaian:
    .venv/bin/python scripts/generate-video.py
    .venv/bin/python scripts/generate-video.py --count 3   # uji coba cepat
"""

import argparse
import csv
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(ROOT, "media-source")
OUT_DIR = os.path.join(ROOT, "api-middleware", "public", "media")
MANIFEST = os.path.join(ROOT, "video-manifest.csv")

DURATION = 4  # detik
FPS = 25
WIDTH, HEIGHT = 1280, 720

# tier -> (min bytes, max bytes)
TIERS = {
    "light": (1 * 1024 * 1024, 5 * 1024 * 1024),
    "medium": (5 * 1024 * 1024, 15 * 1024 * 1024),
    "heavy": (15 * 1024 * 1024, 50 * 1024 * 1024),
}


def encode(src: str, out: str, bitrate_kbps: int) -> int:
    """Encode satu video pan-zoom. Mengembalikan ukuran berkas (bytes)."""
    zoom_frames = DURATION * FPS
    vf = (
        f"scale=3840:-1,"
        f"zoompan=z='min(zoom+0.0008,1.3)':d={zoom_frames}:"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={WIDTH}x{HEIGHT}:fps={FPS},"
        f"format=yuv420p"
    )
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-loop", "1", "-i", src,
        "-t", str(DURATION),
        "-vf", vf,
        "-c:v", "libx264",
        # CBR benar-benar dipaksa lewat nal-hrd=cbr + force-cfr. Sekadar
        # -minrate==-maxrate TIDAK CUKUP: x264 tetap menghemat bit untuk
        # adegan sederhana (foto nyaris polos, gerakan minim) walau diminta
        # bitrate tinggi, karena tidak ada mekanisme yang MEMAKSA pengisian
        # bit kosong (filler NAL unit). Dibuktikan dua kali pada vid-09:
        # tanpa HRD -> 3,8 MB pada target 30.000 kbps (seharusnya ~14,3 MB);
        # dengan nal-hrd=cbr -> 14,1 MB, tepat sasaran.
        "-x264-params", "nal-hrd=cbr:force-cfr=1",
        "-b:v", f"{bitrate_kbps}k",
        "-minrate", f"{bitrate_kbps}k",
        "-maxrate", f"{bitrate_kbps}k",
        "-bufsize", f"{bitrate_kbps // 2}k",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        out,
    ]
    subprocess.run(cmd, check=True)
    return os.path.getsize(out)


def fit_to_range(src: str, out: str, lo: int, hi: int) -> tuple[int, int]:
    """Cari bitrate agar ukuran file masuk rentang target."""
    target = (lo + hi) // 2
    # perkiraan awal: bitrate(kbps) ~= target_bytes * 8 / durasi / 1000
    br_lo, br_hi = 200, 60000
    best_size, best_br = None, None
    for _ in range(7):
        br = (br_lo + br_hi) // 2
        size = encode(src, out, br)
        if best_size is None or abs(size - target) < abs(best_size - target):
            best_size, best_br = size, br
        if size < target:
            br_lo = br + 1
        else:
            br_hi = br - 1
        if lo <= size <= hi:
            return size, br
    # pastikan keluaran akhir memakai bitrate terbaik yang ditemukan
    size = encode(src, out, best_br)
    return size, best_br


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=20, help="jumlah produk diproses")
    args = ap.parse_args()

    sources = sorted(
        f for f in os.listdir(SOURCE_DIR) if f.endswith(".jpg") and not f.startswith("video")
    )[: args.count]

    rows = []
    for tier, (lo, hi) in TIERS.items():
        out_dir = os.path.join(OUT_DIR, tier)
        os.makedirs(out_dir, exist_ok=True)
        for fname in sources:
            idx = int(fname.replace(".jpg", ""))
            src = os.path.join(SOURCE_DIR, fname)
            out = os.path.join(out_dir, f"vid-{idx:02d}.mp4")
            size, br = fit_to_range(src, out, lo, hi)
            ok = lo <= size <= hi
            rows.append(
                {
                    "tier": tier,
                    "file": f"vid-{idx:02d}.mp4",
                    "bytes": size,
                    "mb": round(size / 1024 / 1024, 2),
                    "bitrate_kbps": br,
                    "in_range": ok,
                }
            )
            flag = "" if ok else "  <- DI LUAR RENTANG"
            print(f"  {tier:7} vid-{idx:02d}  {round(size/1024/1024,2):6} MB{flag}")

    with open(MANIFEST, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    print()
    for tier in TIERS:
        sizes = [r["mb"] for r in rows if r["tier"] == tier]
        ok = sum(1 for r in rows if r["tier"] == tier and r["in_range"])
        print(
            f"{tier:7} {ok}/{len(sizes)} dalam rentang | "
            f"min {min(sizes)} MB  max {max(sizes)} MB  "
            f"rata-rata {round(sum(sizes)/len(sizes),2)} MB"
        )
    print(f"\nManifest -> {MANIFEST}")


if __name__ == "__main__":
    main()
