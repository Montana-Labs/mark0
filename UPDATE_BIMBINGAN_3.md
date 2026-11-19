# Update Progres untuk Bimbingan 3 (Pak Dito)

> **Disiapkan:** 19 November 2026
> **Judul:** Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan Variasi Beban Media Menggunakan Core Web Vitals
> **Sejak bimbingan 2 (9 November 2026).** Detail: `results/ringkasan-k6-lokal.md`, `results/ringkasan-k6-kabel.md`, `PUSTAKA_DAN_ARGUMEN.md`.

## 1. Ringkasan

Sesuai arahan Bu Nila (bimbingan 1) dan persetujuan Bapak (bimbingan 2), load testing sisi server dipindah dari Vercel ke **server lokal**
(laptop Windows "Moona": Pentium Silver N6000, 4 inti, 7,75 GB RAM) lewat jaringan lokal. Pengujian k6 100/500/1000 VU untuk empat kondisi
(CSR-React, CSR-Next, SSG-Next, SSR-Next) sudah dijalankan **dua kali**: lewat Wi-Fi (16 Nov) dan lewat kabel Ethernet (17 Nov),
dengan pemantauan RAM, CPU, bandwidth, dan CPU per proses Node. Pustaka untuk metrik k6 dan argumen JPG/MP4 sudah mulai disusun.

## 2. Yang sudah dikerjakan

| # | Pekerjaan | Status |
|---|---|---|
| 1 | Menyiapkan server lokal (middleware :4000, Next.js :3000, React :5000), build produksi, bukti strategi rendering (`/ssg` statis, `/ssr` dinamis, `/csr` statis) | Selesai |
| 2 | Skrip pengujian otomatis (`run-k6-lokal.sh`): cek server, 100/500/1000 VU, catat waktu tiap pengujian, lewati bila server tumbang | Selesai |
| 3 | Pemantauan server tiap 1 detik: CPU, RAM, bandwidth, koneksi TCP, dan CPU per proses Node (sesuai permintaan Bu Nila: RAM dan bandwidth) | Selesai |
| 4 | k6 100/500/1000 VU x 4 kondisi lewat Wi-Fi 5 GHz (16 Nov) | Selesai |
| 5 | Pengukuran kapasitas jaringan (iperf3) dan pengulangan seluruh pengujian lewat kabel Ethernet (17 Nov) | Selesai |
| 6 | Penelusuran pustaka: tiga jurnal utama untuk metrik load testing (Hermanto & Engel 2025; Yuwono 2026; Annisa dkk. 2026), jurnal ambang waktu tunggu (Nah 2004; Galletta dkk. 2004), argumen pembatasan JPG dan MP4 | Sebagian (Oktafianto 2025 dan jurnal "SLA breach rate" belum ketemu) |
| 7 | Seluruh skrip, data, dan ringkasan tersimpan di repositori dan catatan | Selesai |

## 3. Hasil utama (k6 lewat kabel, server lokal)

| VU | Kondisi | req/s | Rata-rata | p95 | SLA >3 d |
|---|---|---|---|---|---|
| 100 | CSR-React | 82 | 22 ms | 46 ms | 0% |
| 100 | CSR-Next | 83 | 10 ms | 15 ms | 0% |
| 100 | SSG-Next | 83 | 14 ms | 20 ms | 0% |
| 100 | SSR-Next | 74 | 138 ms | 272 ms | 0% |
| 500 | CSR-React | 391 | 78 ms | 221 ms | 0% |
| 500 | CSR-Next | 410 | 25 ms | 83 ms | 0% |
| 500 | SSG-Next | 217 | 944 ms | 1153 ms | 0,2% |
| 500 | SSR-Next | 75 | 4718 ms | 5940 ms | 85,2% |
| 1000 | CSR-React | 612 | 375 ms | 700 ms | 0% |
| 1000 | CSR-Next | 544 | 553 ms | 804 ms | 0% |
| 1000 | SSG-Next | 216 | 2567 ms | 8803 ms | 13,5% |
| 1000 | SSR-Next | 75 | 9482 ms | 25636 ms | 93,9% |

**Temuan:**
1. **SSR dibatasi satu proses Node.** Sejak 100 VU proses Next.js memakai ~108% satu inti (CPU total hanya 42% dari empat inti);
   throughput mendatar di ~75 req/s pada 100, 500, dan 1000 VU. Pada 100 VU SSR ~10 kali lebih lambat dari CSR di sisi server (138 ms vs 14-22 ms).
2. **CSR-React dan CSR-Next menjenuhkan satu inti pada 500-1000 VU** (84-119%); itulah penyebab latensi naik, bukan jaringan.
3. **SSG pada 500 dan 1000 VU terbatas jaringan, bukan server**: trafik keluar 95-96 Mbps sama dengan kapasitas kabel 100 Mbps
   (iperf3 ~93 Mbps), sedangkan proses Node hanya ~55%. Hasil ini tidak dipakai sebagai kapasitas server.
4. Tidak ada tanda kebocoran memori dalam satu sesi (memori Node turun kembali setelah tes pada pengujian Wi-Fi).
5. Hasil valid penuh: semua 100 VU; CSR-React, CSR-Next, dan SSR di 500/1000 VU.

## 4. Kendala selama pengerjaan dan penyelesaiannya

| Kendala | Dampak | Penyelesaian |
|---|---|---|
| Vercel membatasi beban di atas 100 VU dan latensinya bercampur dengan internet | Tidak bisa menguji 500/1000 VU | Pindah ke server lokal, hanya pengujian 100 VU Vercel dipertahankan sebagai pembanding |
| Wi-Fi 2,4 GHz hanya ~30 Mbps | SSG tertahan di jaringan | Pindah ke 5 GHz (~75-80 Mbps), lalu kabel Ethernet (~93 Mbps) |
| Arah Mac ke server hanya ~4 Mbps (anomali) di Wi-Fi | Pengukuran jaringan meragukan | Hilang setelah memakai kabel (93 Mbps kedua arah) |
| Adaptor Ethernet yang dipakai hanya 100 Mbps (Fast Ethernet) | SSG 500/1000 VU tetap terbatas jaringan | Diakui sebagai keterbatasan; opsi: adaptor gigabit dan ulang hanya SSG |
| Alamat IP server tertanam di hasil build; ganti jaringan membuat build lama menunjuk IP yang mati | Halaman memanggil alamat yang sudah tidak ada | Skrip build ulang satu perintah; hasil build diverifikasi dari Mac sebelum tes |
| Profil jaringan Windows baru berstatus Public, aturan firewall hanya untuk Private | Server tidak terjangkau | Diubah ke Private |
| Skrip pemantauan awal terlalu berat (kueri ~2 detik per putaran, membebani CPU yang diukur) | Pengukuran tercemar | Ditulis ulang dengan PerformanceCounter; beban skrip kini 0,4-0,6% CPU |
| Monitoring awal hanya mencatat CPU total, sehingga pembatas SSR tidak terbukti | Dugaan "Node satu thread" belum teruji | Ditambah CPU per proses Node; dugaan terbukti pada pengujian kabel |
| Server sempat mati sekali di tengah sesi dan laptop berjalan dengan baterai | Data berisiko rusak | Skrip melewati dan mencatat pengujian yang server-nya tumbang; charger wajib tercolok |
| Jurnal acuan metrik: Hanggara tercantum 2022 di paper lain, ternyata 2024; Oktafianto (2025) belum bisa dibuka | Risiko salah kutip | Hanya jurnal yang sudah dibuka yang dipakai; yang belum dibuka ditandai |
| Ambang SLA 3 detik butuh rujukan jurnal | Awalnya hanya buku (Nielsen 1993) yang menyebut ambang ini | Ditemukan Yuwono (2026, JITEK 6(1)): respons <2-3 detik dianggap baik; ditopang eksperimen Nah (2004, ~2 detik) dan Galletta dkk. (2004, mendatar ~4 detik) |
| Data per pengujian baru satu kali jalan | Variasi antar-ulangan belum terukur | Dicatat sebagai keterbatasan; pengulangan jika waktu cukup |

## 5. Pertanyaan untuk Pak Dito

1. SSG 500/1000 VU terbatas jaringan (kabel 100 Mbps). Cukupkah dituliskan sebagai **keterbatasan terbukti** (trafik = kapasitas kabel, Node hanya ~55%),
   atau perlu diulang dengan adaptor gigabit?
2. Ambang SLA 3 detik: apakah boleh ditulis sebagai **ambang operasional** berdasarkan Yuwono (2026; respons <2-3 detik dianggap baik, mengutip Nielsen) dan ditopang eksperimen Nah (2004) dan Galletta dkk. (2004)?
3. Satu pengujian per sel (belum ada pengulangan): cukup untuk 100 VU dan temuan arah (SSR tersaturasi satu proses Node), atau perlu 3 kali ulangan?
4. Argumen pembatasan JPG dan MP4: apakah alasan "mengendalikan variabel ukuran media, bukan algoritma kompresi" sudah memadai (draf di `PUSTAKA_DAN_ARGUMEN.md`)?
5. Hasil ini menggambarkan satu mesin 4 inti dengan satu proses Node per layanan. Apakah perlu dicatat eksplisit bahwa produksi dengan banyak proses (cluster/PM2) dapat berbeda?

## 6. Rencana berikutnya

1. Perbarui Bab 4 dan `KETERBATASAN.md` dengan data server lokal dan bukti pembatas.
2. Lengkapi pustaka (naskah Oktafianto, jurnal untuk metrik "SLA breach rate"), masukkan Hermanto & Engel (2025) ke daftar pustaka.
3. Rombak Bab 1 dan Bab 3; tulis Bab 5.
4. Slide sidang dan hidden slides.
5. Target pendadaran: **Desember 2026**.
