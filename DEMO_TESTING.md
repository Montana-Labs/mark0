# Latihan Demo: Menjelaskan Bagian Testing

> Tujuan: bisa menunjukkan ke Bu Nila dan Pak Dito **apa yang saya masukkan (input)**, **apa yang terjadi (proses)**,
> **apa yang keluar (output)**, dan **bagaimana membacanya**, tanpa membaca teks.
> Pasangan dokumen: `UPDATE_BIMBINGAN_4.md` (isi update dan tabel hasil).

---

## 1. Peta besar (kalimat pembuka demo)

> "Pengujian saya ada dua, karena yang ditanyakan juga dua sisi. **Lighthouse** mengukur apa yang dirasakan pengguna di
> browser (LCP, CLS, dan metrik pendukung), dipakai untuk RQ1 (pengaruh strategi) dan RQ2 (pengaruh beban media).
> **k6** mengukur seberapa berat server membuat halaman saat diakses banyak orang sekaligus, dipakai untuk RQ3."

| | Lighthouse | k6 |
|---|---|---|
| Sisi yang diukur | Klien (browser) | Server |
| Yang diunduh | Semua: HTML, JS, gambar, video | Hanya dokumen HTML |
| Variabel | 4 kondisi x 3 tier media | 4 kondisi x 3 level VU (tier light) |
| Ulangan | 15 run per sel = 180 run | 1 kali per sel, di beberapa lingkungan |
| Target | Deployment Vercel | Server fisik di LAN (Vercel hanya pembanding 100 VU) |
| Output akhir | `results/metrics.csv` → `results/analisis.md` | `results/k6-i5/*.json` + `results/monitor-i5/*.csv` |

Empat kondisi: **CSR-React** (React + Vite), **CSR-Next** (Next.js, `next/dynamic ssr:false`), **SSG-Next**, **SSR-Next**.
CSR-Next sengaja ditambahkan supaya pengaruh *strategi* bisa dipisah dari pengaruh *framework*.

---

## 2. k6: alur input → proses → output

```
 [Mac M1, klien]                                   [Laptop i5, server]
 scripts/run-k6-lokal.sh                           scripts/monitor-server.ps1
   │ 1. cek 4 URL harus 200                          │ tulis 1 baris/detik:
   │ 2. untuk VU = 100, 500, 1000                    │ CPU, RAM, bandwidth,
   │      untuk tiap kondisi:                        │ TCP, CPU proses Node
   │        - cek server hidup                       │
   │        - jalankan load-testing/k6-cell.js  ───► HTTP GET ke :5000 / :3000
   │        - catat jam mulai & selesai              │
   │        - jeda 45 detik                          │
   ▼                                                 ▼
 results/k6-i5/<kondisi>_light_<VU>vu.json         results/monitor-i5/monitor-*.csv
 results/k6-i5/run-log.csv  ── dicocokkan lewat jam (epoch) ──┘
```

Kalimat demo:
> "Skrip di Mac yang menyerang, skrip di server yang mencatat. Keduanya punya jam (epoch), jadi setiap uji bisa saya
> potong datanya dari file monitoring berdasarkan jam mulai dan selesai di `run-log.csv`."

---

## 3. INPUT — apa yang saya atur

### 3.1 `load-testing/k6-cell.js` (satu sel uji)

Variabel yang diisi dari luar (environment variable):

| Variabel | Arti | Contoh |
|---|---|---|
| `TARGET_URL` | Alamat yang diserang | `http://192.168.18.92:3000/ssr` |
| `VUS` | Jumlah pengguna virtual | `100`, `500`, `1000` |
| `HOLD` | Lama fase stabil | `45s` |
| `LABEL` | Nama berkas hasil | `ssr_light_1000vu` |
| `OUT_DIR` | Folder hasil | `results/k6-i5` |

Skenario (executor `ramping-vus`):

```
 VU
1000 ┤        ┌───────────────────────────┐
     │       ╱                             ╲
     │      ╱                               ╲
   0 ┼─────╯                                 ╰──
     0s   15s                            60s  65s
      naik         stabil (HOLD 45s)        turun
```

Yang dilakukan setiap VU dalam satu putaran (iterasi):

```js
const res = http.get(TARGET_URL, ...);        // 1. minta dokumen HTML
httpErrors.add(res.status !== 200);           // 2. gagal kalau bukan 200
slaBreaches.add(res.timings.duration > 3000); // 3. lewat SLA kalau > 3 detik
sleep(1);                                     // 4. "berpikir" 1 detik, lalu ulang
```

Poin yang wajib bisa dijelaskan:
- **Error dan SLA breach dipisah.** Di pilot study keduanya tercampur sehingga terbaca "error 100%", padahal server tetap
  membalas 200, hanya lambat. Sekarang: *error* = server gagal; *SLA breach* = server berhasil tapi terlalu lama.
- **`sleep(1)`** meniru jeda pengguna antar klik (think time). Akibatnya satu VU paling banyak ±1 permintaan per detik.
- **`thresholds`** (error <1%, SLA breach <5%) hanya untuk pelaporan (`abortOnFail: false`); uji tidak dihentikan.

### 3.2 `scripts/run-k6-lokal.sh` (menjalankan 12 sel)

| Bagian | Gunanya |
|---|---|
| `CELLS` | 4 target: CSR-React `:5000/`, CSR-Next `:3000/csr`, SSG `:3000/ssg`, SSR `:3000/ssr` |
| Cek awal 200 | Kalau ada target mati, berhenti, supaya tidak ada data sampah |
| Cek hidup sebelum tiap uji | Tunggu sampai 60 detik; kalau tetap mati, catat kode `98` dan lewati |
| `ulimit -n 10240` | macOS bawaan hanya 256 berkas terbuka; 1000 VU butuh lebih |
| `COOLDOWN=45` | Jeda antar uji supaya server pulih (CPU turun, memori dilepas) dan uji tidak saling mencemari |
| `run-log.csv` | Jam mulai/selesai + kode keluar k6 per uji |

### 3.3 Hitungan yang sering ditanyakan: kenapa 100 VU selalu ±83 req/s?

Karena batasnya **desain skenario**, bukan server:

```
VU-detik total  = naik (15 s x rata-rata 50 VU) + stabil (45 s x 100) + turun (5 s x 50)
                = 750 + 4.500 + 250 = 5.500
Iterasi maks    ≈ 5.500 (karena tiap VU tidur 1 detik per iterasi)
Hasil nyata     = 5.342 - 5.490 request   ← cocok
Throughput      ≈ 5.459 / ±66 detik ≈ 83 req/s
```

Artinya pada 100 VU server belum tertekan; yang dibandingkan adalah **waktu respons** (SSR 38 ms vs CSR 9-15 ms).
Pada 500 VU batasnya ~5 x lebih tinggi (±410 req/s): CSR mencapainya, SSR tertahan di ±159 → **di situ server jenuh**.

### 3.4 `scripts/monitor-server.ps1` (di server)

Kolom penting di CSV:

| Kolom | Arti | Cara membaca |
|---|---|---|
| `cpu_pct` | CPU total semua inti | Bisa rendah walau server sudah jenuh |
| `node_top_core_pct` | CPU proses Node tersibuk, % dari **satu inti** | ~100% atau lebih = proses itu jenuh |
| `node_top_port` | Port proses tersibuk | 3000 Next.js, 5000 React, 4000 middleware |
| `mem_used_mb`, `node_ws_mb` | RAM terpakai, memori semua proses Node | Naik lalu turun = normal; tertahan naik = curiga memory leak |
| `net_tx_mbps` | Trafik keluar server | Mendekati kapasitas link = terbatas jaringan |
| `tcp_established` | Koneksi TCP aktif | Naik sesuai VU; jauh di atas VU = koneksi antre |
| `monitor_cpu_pct` | Beban skrip monitor sendiri | 0,4-0,9%, jadi pengukur tidak mencemari hasil |

---

## 4. OUTPUT — apa yang keluar dan cara membacanya

### 4.1 Layar terminal (dari `handleSummary`)

Contoh nyata (uji coba 26 Nov, 5 VU; format layar sama untuk semua uji):

```
  demo_ssr_5vu  @ 5 VU
  total request     82
  throughput        3 req/s
  durasi rata-rata  183 ms
  durasi median     140 ms
  durasi p95        444 ms
  durasi maks       790 ms
  error rate        0.00 %   (respons bukan 200)
  SLA breach rate   0.00 %   (respons > 3000 ms)
```

### 4.2 Berkas JSON per sel

Contoh `results/k6-i5/ssr_light_1000vu.json` (dibulatkan):

| Field | Nilai | Arti |
|---|---|---|
| `total_requests` | 10.729 | Jumlah permintaan selesai |
| `throughput_rps` | 157 | Permintaan per detik = **kapasitas** |
| `duration_avg_ms` | 4.350 | Rata-rata waktu respons |
| `duration_med_ms` | 4.692 | Separuh permintaan lebih cepat dari ini |
| `duration_p95_ms` | 8.940 | 95% permintaan lebih cepat dari ini (yang dialami pengguna "sial") |
| `duration_max_ms` | 22.975 | Terlama |
| `http_error_rate` | 0 | Tidak ada respons gagal |
| `sla_breach_rate` | 0,7058 | 70,58% permintaan lebih dari 3 detik |

Cara membaca (latih kalimat ini):
> "Pada 1000 VU, SSR tidak error sama sekali, tapi 70% permintaan melebihi 3 detik. Throughput-nya 157 req/s, sama dengan
> pada 500 VU, artinya server sudah mentok: VU ditambah, yang bertambah hanya antrean, bukan yang dilayani."

Kenapa p95 dan bukan hanya rata-rata: rata-rata bisa terlihat baik walau sebagian pengguna menunggu sangat lama. p95 menunjukkan
pengalaman pengguna yang paling lambat (5% terburuk dibuang supaya tidak terpengaruh satu-dua kejadian ekstrem).

### 4.3 `run-log.csv` — kode keluar

| Kode | Arti | Contoh di data i5 |
|---|---|---|
| `0` | Uji selesai, semua threshold lolos | CSR dan CSR-Next semua level |
| `99` | Uji **selesai**, tapi threshold dilanggar (error ≥1% atau SLA breach ≥5%) | SSG 500 (SLA 5,15%), SSG 1000, SSR 1000 |
| `98` | Dibuat skrip saya: server tidak hidup, uji dilewati | Tidak ada di data i5 |

Penting: **99 bukan berarti datanya rusak**; datanya tetap valid, justru menandai titik jenuh.

### 4.4 Menyambungkan k6 dengan monitoring (bukti "kenapa")

Contoh SSR 1000 VU, jendela 19:26:09-19:27:17 UTC:

| Bukti | Nilai | Kesimpulan |
|---|---|---|
| CPU total | maks 26% | Mesin terlihat santai... |
| CPU proses Node port 3000 | maks 176% satu inti | ...tapi proses Next.js jenuh |
| Throughput 500 vs 1000 VU | 159 vs 157 req/s | Kapasitas mendatar |
| RAM | 5,5 GB dari 8 GB, kembali ke 5,0 GB setelah uji | Bukan masalah memori, tidak bocor |

> "Jadi pembatas SSR adalah CPU untuk merender halaman di satu proses Node, bukan RAM dan bukan jaringan."

Bandingkan dengan SSG 1000 VU: CPU 7%, Node 39%, TX 125 Mbps dari 1 Gbps, tapi throughput hanya 134 req/s. Server menganggur,
jadi hambatannya di luar server (jalur klien). Karena itu tidak dipakai sebagai kapasitas server.

---

## 5. Skenario demo langsung (±10 menit) — ke server i5, bukan Vercel

Demo memakai **lingkungan yang sama dengan data penelitian**: laptop i5 sebagai server, Mac sebagai klien k6, satu jaringan.
Beban dikecilkan (50 VU, 15 detik) supaya cepat; angka demo tidak menggantikan data penelitian.

### 5.0 Persiapan di laptop i5 (sebelum dosen datang)

Mac dan laptop i5 harus di **jaringan yang sama**. Di PowerShell **Administrator**:

```powershell
cd C:\Skripsi\mark0
git pull
powershell -ExecutionPolicy Bypass -File .\scripts\moona\buka-firewall.ps1
```

Lalu di PowerShell biasa:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\moona\mulai-tes.ps1 -Ip 192.168.18.92
```

Muncul 4 jendela: middleware, Next.js, React, dan monitoring. Biarkan monitoring berjalan.

**Kalau demo di kampus (bukan di rumah):** IP i5 pasti berubah, dan IP tertanam di hasil build. Cek IP baru dengan `ipconfig`,
lalu build ulang dulu (beberapa menit, lakukan jauh sebelum bimbingan):

```powershell
cd api-middleware; pnpm build; cd ..
powershell -ExecutionPolicy Bypass -File .\scripts\moona\bangun-ulang.ps1 -Ip <IP_BARU>
powershell -ExecutionPolicy Bypass -File .\scripts\moona\mulai-tes.ps1 -Ip <IP_BARU>
```

Jaringan kampus sering memblokir koneksi antar-perangkat; kalau `curl` dari Mac gagal, pakai hotspot HP untuk kedua laptop
(IP berubah lagi, ulangi build). Cadangan terakhir: rekam video demo di rumah dan tunjukkan data asli (langkah 4).

### 5.1 Langkah demo di Mac

**Langkah 1. Cek server (30 detik).** Dari folder repo:

```bash
HOST=192.168.18.92 CHECK_ONLY=1 scripts/run-k6-lokal.sh
```

Keempat target harus `200`. Jelaskan: "Skrip menolak jalan kalau ada target mati, supaya tidak ada data sampah."

**Langkah 2. Tunjukkan skrip (2 menit).** Buka `load-testing/k6-cell.js`, tunjuk 4 hal: `stages`, `sleep(1)`, dua metrik
`http_errors`/`sla_breaches`, dan `SLA_MS = 3000`.

**Langkah 3. Uji mini SSR lalu CSR (3 menit).**

```bash
cd load-testing
VUS=50 HOLD=15s TARGET_URL=http://192.168.18.92:3000/ssr LABEL=demo_ssr OUT_DIR=/tmp k6 run --quiet k6-cell.js
VUS=50 HOLD=15s TARGET_URL=http://192.168.18.92:5000/ LABEL=demo_csr OUT_DIR=/tmp k6 run --quiet k6-cell.js
```

Selama uji berjalan, ajak dosen melihat **jendela monitoring di i5**: kolom `node_top_core_pct` naik saat SSR (port 3000),
jauh lebih kecil saat CSR (port 5000). Itu bukti langsung "SSR membebani CPU server, CSR tidak".
Untuk ringkasan bawaan k6 yang lengkap, hapus `--quiet`.

**Langkah 4. Buka data asli (3 menit).** `results/k6-i5/ssr_light_1000vu.json` lalu `results/k6-i5/run-log.csv`
(tunjuk kode 99). Lalu `results/monitor-i5/monitor-20261125-020139.csv`, cari baris dengan epoch antara
1795548369 dan 1795548437 (SSR 1000 VU), tunjuk `node_top_core_pct` ~176.

**Langkah 5. Tarik kesimpulan (2 menit).** Pakai tabel 4.2 di `UPDATE_BIMBINGAN_4.md`: CSR 4,7-5,2x kapasitas SSR pada 1000 VU.

### 5.2 Setelah demo

Ctrl+C di jendela server dan monitoring, lalu di PowerShell Administrator:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\moona\tutup-firewall.ps1
```

---

## 6. Lighthouse: input → output (versi singkat)

**Input** (`scripts/run-lighthouse.sh`):

| Pengaturan | Nilai | Alasan |
|---|---|---|
| Run per sel | 15 | Perlu data per run untuk SD dan uji statistik |
| Sel | 4 kondisi x 3 tier = 12 sel → 180 run | |
| Kategori | `--only-categories=performance` | Hanya performa |
| Perangkat | Default Lighthouse: emulasi mobile | Default yang paling lazim |
| Throttling | `devtools` | Data `simulate` sebelumnya menghasilkan LCP tidak valid (KETERBATASAN butir 14) |
| `--max-wait-for-load` | 240.000 ms | Tier heavy butuh waktu lama; tanpa ini terpotong |
| Browser | Headless Chromium (Brave) tanpa ekstensi | Testbed tidak memuat resource pihak ketiga; diverifikasi lewat kolom `image_requests` |

**Proses dan output:**

```
results/raw/<kondisi>_<tier>_<nn>.json   (180 berkas, laporan mentah Lighthouse)
        │ python3 scripts/extract-metrics.py
        ▼
results/metrics.csv                     (1 baris per run: LCP, FCP, TBT, CLS, SI, TTI, byte gambar/video)
        │ .venv/bin/python scripts/analyze.py
        ▼
results/analisis.md                     (deskriptif → Shapiro-Wilk + Levene → ANOVA/Kruskal-Wallis → post-hoc → effect size)
```

Kalimat demo:
> "Satu baris per run, bukan rata-rata, karena tanpa data per run tidak ada standar deviasi dan tidak bisa diuji statistik.
> Asumsi normalitas tidak terpenuhi, jadi semua 78 uji memakai Kruskal-Wallis dengan post-hoc Mann-Whitney Bonferroni."

---

## 7. Latihan tanya jawab

### Bu Nila (teknis)

| Pertanyaan | Jawaban singkat |
|---|---|
| Kenapa k6, bukan JMeter seperti jurnal acuan? | Metrik yang diukur sama (response time, throughput, error). k6 berbasis skrip JavaScript sehingga skenario tersimpan di repo dan bisa diulang persis; ringan di Mac klien. |
| Kenapa ada `sleep(1)`? | Meniru jeda pengguna. Tanpa itu, 100 VU akan menembak secepat mungkin dan yang diuji bukan lagi "100 pengguna". Konsekuensinya 100 VU ≈ 83 req/s (hitungan 3.3). |
| Kenapa hanya HTML, tidak mengunduh gambar? | Yang ingin diukur biaya server membuat dokumen per strategi. Gambar disajikan sama untuk semua kondisi; pengaruhnya diukur di Lighthouse. Dicatat di KETERBATASAN butir 17. |
| Kenapa hanya tier light di k6? | Karena HTML-nya hampir sama antartier (yang berbeda berkas medianya, yang tidak diunduh k6). |
| Kenapa SSG lebih lambat dari SSR di 1000 VU, padahal statis? | Server SSG menganggur (CPU 7%, Node 39%). Hambatannya di jalur klien (Mac lewat Wi-Fi), terlihat juga dari permintaan yang tertahan 60 detik. Jadi angka itu bukan kapasitas server, dicatat sebagai keterbatasan. Belum terbukti penuh karena klien belum berkabel. |
| Kenapa CPU total rendah tapi SSR lambat? | Node menjalankan JavaScript di satu thread utama. Proses Next.js 176% satu inti (ada thread pembantu), tapi tidak bisa menyebar ke 8 thread. CPU total jadi terlihat 26%. |
| Kenapa tidak pakai PM2/cluster? | Supaya keempat kondisi setara (satu proses per layanan). Dengan cluster angka absolut SSR akan naik; dicatat di butir 16. |
| Apakah ada memory leak? | Tidak terlihat: RAM 5,3 GB sebelum, puncak 5,5 GB, 5,0 GB sesudah; memori Node 428 → 440 MB. |
| Kenapa Defender dimatikan? | Defender memindai trafik/berkas dan memakan CPU: CSR-Next 1000 VU 812 → 455 req/s saat menyala. Dimatikan sementara agar yang terukur aplikasinya, lalu dinyalakan lagi; data Defender menyala disimpan sebagai pembanding. |
| Kenapa ada jeda 45 detik? | Supaya server kembali idle dan uji berikutnya tidak tercemar sisa beban (koneksi TIME_WAIT, CPU, memori). |
| Bagaimana tahu monitoring tidak mencemari? | Kolom `monitor_cpu_pct` mencatat beban skripnya sendiri: 0,4-0,9%. |
| Bagaimana tahu yang diuji benar SSG/SSR? | Bukti build: `/ssg` ditandai statis, `/ssr` dinamis oleh `next build` (`results/next-build-output-light.txt`). |
| Max 60.000 ms itu apa? | Batas waktu bawaan k6 per permintaan (60 detik). Permintaan yang tidak selesai dihitung gagal (status bukan 200), itu sumber error 0,51% di SSG 1000 VU. |

### Pak Dito (teori dan sitasi)

| Pertanyaan | Jawaban singkat |
|---|---|
| Dasar memilih empat metrik? | Response time, throughput, error rate dipakai Hermanto & Engel (2025), Yuwono (2026), Triawan dkk. (2026), Ismail dkk. (2023). CPU/memori/bandwidth: Ismail (2023), Yuwono (2026), Annisa dkk. (2026). |
| Dasar ambang 3 detik? | Yuwono (2026) menyatakan respons <2-3 detik dianggap baik (mengutip Nielsen, 1993). Ditopang eksperimen Nah (2004) ~2 detik dan Galletta dkk. (2004) penurunan mendatar mulai ~4 detik. Saya menyebutnya ambang operasional, bukan standar baku. |
| Kenapa 100/500/1000 VU? | Mengikuti penelitian sejenis: Hermanto & Engel (2025) 250/500/1000 VU pada Next.js SSR, Yuwono (2026) 100-1000. Tujuannya menemukan titik jenuh; hasilnya SSR jenuh sebelum 500 VU. |
| Kenapa satu kali jalan tanpa ulangan? | Keterbatasan waktu; ditutup dengan konsistensi pola di dua mesin dan tiga kondisi jaringan. Dicatat di butir 16. |
| Kenapa Kruskal-Wallis? | Shapiro-Wilk menunjukkan data tidak normal, jadi uji nonparametrik (Makarim, 2026; alur lengkap Simatupang & Satriyawan, 2026). |
| Kenapa JPG dan MP4 saja? | Mengendalikan satu variabel: ukuran berkas. Format lain = algoritma kompresi lain = variabel perancu. JPEG Baseline paling banyak diimplementasikan (Wallace, 1992); H.264 dirancang untuk jaringan (Wiegand dkk., 2003). WebP/AVIF lebih kecil (Yusuf, 2025) tapi jadi saran penelitian lanjutan. |
| Rujukannya lebih dari 5 tahun? | Nah, Galletta, Wallace, Wiegand termasuk teori/standar dasar (sesuai aturan Bapak: teori dasar boleh lebih lama). Teori umum memakai 2023-2026. |

**Jawaban aman kalau tidak tahu:** "Itu belum saya uji, Bu/Pak. Yang bisa saya tunjukkan dari data adalah ..., dan itu
saya catat sebagai keterbatasan." Jangan mengarang angka.

---

## 8. Checklist sebelum bimbingan

- [ ] `k6 version` jalan di Mac; Mac dan i5 satu jaringan; `CHECK_ONLY=1` semua 200
- [ ] Firewall i5 dibuka (`buka-firewall.ps1`) dan ditutup lagi setelah demo
- [ ] Laptop dicas; buka tab: `k6-cell.js`, `run-k6-lokal.sh`, `results/k6-i5/`, `results/monitor-i5/`, `UPDATE_BIMBINGAN_4.md`
- [ ] Hafal tiga angka: SSR jenuh ~157 req/s (i5) / ~75 req/s (Pentium); CSR 742-812 req/s pada 1000 VU; SSR 1000 VU SLA breach 70,58%
- [ ] Hafal hitungan 5.500 iterasi (bagian 3.3)
- [ ] Bisa menjelaskan kode keluar 99
- [ ] Bawa daftar pertanyaan di `UPDATE_BIMBINGAN_4.md` bagian 6
