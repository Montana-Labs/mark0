#!/usr/bin/env python3
"""Rangkum hasil k6 jadi tabel markdown siap salin ke Bab 4."""

import glob
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IN = os.path.join(ROOT, "results", "k6")
OUT = os.path.join(ROOT, "results", "loadtest.md")

NAMA = {
    "csr": "CSR-React",
    "csrnext": "CSR-Next",
    "ssg": "SSG-Next",
    "ssr": "SSR-Next",
}
URUT = ["csr", "csrnext", "ssg", "ssr"]


def main():
    files = glob.glob(os.path.join(IN, "*.json"))
    if not files:
        print(f"Tidak ada hasil di {IN}. Jalankan scripts/run-k6.sh dulu.")
        return

    rows = []
    for f in files:
        with open(f) as fh:
            rows.append(json.load(fh))

    def kunci(r):
        bagian = r["label"].split("_")
        strat = bagian[0]
        vu = int(bagian[-1].replace("vu", "")) if bagian[-1].endswith("vu") else 0
        return (vu, URUT.index(strat) if strat in URUT else 99)

    rows.sort(key=kunci)

    lines = []
    def emit(s=""):
        print(s)
        lines.append(s)

    tier = rows[0]["label"].split("_")[1] if "_" in rows[0]["label"] else "?"

    emit("# Hasil Load Testing (RQ3)")
    emit()
    emit(f"Tier beban media: **{tier}**")
    emit()
    emit("> k6 hanya mengunduh dokumen HTML, tidak mengunduh gambar. Pengujian")
    emit("> ini mengukur biaya generasi dokumen di sisi server, bukan pengaruh")
    emit("> beban media — yang diukur terpisah melalui Lighthouse.")
    emit()
    emit("| VU | Strategi | Total req | Throughput | Rata-rata | Median | p95 | Maks | Error rate | SLA breach |")
    emit("|---|---|---|---|---|---|---|---|---|---|")
    for r in rows:
        key = r["label"].split("_")[0]
        emit(
            f"| {r.get('vus', '?')} "
            f"| {NAMA.get(key, key)} "
            f"| {int(r['total_requests'] or 0):,} "
            f"| {round(r['throughput_rps'] or 0)} req/s "
            f"| {round(r['duration_avg_ms'] or 0)} ms "
            f"| {round(r['duration_med_ms'] or 0)} ms "
            f"| {round(r['duration_p95_ms'] or 0)} ms "
            f"| {round(r['duration_max_ms'] or 0)} ms "
            f"| {(r['http_error_rate'] or 0) * 100:.2f}% "
            f"| {(r['sla_breach_rate'] or 0) * 100:.2f}% |"
        )
    emit()
    emit("**Error rate** = persentase respons berstatus bukan 200.  ")
    emit("**SLA breach** = persentase respons yang melebihi 3 detik.  ")
    emit("Keduanya sengaja dipisah: respons lambat bukan berarti server gagal.")

    with open(OUT, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print()
    print(f"Tersimpan ke {OUT}")


if __name__ == "__main__":
    main()
