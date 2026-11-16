# Ringkasan load testing k6 di server lokal (Moona)

Dijalankan 16 November 2026 (waktu UTC; 17 November dini hari WIB). Klien: Mac M1 (k6 v2.3.0).
Server: laptop Windows "Moona" (Pentium Silver N6000, 4 core, 7,75 GB RAM, Wi-Fi 5 GHz).
Detail mesin: `spesifikasi-server.txt`. Detail jaringan: `kapasitas-jaringan.md`.
Data mentah: `k6-lokal/*.json`, `k6-lokal/run-log.csv`, `monitor-lokal/monitor-20261117-003919.csv`.

Pola tiap pengujian: naik 15 d -> tahan 45 d -> turun 5 d, jeda 45 d antar pengujian, tier media light.
k6 hanya mengunduh dokumen HTML (bukan gambar/video).

## Hasil k6

| Tingkat | Kondisi | req/s | Rata-rata | p95 | Error | SLA breach (>3 d) |
|---|---|---|---|---|---|---|
| 100 VU | CSR-React | 83 | 14 ms | 26 ms | 0% | 0% |
| 100 VU | CSR-Next | 83 | 9 ms | 12 ms | 0% | 0% |
| 100 VU | SSG-Next | 83 | 15 ms | 23 ms | 0% | 0% |
| 100 VU | SSR-Next | 73 | 162 ms | 374 ms | 0% | 0% |
| 500 VU | CSR-React | 406 | 39 ms | 93 ms | 0% | 0% |
| 500 VU | CSR-Next | 411 | 24 ms | 52 ms | 0% | 0% |
| 500 VU | SSG-Next | 170 | 1446 ms | 3141 ms | 0% | 5,3% |
| 500 VU | SSR-Next | 92 | 3639 ms | 4472 ms | 0% | 84,6% |
| 1000 VU | CSR-React | 591 | 432 ms | 844 ms | 0% | 0,4% |
| 1000 VU | CSR-Next | 531 | 580 ms | 1269 ms | 0% | 0,1% |
| 1000 VU | SSG-Next | 96 | 4851 ms | 22283 ms | 0,66% | 34,1% |
| 1000 VU | SSR-Next | 91 | 7914 ms | 17029 ms | 0% | 91,0% |

Kode keluar k6 = 99 pada SSG dan SSR di 500 dan 1000 VU: ambang SLA breach (<5%) terlewati;
bukan k6 yang gagal. Semua 12 pengujian selesai (tidak ada kode 98 = dilewati).

## Monitoring server selama fase stabil

| Kondisi | CPU rata-rata 100/500/1000 VU | RAM terpakai maks | Trafik keluar rata-rata (maks) | TCP maks |
|---|---|---|---|---|
| CSR-React | 27 / 43 / 41% | 5,1 / 5,2 / 5,5 GB | 0,7 / 3,0 / 4,6 Mbps | 101 / 502 / 1002 |
| CSR-Next | 12 / 24 / 24% | 5,1 / 5,1 / 5,2 GB | 6,5 / 32 / 40 Mbps | 106 / 502 / 1002 |
| SSG-Next | 10 / 18 / 18% | 5,0 / 5,1 / 5,2 GB | 39 / 73 (85) / 62 (75) Mbps | 104 / 501 / 733 |
| SSR-Next | 31 / 38 / 39% | 5,2 / 5,4 / 5,6 GB | 34 / 40 / 37 Mbps | 189 / 1074 / 2059 |

Sebelum k6 (baseline ~68 d): CPU 14%, RAM terpakai ~5,9 GB, node ~381 MB.
Beban skrip monitoring sendiri: 0,4-0,6% CPU. Throttling CPU tidak terdeteksi (`cpu_perf_pct` > 190%).

## Interpretasi

1. **SSG di 500 dan 1000 VU terbatas jaringan, bukan server.** Trafik keluar 73 Mbps (maks 85) di 500 VU
   sama dengan kapasitas Wi-Fi terukur (~75-80 Mbps), sedangkan CPU hanya 18%. Jangan dipakai sebagai kapasitas server.
2. **CPU total tidak jenuh di mana pun** (maks 73%). Penyebab SSR mendatar di ~91 req/s (500 -> 1000 VU) dan
   naiknya latensi CSR/CSR-Next di 1000 VU belum terbukti. Dugaan: proses Node berjalan satu thread, sehingga
   satu proses yang jenuh hanya tampak ~25% dari CPU empat inti. Monitoring belum memisahkan CPU per proses.
3. **SSR bukan terbatas jaringan** (trafik ~37-40 Mbps). Koneksi TCP ~2 kali jumlah VU karena tiap request SSR
   juga membuka koneksi dari Next.js ke middleware.
4. **RAM tidak jadi pembatas** (maks 5,6 GB terpakai; tersedia minimum 2,4 GB).
5. **Tidak ada indikasi memory leak dalam satu sesi:** memori proses node naik hingga ~1000 MB lalu turun ke
   243 MB dalam ~13 menit setelah tes (di bawah baseline 381 MB); RAM sistem turun dari 5557 ke 4834 MB.
6. **Pola antar strategi:** pada 100 VU (kondisi bersih) SSR ~11 kali lebih lambat dari CSR di sisi server
   (162 ms vs 14 ms); di pengujian Vercel rasionya ~4 kali (200 ms vs 51 ms). Perbedaan lingkungan (LAN vs internet,
   mesin) perlu dicatat saat membandingkan.

## Catatan validitas dan langkah lanjut

- Valid penuh: 100 VU (keempat kondisi).
- Valid sebagai data server: SSR di 500/1000 VU; CSR-React dan CSR-Next di 500/1000 VU.
- Harus ditandai terbatas jaringan: SSG di 500 dan 1000 VU.
- Anomali jaringan yang belum dijelaskan: arah Mac -> Moona hanya ~4 Mbps (iperf3), arah respons ~65-80 Mbps.
- Untuk membuktikan pembatas SSR/CSR: tambah kolom CPU per proses node pada `scripts/monitor-server.ps1`,
  lalu ulangi pengujian. Untuk membuat SSG 500/1000 VU valid: sambungan kabel (adaptor USB-C ke Ethernet gigabit)
  pada Moona. Jika adaptor didapat, ulangi seluruh pengujian sekalian.
- Ini data sesi tunggal (satu kali jalan per sel); pengulangan belum dilakukan.
