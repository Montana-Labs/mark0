# Ringkasan load testing k6 di server lokal (Moona) lewat kabel Ethernet

Dijalankan 17 November 2026, 05:33-05:55 UTC (12:33-12:55 WIB), di lab kampus. Klien: Mac M1 (k6 v2.3.0, Wi-Fi, subnet 192.168.0.x).
Server: Moona (Pentium Silver N6000, 4 inti, 7,75 GB RAM) lewat adaptor USB Ethernet `Realtek USB FE Family Controller`
(100 Mbps, IP 192.168.0.105, Wi-Fi mati). Kapasitas kabel (iperf3): ~93 Mbps kedua arah.
Jam Mac dan Moona selaras (selisih <1 detik, dari header Date). Build Next.js dan React dibuat ulang untuk IP ini (diverifikasi dari Mac).
Pola: naik 15 d, tahan 45 d, turun 5 d, jeda 45 d, tier light, k6 hanya mengunduh HTML.
Data: `k6-kabel/*.json`, `k6-kabel/run-log.csv`, `monitor-kabel/monitor-20261117-122713.csv` (CPU per proses node ditambahkan di sini).
Data Wi-Fi sebelumnya (16 Nov) tetap di `ringkasan-k6-lokal.md`.

## Hasil k6

| VU | Kondisi | req/s | Rata-rata | p95 | Error | SLA >3 d |
|---|---|---|---|---|---|---|
| 100 | CSR-React | 82 | 22 ms | 46 ms | 0% | 0% |
| 100 | CSR-Next | 83 | 10 ms | 15 ms | 0% | 0% |
| 100 | SSG | 83 | 14 ms | 20 ms | 0% | 0% |
| 100 | SSR | 74 | 138 ms | 272 ms | 0% | 0% |
| 500 | CSR-React | 391 | 78 ms | 221 ms | 0% | 0% |
| 500 | CSR-Next | 410 | 25 ms | 83 ms | 0% | 0% |
| 500 | SSG | 217 | 944 ms | 1153 ms | 0% | 0,2% |
| 500 | SSR | 75 | 4718 ms | 5940 ms | 0% | 85,2% |
| 1000 | CSR-React | 612 | 375 ms | 700 ms | 0% | 0% |
| 1000 | CSR-Next | 544 | 553 ms | 804 ms | 0% | 0% |
| 1000 | SSG | 216 | 2567 ms | 8803 ms | 0% | 13,5% |
| 1000 | SSR | 75 | 9482 ms | 25636 ms | 0,24% | 93,9% |

Kode keluar 99 (ambang SLA terlewati) pada SSR 500/1000 dan SSG 1000 VU; bukan kegagalan k6. Tidak ada kode 98.

## Monitoring server, fase stabil (detik 15-60 tiap pengujian)

`Node tersibuk` = CPU proses node.exe tersibuk, dalam % dari SATU inti (100 = satu inti penuh).
Nilai sedikit di atas 100 mungkin karena thread tambahan (GC, libuv).

| Pengujian | CPU total | Node tersibuk rata-rata (maks) | Port | Tx rata-rata (maks) Mbps | TCP maks |
|---|---|---|---|---|---|
| CSR-React 100 | 21% | 27 (42) | 5000 | 1 (1) | 106 |
| CSR-Next 100 | 15% | 20 (31) | 3000 | 7 (7) | 105 |
| SSG 100 | 20% | 26 (38) | 3000 | 40 (41) | 105 |
| SSR 100 | 42% | **108 (125)** | 3000 | 36 (40) | 145 |
| CSR-React 500 | 45% | **99 (146)** | 5000 | 3 (4) | 504 |
| CSR-Next 500 | 40% | 84 (107) | 3000 | 33 (34) | 507 |
| SSG 500 | 32% | 55 (78) | 3000 | **96 (97)** | 519 |
| SSR 500 | 45% | **113 (152)** | 3000 | 31 (40) | 1077 |
| CSR-React 1000 | 52% | **119 (150)** | 5000 | 5 (7) | 1008 |
| CSR-Next 1000 | 44% | **103 (118)** | 3000 | 41 (45) | 1006 |
| SSG 1000 | 32% | 56 (93) | 3000 | **95 (97)** | 970 |
| SSR 1000 | 44% | **114 (162)** | 3000 | 30 (42) | 1974 |

Baseline sebelum tes: CPU ~14%, node ~406 MB.

## Interpretasi

1. **SSR dibatasi satu proses Node (Next.js) yang menjenuhkan satu inti.** Sudah pada 100 VU proses port 3000 memakai
   ~108% satu inti, sementara CPU total hanya 42% dari empat inti. Throughput SSR mendatar di ~75 req/s pada 100/500/1000 VU,
   dan latensi naik karena antrean. Dugaan "Node satu thread" pada data Wi-Fi sekarang terbukti oleh data per proses.
2. **CSR-React (serve) dan CSR-Next menjenuhkan satu inti pada 500-1000 VU** (99-119% dan 84-103%); itu penyebab
   naiknya latensi di 1000 VU, bukan jaringan (Tx hanya 3-45 Mbps).
3. **SSG di 500 dan 1000 VU tetap terbatas jaringan.** Tx 95-96 Mbps = kapasitas kabel 100 Mbps (iperf3 ~93), sementara
   proses node hanya ~55% satu inti. Jangan dipakai sebagai kapasitas server. Membaik dari data Wi-Fi (170 -> 217 req/s)
   tetapi belum valid. Butuh adaptor gigabit (dan port router gigabit).
4. Valid sebagai data server: semua 100 VU; CSR-React, CSR-Next, dan SSR di 500/1000 VU.
5. Satu mesin lemah (4 inti, satu proses Node per layanan) dipakai; hasil menggambarkan perilaku pada konfigurasi ini,
   bukan produksi dengan banyak proses/inti. Sesi tunggal, belum ada pengulangan.
