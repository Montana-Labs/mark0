#!/usr/bin/env bash
#
# Load testing sisi server (RQ3) terhadap SERVER LOKAL (laptop Windows "Moona")
# lewat jaringan lokal. Pengganti scripts/run-k6.sh (Vercel) sesuai arahan
# Bu Nila (bimbingan 1, 5 Nov 2026) dan persetujuan Pak Dito (bimbingan 2,
# 9 Nov 2026). Skrip Vercel dibiarkan utuh sebagai bukti pengujian pertama.
#
# Perbedaan dari run-k6.sh:
#   - Target = http://$HOST:<port>, bukan *.vercel.app
#   - Hasil ke results/k6-lokal/ (data Vercel di results/k6-valid tidak tertimpa)
#   - Pengecekan awal: semua target harus membalas 200, kalau tidak berhenti
#   - Mencatat waktu mulai/selesai tiap pengujian ke run-log.csv, supaya data
#     monitoring RAM/CPU/bandwidth di server bisa dicocokkan per pengujian
#   - Menaikkan batas berkas terbuka (ulimit -n) untuk 500-1000 VU
#
# Pemakaian:
#   scripts/run-k6-lokal.sh                       # 100, 500, 1000 VU
#   VU_LEVELS="100" scripts/run-k6-lokal.sh       # hanya 100 VU
#   HOST=192.168.18.15 scripts/run-k6-lokal.sh
#   CHECK_ONLY=1 scripts/run-k6-lokal.sh          # hanya cek target, tanpa k6
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="${HOST:-192.168.18.15}"
VU_LEVELS="${VU_LEVELS:-100 500 1000}"
HOLD="${HOLD:-45s}"
COOLDOWN="${COOLDOWN:-45}"
TIER="${TIER:-light}"          # hanya label berkas; tier ditentukan saat build di server
OUT="${OUT:-$ROOT/results/k6-lokal}"
LOG="$OUT/run-log.csv"
mkdir -p "$OUT"

command -v k6 >/dev/null || { echo "k6 belum terpasang: brew install k6" >&2; exit 1; }

# 500-1000 VU membuka ratusan koneksi; batas bawaan macOS (256) terlalu kecil.
ulimit -n 10240 2>/dev/null || echo "PERINGATAN: gagal menaikkan ulimit -n (sekarang: $(ulimit -n)). Error 'too many open files' mungkin muncul." >&2

CELLS="
csr|http://$HOST:5000/
csrnext|http://$HOST:3000/csr
ssg|http://$HOST:3000/ssg
ssr|http://$HOST:3000/ssr
"

echo "Server     : $HOST"
echo "Tier       : $TIER"
echo "Level VU   : $VU_LEVELS"
echo "Fase stabil: $HOLD   Jeda antar uji: ${COOLDOWN}s"
echo "Hasil      : $OUT"
echo

# Pengecekan awal: semua target harus 200.
echo "Cek target..."
GAGAL=0
echo "$CELLS" | while IFS='|' read -r NAMA URL; do
  [ -z "$NAMA" ] && continue
  KODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL" || true)
  printf "  %-8s %s -> %s\n" "$NAMA" "$URL" "$KODE"
  [ "$KODE" = "200" ] || exit 1
done || GAGAL=1
if [ "$GAGAL" -ne 0 ]; then
  echo "Ada target yang tidak membalas 200. Berhenti." >&2
  exit 1
fi
echo

[ "${CHECK_ONLY:-0}" = "1" ] && { echo "CHECK_ONLY: semua target OK, k6 tidak dijalankan."; exit 0; }

[ -f "$LOG" ] || echo "label,vus,url,mulai_epoch,selesai_epoch,mulai_iso,selesai_iso,exit_k6" > "$LOG"

cd "$ROOT/load-testing"

for VU in $VU_LEVELS; do
  echo "################  $VU pengguna virtual  ################"
  echo "$CELLS" | while IFS='|' read -r NAMA URL; do
    [ -z "$NAMA" ] && continue
    LABEL="${NAMA}_${TIER}_${VU}vu"

    # Pastikan server masih hidup sebelum tiap pengujian. Kalau tumbang (mis. kehabisan
    # memori pada beban tinggi), tunggu sampai 60 detik; kalau tetap mati, lewati dan catat
    # kode 98 di run-log.csv supaya tidak ada data sampah yang tampak seperti hasil valid.
    HIDUP=0
    for _ in 1 2 3 4 5 6; do
      K=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL" || true)
      [ "$K" = "200" ] && { HIDUP=1; break; }
      echo "  $LABEL: target belum membalas 200 (kode $K), tunggu 10 detik..." >&2
      sleep 10
    done
    if [ "$HIDUP" -ne 1 ]; then
      echo "  $LABEL: DILEWATI, server tidak pulih dalam 60 detik" >&2
      N=$(date +%s); NI=$(date -u +%Y-%m-%dT%H:%M:%SZ)
      echo "$LABEL,$VU,$URL,$N,$N,$NI,$NI,98" >> "$LOG"
      continue
    fi

    MULAI=$(date +%s); MULAI_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    KODE=0
    VUS="$VU" HOLD="$HOLD" TARGET_URL="$URL" LABEL="$LABEL" OUT_DIR="$OUT" \
      k6 run --quiet k6-cell.js || KODE=$?
    SELESAI=$(date +%s); SELESAI_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "$LABEL,$VU,$URL,$MULAI,$SELESAI,$MULAI_ISO,$SELESAI_ISO,$KODE" >> "$LOG"
    # jeda pemulihan: server lokal (CPU lemah) perlu waktu menurunkan beban
    # dan melepas memori sebelum pengujian berikutnya
    sleep "$COOLDOWN"
  done
done

echo "Selesai. Ringkasan JSON -> results/k6-lokal/   Log waktu -> $LOG"
