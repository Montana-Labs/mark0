#!/usr/bin/env bash
#
# Load testing sisi server (RQ3).
#
# Menguji 4 strategi rendering pada 3 tingkat beban pengguna
# (100, 500, 1000 VU) sesuai kolokium 8.2.1 — sebagai pengukuran
# TERPISAH, bukan satu tanjakan panjang.
#
# Kenapa terpisah:
#   Beban tinggi yang bertahan lama memicu proteksi otomatis Vercel,
#   sehingga yang terukur bukan kapasitas aplikasi melainkan ambang
#   perlindungan platform. Terbukti 2 Nov 2026: satu ramp panjang ke
#   1000 VU menghasilkan error 56% bahkan pada file statis CDN, padahal
#   burst pendek 900 VU mencatat 0% error pada target yang sama.
#
# Kenapa hanya satu tier media:
#   k6 hanya mengunduh dokumen HTML, bukan gambar. Ukuran HTML praktis
#   sama di ketiga tier. Dinyatakan sebagai pembatasan cakupan RQ3.
#
# Pemakaian:
#   scripts/run-k6.sh                      # 100, 500, 1000 VU
#   VU_LEVELS="100 500" scripts/run-k6.sh  # lewati level 1000
#   TIER=heavy scripts/run-k6.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIER="${TIER:-light}"
VU_LEVELS="${VU_LEVELS:-100 500 1000}"
HOLD="${HOLD:-45s}"
COOLDOWN="${COOLDOWN:-45}"
OUT="$ROOT/results/k6"
mkdir -p "$OUT"

command -v k6 >/dev/null || { echo "k6 belum terpasang: brew install k6" >&2; exit 1; }

CELLS="
csr|https://mark0-react-$TIER.vercel.app/
csrnext|https://mark0-next-$TIER.vercel.app/csr
ssg|https://mark0-next-$TIER.vercel.app/ssg
ssr|https://mark0-next-$TIER.vercel.app/ssr
"

echo "Tier       : $TIER"
echo "Level VU   : $VU_LEVELS"
echo "Fase stabil: $HOLD   Jeda antar uji: ${COOLDOWN}s"
echo

cd "$ROOT/load-testing"

for VU in $VU_LEVELS; do
  echo "################  $VU pengguna virtual  ################"
  echo "$CELLS" | while IFS='|' read -r NAMA URL; do
    [ -z "$NAMA" ] && continue
    VUS="$VU" HOLD="$HOLD" TARGET_URL="$URL" LABEL="${NAMA}_${TIER}_${VU}vu" \
      k6 run --quiet k6-cell.js || true
    # jeda pemulihan: memberi waktu antrian tuntas dan menurunkan
    # peluang terpicunya rate limiting pada pengujian berikutnya
    sleep "$COOLDOWN"
  done
done

echo "Selesai. Ringkasan JSON -> results/k6/"
echo "Langkah berikutnya: python3 scripts/summarize-k6.py"
