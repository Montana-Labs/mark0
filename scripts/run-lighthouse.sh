#!/usr/bin/env bash
#
# Runner pengukuran Core Web Vitals untuk skripsi mark0.
#
# Menjalankan Lighthouse N kali pada setiap sel (strategi × tier),
# menyimpan RAW JSON tiap run. Raw per-run wajib disimpan karena tanpa
# itu tidak ada standar deviasi, dan tanpa standar deviasi tidak ada
# uji ANOVA / Kruskal-Wallis.
#
# Pemakaian:
#   scripts/run-lighthouse.sh            # 15 run per sel (default)
#   RUNS=3 scripts/run-lighthouse.sh     # uji coba cepat
#   PRESET=desktop scripts/run-lighthouse.sh
#
# Catatan metodologi:
#   Tanpa PRESET, Lighthouse memakai default-nya: emulasi perangkat
#   mobile + throttling jaringan tersimulasi. Default ini yang paling
#   lazim dikutip di literatur dan harus dinyatakan di Bab 3.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNS="${RUNS:-15}"
PRESET="${PRESET:-}"
MIDDLEWARE="${MIDDLEWARE:-https://mark0-middleware.vercel.app}"
OUT="$ROOT/results/raw"
LOG="$ROOT/results/run.log"

mkdir -p "$OUT"
: > "$LOG"

if ! command -v lighthouse >/dev/null; then
  echo "lighthouse belum terpasang. Jalankan: pnpm add -g lighthouse" >&2
  exit 1
fi

# Browser host untuk Lighthouse. Default: Brave (sudah terpasang).
# Testbed ini tidak memuat resource pihak ketiga sama sekali - seluruh
# JS dan gambar berasal dari domain sendiri - sehingga Brave Shields
# tidak punya apa pun untuk diblokir. Tetap diverifikasi secara empiris
# lewat kolom image_requests/image_bytes di metrics.csv: kalau ada
# resource yang diblokir, angkanya akan anjlok dan langsung ketahuan.
#
# Ganti browser lewat env var kalau perlu:
#   CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ -z "${CHROME_PATH:-}" ]; then
  for CANDIDATE in \
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  do
    if [ -x "$CANDIDATE" ]; then
      export CHROME_PATH="$CANDIDATE"
      break
    fi
  done
fi

if [ -z "${CHROME_PATH:-}" ] || [ ! -x "$CHROME_PATH" ]; then
  echo "Tidak ada browser Chromium yang ditemukan. Set CHROME_PATH manual." >&2
  exit 1
fi

echo "Browser : $CHROME_PATH"
echo "Versi   : $("$CHROME_PATH" --version 2>/dev/null | head -1)"
echo "Run     : $RUNS per sel"

# macOS memakai bash 3.2, di mana "${arr[@]}" pada array KOSONG memicu
# "unbound variable" karena set -u. Karena itu array selalu diisi minimal
# satu elemen (--quiet) supaya tidak pernah kosong.
LH_ARGS=(--quiet)
SUFFIX=""
if [ -n "$PRESET" ]; then
  LH_ARGS+=(--preset="$PRESET")
  SUFFIX="_$PRESET"
fi

echo "Menghangatkan cache middleware..."
curl -s -m 120 "$MIDDLEWARE/cache/warmup" >/dev/null || true
curl -s -m 30 "$MIDDLEWARE/health" | head -c 200; echo

TOTAL=$(grep -vc '^#' "$ROOT/scripts/cells.txt" || true)
CELL=0

while IFS=$'\t' read -r STRATEGY TIER URL; do
  case "$STRATEGY" in \#*|"") continue ;; esac
  CELL=$((CELL + 1))
  echo
  echo "=== sel $CELL/$TOTAL — $STRATEGY / $TIER ==="
  echo "    $URL"

  for i in $(seq 1 "$RUNS"); do
    FILE="$OUT/${STRATEGY}_${TIER}_$(printf '%02d' "$i")${SUFFIX}.json"
    printf '    run %2d/%s ' "$i" "$RUNS"

    if lighthouse "$URL" \
        --only-categories=performance \
        --output=json \
        --output-path="$FILE" \
        --chrome-flags="--headless=new --no-sandbox --disable-extensions --disable-brave-update --disable-sync --no-first-run --disable-background-networking" \
        "${LH_ARGS[@]}" >>"$LOG" 2>&1; then
      echo "ok"
    else
      echo "GAGAL (lihat results/run.log)"
    fi
  done
done < "$ROOT/scripts/cells.txt"

echo
echo "Selesai. Raw JSON -> results/raw/"
echo "Langkah berikutnya: python3 scripts/extract-metrics.py"
