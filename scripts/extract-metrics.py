#!/usr/bin/env python3
"""
Mengubah raw JSON Lighthouse menjadi satu CSV, SATU BARIS PER RUN.

Satu baris per run (bukan rata-rata) adalah syarat mutlak: tanpa data
per-run tidak ada standar deviasi, dan tanpa standar deviasi tidak ada
uji ANOVA maupun Kruskal-Wallis seperti yang dijanjikan di kolokium 8.3.

Pemakaian:
    python3 scripts/extract-metrics.py
"""

import csv
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "results", "raw")
OUT = os.path.join(ROOT, "results", "metrics.csv")

# nama audit Lighthouse -> nama kolom
AUDITS = {
    "first-contentful-paint": "fcp_ms",
    "largest-contentful-paint": "lcp_ms",
    "total-blocking-time": "tbt_ms",
    "cumulative-layout-shift": "cls",
    "speed-index": "si_ms",
    "interactive": "tti_ms",
}

FILENAME = re.compile(r"^(csr|ssg|ssr)_(light|medium|heavy)_(\d+)(?:_(\w+))?\.json$")


def main() -> None:
    files = sorted(glob.glob(os.path.join(RAW, "*.json")))
    if not files:
        print(f"Tidak ada file di {RAW}. Jalankan scripts/run-lighthouse.sh dulu.")
        return

    rows = []
    skipped = []

    for path in files:
        m = FILENAME.match(os.path.basename(path))
        if not m:
            skipped.append((os.path.basename(path), "nama file tidak dikenali"))
            continue

        strategy, tier, run, preset = m.groups()

        try:
            with open(path) as fh:
                d = json.load(fh)
        except json.JSONDecodeError as e:
            skipped.append((os.path.basename(path), f"JSON rusak: {e}"))
            continue

        audits = d.get("audits") or {}
        if not audits:
            skipped.append((os.path.basename(path), "tidak ada audits (run gagal?)"))
            continue

        row = {
            "strategy": strategy,
            "tier": tier,
            "run": int(run),
            "preset": preset or "mobile-default",
            "lighthouse_version": d.get("lighthouseVersion", ""),
            "fetch_time": d.get("fetchTime", ""),
            "url": d.get("finalDisplayedUrl") or d.get("finalUrl", ""),
        }

        score = ((d.get("categories") or {}).get("performance") or {}).get("score")
        row["performance_score"] = round(score * 100, 1) if score is not None else ""

        # versi browser host -> dicatat karena penelitian ini memakai
        # Brave, bukan Chrome. Wajib dinyatakan di Bab 3.
        env = d.get("environment") or {}
        row["user_agent"] = env.get("hostUserAgent", "")

        for audit_id, col in AUDITS.items():
            v = (audits.get(audit_id) or {}).get("numericValue")
            row[col] = round(v, 2) if isinstance(v, (int, float)) else ""

        # total byte gambar yang benar-benar diunduh -> bukti variasi
        # beban media sungguh terjadi, bukan sekadar klaim
        items = ((audits.get("resource-summary") or {}).get("details") or {}).get("items") or []
        for it in items:
            if it.get("resourceType") == "image":
                row["image_bytes"] = it.get("transferSize", "")
                row["image_requests"] = it.get("requestCount", "")
            if it.get("resourceType") == "total":
                row["total_bytes"] = it.get("transferSize", "")

        rows.append(row)

    if not rows:
        print("Tidak ada run yang bisa dibaca.")
        for name, why in skipped:
            print(f"  - {name}: {why}")
        return

    cols = [
        "strategy", "tier", "run", "preset", "performance_score",
        "fcp_ms", "lcp_ms", "tbt_ms", "cls", "si_ms", "tti_ms",
        "image_bytes", "image_requests", "total_bytes",
        "lighthouse_version", "user_agent", "fetch_time", "url",
    ]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(sorted(rows, key=lambda r: (r["strategy"], r["tier"], r["run"])))

    print(f"{len(rows)} run -> {OUT}")

    # ringkasan kelengkapan per sel
    print("\nKelengkapan per sel:")
    for strategy in ("csr", "ssg", "ssr"):
        for tier in ("light", "medium", "heavy"):
            n = sum(1 for r in rows if r["strategy"] == strategy and r["tier"] == tier)
            flag = "" if n >= 10 else "   <- di bawah 10, kurang untuk uji statistik"
            print(f"  {strategy:4} {tier:7} {n:3} run{flag}")

    # Deteksi resource terblokir. Testbed memuat tepat 20 gambar per
    # halaman; kalau image_requests kurang dari itu, ada yang diblokir
    # browser (mis. Shields) dan hasilnya TIDAK sah dibandingkan.
    print("\nCek integritas — gambar yang benar-benar terunduh:")
    bad = False
    for strategy in ("csr", "ssg", "ssr"):
        for tier in ("light", "medium", "heavy"):
            sel = [r for r in rows if r["strategy"] == strategy and r["tier"] == tier]
            if not sel:
                continue
            reqs = [r.get("image_requests") for r in sel if r.get("image_requests") != ""]
            byts = [r.get("image_bytes") for r in sel if r.get("image_bytes") != ""]
            if not reqs:
                continue
            lo, hi = min(reqs), max(reqs)
            avg_mb = round(sum(byts) / len(byts) / 1024 / 1024, 2) if byts else 0
            warn = ""
            if hi < 20:
                warn = "   <- KURANG DARI 20, ada resource terblokir"
                bad = True
            print(f"  {strategy:4} {tier:7} gambar {lo}-{hi} req, rata-rata {avg_mb} MB{warn}")
    if bad:
        print("\n  PERINGATAN: sebagian gambar tidak terunduh. Periksa pemblokiran")
        print("  di browser host sebelum memakai data ini.")

    if skipped:
        print(f"\n{len(skipped)} file dilewati:")
        for name, why in skipped:
            print(f"  - {name}: {why}")


if __name__ == "__main__":
    main()
