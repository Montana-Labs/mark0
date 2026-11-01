#!/usr/bin/env bash
#
# Load testing sisi server (RQ3).
#
# Menguji empat strategi rendering pada SATU tier beban media.
#
# Kenapa hanya satu tier:
#   k6 hanya mengunduh dokumen HTML, tidak mengunduh gambar. Ukuran HTML
#   praktis sama di ketiga tier karena yang berbeda hanya alamat gambar,
#   bukan gambarnya. Jadi menjalankan ketiga tier akan menghasilkan angka
#   yang sama sambil menghabiskan kuota bandwidth. Hal ini dinyatakan
#   sebagai pembatasan cakupan RQ3 di Bab 3.
#
# Pemakaian:
#   scripts/run-k6.sh                 # profil penuh, 0->100->500->1000 VU
#   PROFILE=smoke scripts/run-k6.sh   # uji coba ringan, 20 VU
#   TIER=heavy scripts/run-k6.sh      # ganti tier (default light)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIER="${TIER:-light}"
PROFILE="${PROFILE:-full}"
OUT="$ROOT/results/k6"
mkdir -p "$OUT"

if ! command -v k6 >/dev/null; then
  echo "k6 belum terpasang. Jalankan: brew install k6" >&2
  exit 1
fi

CELLS="
csr|https://mark0-react-$TIER.vercel.app/
csrnext|https://mark0-next-$TIER.vercel.app/csr
ssg|https://mark0-next-$TIER.vercel.app/ssg
ssr|https://mark0-next-$TIER.vercel.app/ssr
"

echo "Tier    : $TIER"
echo "Profil  : $PROFILE"
echo "Keluaran: results/k6/"
echo

cd "$ROOT/load-testing"

echo "$CELLS" | while IFS='|' read -r NAMA URL; do
  [ -z "$NAMA" ] && continue
  echo "=== $NAMA — $URL ==="
  PROFILE="$PROFILE" TARGET_URL="$URL" LABEL="${NAMA}_${TIER}" \
    k6 run --quiet k6-cell.js || echo "  (k6 melaporkan ambang terlampaui — lihat angkanya di atas)"
  echo

  # jeda antar sel supaya antrian request sebelumnya tuntas dan
  # pengujian berikutnya tidak mewarisi beban sisa
  sleep 20
done

echo "Selesai. Ringkasan JSON -> results/k6/"
echo "Langkah berikutnya: python3 scripts/summarize-k6.py"
