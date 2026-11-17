# Catatan harian, 17 November 2026

## Yang dikerjakan
- Moona dipindah ke kabel Ethernet (adaptor USB Realtek FE, **100 Mbps**) di lab kampus; IP baru 192.168.0.105 (DHCP).
  Mac dan Moona satu subnet (192.168.0.x). Kapasitas kabel (iperf3): ~93 Mbps kedua arah; anomali Mac->Moona 4 Mbps hilang.
- Build Next.js dan React diulang untuk IP baru (`scripts/moona/bangun-ulang.ps1`). Build pertama ternyata masih memuat IP lama
  (ditemukan lewat curl dari Mac: /ssg berisi 50 referensi 192.168.18.15), jadi diulang sebelum tes dimulai.
- Jam Mac dan Moona selaras (<1 detik, dari header Date).
- `monitor-server.ps1` diperluas: CPU per proses node (`node_top_core_pct`, `node_top_port`, `node_sum_core_pct`).
- k6 penuh 100/500/1000 VU x 4 kondisi (12 pengujian, 05:33-05:55 UTC). Hasil di `ringkasan-k6-kabel.md`.

## Hasil utama
- SSR dibatasi satu proses Node: ~108-114% satu inti sejak 100 VU, CPU total 42-45%; throughput mendatar ~75 req/s.
- CSR-React dan CSR-Next menjenuhkan satu inti pada 500-1000 VU (84-119%); jaringan bukan penyebab.
- SSG 500/1000 VU terbatas jaringan: Tx 95-96 Mbps = kapasitas kabel, node hanya ~55%. Membaik dari Wi-Fi (170 -> 217 req/s)
  tetapi tidak valid sebagai kapasitas server. Perlu adaptor gigabit bila ingin dibuktikan.
- Data valid: semua 100 VU; CSR-React, CSR-Next, SSR di 500/1000 VU.

## Keputusan dan sisa
- SSG 500/1000 VU: ditulis sebagai keterbatasan jaringan (belum beli adaptor gigabit; opsional).
- Berikutnya: pustaka (jurnal SLA/threshold, telusur Ismail 2023, Hanggara 2022, Oktafianto 2025, tambah Hermanto & Engel 2025),
  argumen pembatasan JPG dan MP4, lalu Bab 1, 3, 4, 5 dan slide.

## Commit
`cfcaacd` (skrip), `7a208dd` (data dan ringkasan kabel).
