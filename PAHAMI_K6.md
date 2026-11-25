# Memahami Kode dan Hasil k6

> Tujuan: bisa menjawab pertanyaan Bu Nila tentang **isi skrip k6** dan **arti setiap angka hasilnya**.
> Berkas yang dibahas: `load-testing/k6-cell.js` dan hasil di `results/k6-i5/`.
> Tidak membahas cara menjalankan (itu ada di `DEMO_TESTING.md`).

---

## 1. Satu kalimat yang harus hafal

> "Skrip k6 saya membuat sejumlah pengguna virtual yang masing-masing berulang kali meminta **satu dokumen HTML**,
> menunggu 1 detik, lalu meminta lagi; dari semua permintaan itu saya hitung berapa yang dilayani per detik, berapa lama
> waktunya, berapa yang gagal, dan berapa yang lebih dari 3 detik."

---

## 2. Kode baris demi baris

### 2.1 Impor (baris 1-3)

```js
import http from "k6/http";             // untuk mengirim permintaan HTTP
import { sleep } from "k6";             // untuk jeda
import { Rate, Trend } from "k6/metrics"; // untuk membuat metrik sendiri
```

- **`Rate`** = metrik persentase. Setiap kali diisi `true` atau `false`; hasil akhirnya proporsi `true`.
- **`Trend`** = metrik kumpulan angka. Hasil akhirnya rata-rata, median, persentil, dan maksimum.

### 2.2 Ambang dan metrik buatan sendiri (baris 27-31)

```js
const SLA_MS = 3000;
const httpErrors  = new Rate("http_errors");
const slaBreaches = new Rate("sla_breaches");
const docDuration = new Trend("document_duration");
```

| Metrik | Jenis | Diisi apa | Arti |
|---|---|---|---|
| `http_errors` | Rate | `true` kalau status bukan 200 | Persentase permintaan yang **gagal** |
| `sla_breaches` | Rate | `true` kalau waktu > 3000 ms | Persentase permintaan yang **berhasil tapi terlalu lama** |
| `document_duration` | Trend | waktu respons | Sama persis dengan `http_req_duration` bawaan k6; **tidak dipakai di laporan** (berlebih, sisa versi awal) |

**Kalau ditanya "kenapa bikin metrik sendiri, kan k6 sudah punya `http_req_failed`?"**
> "`http_req_failed` bawaan k6 hanya menganggap gagal kalau status 400 ke atas atau koneksi putus. Saya lebih ketat: selain 200
> dianggap gagal, termasuk pengalihan 3xx. Dan k6 tidak punya metrik 'lebih dari 3 detik', jadi saya buat `sla_breaches`."

**Kalau ditanya "kenapa error dan SLA dipisah?"**
> "Di pilot study keduanya tercampur sehingga terbaca 'error 100%', padahal server tetap membalas 200, hanya lambat.
> Lambat dan gagal itu dua masalah yang berbeda."

### 2.3 Variabel dari luar (baris 33-49)

```js
const TARGET_URL = __ENV.TARGET_URL;       // alamat yang diuji
const LABEL      = __ENV.LABEL || "unlabeled";
const VUS        = Number(__ENV.VUS || 100);
const HOLD       = __ENV.HOLD || "45s";
const OUT_DIR    = __ENV.OUT_DIR || "../results/k6";
```

`__ENV` = variabel lingkungan yang diisi saat menjalankan. Artinya **satu skrip yang sama** dipakai untuk 12 sel
(4 kondisi x 3 level VU); yang berubah hanya alamat dan jumlah VU. Jadi semua kondisi diuji dengan perlakuan yang identik.

### 2.4 Skenario beban (baris 51-62)

```js
executor: "ramping-vus",
startVUs: 0,
stages: [
  { duration: "15s", target: VUS },  // naik dari 0 ke VUS
  { duration: HOLD,  target: VUS },  // bertahan 45 detik
  { duration: "5s",  target: 0 },    // turun ke 0
],
```

```
 VU
VUS ┤      ┌──────────────────────────┐
    │     ╱                            ╲
  0 ┼────╯                              ╰─
    0s  15s                          60s  65s
```

| Pertanyaan | Jawaban |
|---|---|
| Apa itu `ramping-vus`? | Executor k6 yang mengatur **jumlah pengguna** naik-turun menurut tahap. Lawannya executor yang mengatur **jumlah permintaan per detik** (`constant-arrival-rate`). |
| Kenapa naik 15 detik, tidak langsung? | Supaya server tidak dihantam 1000 koneksi di detik yang sama (itu uji lonjakan/spike, bukan uji beban). |
| Kenapa 45 detik? | Awalnya karena di Vercel beban tinggi yang lama memicu proteksi otomatis. Dipertahankan di server lokal agar sebanding dengan data Vercel. Sudah cukup untuk melihat titik jenuh: SSR mendatar di ~157 req/s. |
| Kenapa 100, 500, 1000 jadi tiga uji terpisah, bukan satu tanjakan? | Supaya tiap level punya angka sendiri dan server pulih di antaranya (jeda 45 detik). |

### 2.5 Thresholds (baris 64-67)

```js
http_errors:  [{ threshold: "rate<0.01", abortOnFail: false }], // error di bawah 1%
sla_breaches: [{ threshold: "rate<0.05", abortOnFail: false }], // SLA breach di bawah 5%
```

- Ini **penanda lulus/tidak**, bukan penghenti uji (`abortOnFail: false`), jadi data tetap lengkap walau server sudah jenuh.
- Kalau salah satu dilanggar, k6 tetap menyelesaikan uji tetapi keluar dengan **kode 99**. Itulah kode 99 di `run-log.csv`.
- Angka 1% dan 5% adalah **ambang pelaporan pilihan peneliti**, bukan standar. Jangan klaim ini dari jurnal.

### 2.6 Isi satu iterasi (baris 71-81) — bagian terpenting

```js
export default function () {
  const res = http.get(TARGET_URL, { headers: { "user-agent": "k6-mark0-loadtest" } });
  httpErrors.add(res.status !== 200);
  slaBreaches.add(res.timings.duration > SLA_MS);
  docDuration.add(res.timings.duration);
  sleep(1);
}
```

Setiap VU menjalankan fungsi ini **berulang-ulang** sampai uji selesai:

1. `http.get` → minta dokumen HTML **saja**. k6 bukan browser: tidak menjalankan JavaScript, tidak mengunduh gambar/CSS/JS.
2. Catat gagal atau tidak.
3. Catat lewat 3 detik atau tidak.
4. `sleep(1)` → jeda 1 detik, meniru pengguna yang membaca halaman sebelum klik lagi (*think time*).

**Apa yang diukur `res.timings.duration`?**

```
|-- blocked --|-- connecting --|-- sending --|------ waiting (TTFB) ------|-- receiving --|
                                             ^ server sedang membuat HTML  ^ HTML dikirim
                                |<---------------- duration --------------------------->|
```

`duration` = kirim permintaan + **menunggu server** + menerima isi. **Tidak** termasuk antre/membuka koneksi.
Pada SSR, bagian terbesar adalah *waiting*, yaitu waktu server merender halaman. Itulah yang ingin diukur.

**Kalau ditanya "berarti k6 tidak mengukur pengaruh gambar?"**
> "Betul, dan itu disengaja. k6 mengukur biaya server membuat dokumen per strategi rendering. Pengaruh gambar dan video
> ke pengguna diukur di Lighthouse. Karena itu k6 cukup di tier light: HTML antartier hampir sama, yang beda berkas medianya."

### 2.7 `handleSummary` (baris 83 sampai akhir)

Dipanggil **sekali di akhir uji**. Mengambil angka dari metrik k6, lalu:
- mencetak ringkasan berbahasa Indonesia ke layar, dan
- menyimpan berkas JSON `<LABEL>.json` di `OUT_DIR`.

Karena fungsi ini ada, ringkasan bawaan k6 yang panjang **diganti** oleh ringkasan buatan saya.

---

## 3. Hasil: arti setiap field JSON

Contoh nyata `results/k6-i5/ssr_light_1000vu.json`:

| Field | Nilai | Diambil dari | Arti dan cara membaca |
|---|---|---|---|
| `vus` | 1000 | input | Jumlah pengguna virtual pada fase stabil |
| `total_requests` | 10.729 | `http_reqs` count | Jumlah permintaan yang selesai selama ±65 detik |
| `throughput_rps` | 157 | `http_reqs` rate | total_requests ÷ durasi uji. **Ukuran kapasitas.** |
| `duration_avg_ms` | 4.350 | `http_req_duration` avg | Rata-rata waktu respons |
| `duration_med_ms` | 4.692 | med | Median: separuh permintaan lebih cepat dari ini |
| `duration_p95_ms` | 8.940 | p(95) | 95% permintaan lebih cepat dari ini |
| `duration_p99_ms` | 11.920 | p(99) | 99% permintaan lebih cepat dari ini |
| `duration_max_ms` | 22.975 | max | Permintaan terlama |
| `http_error_rate` | 0 | `http_errors` | 0 = tidak ada yang gagal |
| `sla_breach_rate` | 0,7058 | `sla_breaches` | 70,58% permintaan > 3 detik |
| `data_received_bytes` | ±534 MB | `data_received` | Total byte yang diterima k6 (termasuk header) |

### 3.1 Rata-rata vs median vs p95

- **Rata-rata** mudah tertarik oleh sedikit permintaan yang sangat lama.
- **Median** menunjukkan pengalaman "pengguna biasa".
- **p95** menunjukkan pengalaman pengguna yang paling lambat, setelah 5% kejadian paling ekstrem dibuang.
  Inilah yang lazim dipakai untuk menilai layanan, karena pengguna yang kesal biasanya ada di ekor itu.

Contoh SSG 500 VU: rata-rata 1.182 ms terlihat aman, p95 3.039 ms sudah lewat 3 detik, maksimum 60.000 ms.
> "Kalau saya hanya lapor rata-rata, masalahnya tersembunyi. Karena itu saya lapor p95 dan SLA breach."

### 3.2 Throughput: dua hal yang harus dipahami

**(a) Batas desain di 100 VU.** Karena tiap VU tidur 1 detik, satu VU paling banyak ±1 permintaan per detik:

```
VU-detik = naik (15 s x rata-rata 50) + stabil (45 s x 100) + turun (5 s x 50) = 750 + 4.500 + 250 = 5.500
Hasil nyata 100 VU = 5.342 - 5.490 permintaan  → hampir semua VU terlayani penuh
5.459 ÷ ±66 detik ≈ 83 req/s
```

Jadi pada 100 VU **semua kondisi ~83 req/s bukan karena sama kuatnya**, melainkan karena skenario memang hanya meminta
sebanyak itu. Di level ini yang dibandingkan adalah **waktu respons** (SSR 38 ms vs CSR 9-15 ms).

Batas desain 500 VU ≈ 5 x lebih tinggi (±410 req/s), 1000 VU ≈ ±820 req/s.
**Kalau throughput jauh di bawah batas desain, server (atau jalur jaringan) sudah jenuh.**

| 1000 VU | Batas desain ±820 | Hasil | Artinya |
|---|---|---|---|
| CSR-Next | | 812 req/s | Hampir penuh, server santai |
| CSR-React | | 742 req/s | Mendekati penuh |
| SSR-Next | | 157 req/s | Jenuh: sisanya antre, waktu respons naik |
| SSG-Next | | 134 req/s | Tertahan, tapi server menganggur → hambatan di jalur klien |

**(b) Throughput adalah rata-rata seluruh uji, termasuk fase naik dan turun.** Pada fase stabil saja angkanya sedikit
lebih tinggi. Karena perlakuannya sama untuk semua kondisi, perbandingan tetap adil. Kalau ditanya, akui saja.

### 3.3 Ukuran dokumen per kondisi

Dihitung dari `data_received_bytes ÷ total_requests` pada 100 VU:

| Kondisi | Byte per permintaan | Kenapa |
|---|---|---|
| CSR-React | ±0,7 KB | `index.html` hanya kerangka kosong + tautan ke JS; produk dimuat browser nanti |
| CSR-Next | ±8 KB | Kerangka Next.js (ada skrip dan data rute), produk tetap dimuat di browser |
| SSG-Next | ±48 KB | HTML sudah berisi seluruh daftar produk, dibuat sekali saat build |
| SSR-Next | ±49 KB | Isinya sama dengan SSG, tapi **dibuat ulang setiap permintaan** |

Ini kunci menjelaskan hasil:
- SSG dan SSR mengirim isi yang sama. Bedanya: SSG cukup **membaca berkas**, SSR harus **merender** setiap kali →
  CPU Node SSR 176% satu inti, SSG hanya 39%.
- CSR sangat kecil dan statis → paling ringan bagi server, tetapi bebannya pindah ke browser (terlihat di Lighthouse).

### 3.4 Kode keluar di `run-log.csv`

| Kode | Arti |
|---|---|
| `0` | Uji selesai dan kedua threshold lolos |
| `99` | Uji selesai, data valid, tetapi threshold dilanggar (error ≥1% atau SLA breach ≥5%) |
| `98` | Buatan skrip saya: server tidak hidup, uji dilewati |

Di data i5: kode 99 pada SSG 500 (SLA 5,15%), SSG 1000, dan SSR 1000 (SLA 70,58%).
SSR 500 kodenya 0 karena SLA breach-nya hanya 0,58%, walaupun throughput-nya sudah mentok.

### 3.5 Maksimum 60.000 ms

60 detik adalah **batas waktu bawaan k6** per permintaan. Permintaan yang tidak selesai dalam 60 detik diputus, statusnya
bukan 200, jadi masuk `http_errors`. Itu sumber error 0,02% (SSG 500) dan 0,51% (SSG 1000).

---

## 4. Membaca tabel hasil sebagai cerita

| Level | Yang terjadi |
|---|---|
| 100 VU | Semua kondisi lancar, 0% error, 0% SLA breach. SSR sudah paling lambat (38 ms) karena merender setiap permintaan. |
| 500 VU | CSR masih mengikuti batas desain (402-413 req/s). SSR mentok di 159 req/s; rata-rata naik ke 1,7 detik. |
| 1000 VU | CSR tetap stabil (742-812 req/s, p95 < 0,4 detik). SSR tetap 157 req/s, 70% permintaan > 3 detik. |
| SSG 500/1000 | Tertahan ±135 req/s walau server menganggur → tidak dipakai sebagai kapasitas server (keterbatasan). |

Kesimpulan RQ3 dalam satu kalimat:
> "Di sisi server, SSR paling mahal karena merender setiap permintaan di satu proses Node; pada 1000 VU kapasitas CSR
> 4,7-5,2 kali SSR, sedangkan SSR tidak gagal tetapi menjadi lambat."

---

## 5. Kelemahan yang harus diakui sendiri (sebelum ditanya)

1. k6 hanya mengunduh HTML, bukan halaman lengkap.
2. Throughput dirata-rata termasuk fase naik/turun.
3. Satu kali jalan per sel, tanpa ulangan.
4. Satu proses Node per layanan (tanpa PM2/cluster), jadi angka absolut khas mesin ini.
5. SSG 500/1000 terhambat di jalur klien (Mac lewat Wi-Fi), belum dibuktikan dengan klien berkabel.
6. `document_duration` dicatat tapi tidak dipakai (sama dengan `http_req_duration`).
7. Ambang 1% dan 5% pilihan peneliti; ambang 3 detik ada rujukannya (lihat `UPDATE_BIMBINGAN_4.md` bagian 5).

---

## 6. Latihan mandiri

Jawab tanpa melihat jawaban di atas, lalu cocokkan.

1. Apa beda `Rate` dan `Trend`?
2. Kalau `sleep(1)` dihapus, apa yang terjadi pada throughput di 100 VU?
3. Kenapa SSR 500 VU kodenya 0 tapi SSR 1000 VU kodenya 99?
4. SSG dan SSR ukurannya sama (±48 KB). Kenapa CPU Node-nya beda jauh?
5. CSR-React hanya 0,7 KB. Apakah berarti CSR paling cepat bagi pengguna? (Petunjuk: lihat Lighthouse.)
6. Hitung batas desain untuk 500 VU dengan rumus VU-detik.
7. Apa yang **tidak** termasuk dalam `res.timings.duration`?
8. Kenapa p95 lebih penting daripada rata-rata pada SSG 500 VU?

<details>
<summary>Kunci singkat</summary>

1. Rate = proporsi benar/salah; Trend = kumpulan angka (avg, med, p95, max).
2. Tiap VU menembak secepat mungkin; throughput melonjak dan yang diuji tidak lagi menyerupai 100 pengguna.
3. Kode 99 dipicu threshold, bukan throughput. SSR 500 SLA breach 0,58% (< 5%), SSR 1000 70,58% (> 5%).
4. SSG hanya membaca berkas jadi; SSR merender ulang setiap permintaan.
5. Tidak. Bagi server paling ringan, tetapi browser harus mengunduh JS dan merender, sehingga LCP CSR lebih buruk.
6. 15 x 250 + 45 x 500 + 5 x 250 = 3.750 + 22.500 + 1.250 = 27.500 → ±27.500 ÷ 66 ≈ 415 req/s (hasil CSR 402-413).
7. Waktu antre (blocked) dan membuka koneksi (connecting), termasuk DNS.
8. Rata-rata 1.182 ms tampak aman, tetapi p95 3.039 ms sudah melewati 3 detik.

</details>
