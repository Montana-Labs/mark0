# Panduan Testing Maintainability dan Core Web Vitals

Dokumen ini merapikan metodologi pengujian untuk skripsi `mark0` setelah meninjau tiga markdown utama:

- `README.md`
- `HASIL_TESTING.md`
- `DISKUSI_JUDUL_SKRIPSI.md`

## 1. Analisis Tiga Markdown

### 1.1 README.md

Yang sudah kuat:

- Struktur eksperimen sudah jelas: React CSR vs Next.js SSR/SSG dengan middleware yang sama.
- Variabel terkontrol dan arsitektur project sudah cukup mudah dipahami.
- Sudah ada bagian SonarQube dan Lighthouse sebagai tool pengujian.

Yang perlu dirapikan:

- Bagian performance masih mengarahkan ke Lighthouse satu kali run, padahal untuk laporan skripsi lebih aman memakai beberapa run lalu diambil rata-rata atau median.
- Istilah `Core Web Vitals` masih bercampur dengan metrik Lighthouse lain seperti FCP, TBT, Speed Index, dan TTI.
- README masih lebih cocok untuk setup development daripada protokol pengujian formal.

### 1.2 HASIL_TESTING.md

Yang sudah kuat:

- Struktur laporan sudah sangat dekat dengan format bab hasil penelitian.
- Variabel terkontrol, tabel perbandingan, dan narasi tradeoff sudah kuat.
- SonarQube, Lighthouse, dan k6 sudah dipisahkan dengan baik.

Yang perlu dirapikan:

- Bagian `Core Web Vitals` sebaiknya dibedakan dari `performance metrics`.
- Untuk istilah yang ketat, Core Web Vitals saat ini adalah `LCP`, `CLS`, dan `INP`.
- Lighthouse cocok untuk `lab data`, tetapi bukan sumber terbaik untuk `field INP`.
- Pengujian Lighthouse 1x per framework terlalu tipis jika dipakai sebagai hasil final. Minimal 5x, lebih ideal 10x.
- Jika tetap memakai metrik seperti FCP, TBT, Speed Index, dan TTI, tulis sebagai `Metrik Performa Lighthouse`, bukan Core Web Vitals utama.
- Catatan load testing sudah bagus, tetapi kalimat `error rate 100%` perlu selalu disandingkan dengan penjelasan bahwa ini threshold failure, bukan server crash total.

### 1.3 DISKUSI_JUDUL_SKRIPSI.md

Yang sudah kuat:

- Framing penelitian sangat defensible: fokus pada tradeoff rendering strategy, bukan perang framework semata.
- Alasan memilih React vs Next.js sudah kuat untuk sidang.
- Dokumen ini membantu membangun argumen mengapa hasil yang berbeda tetap fair.

Yang perlu dijaga saat testing:

- Framing metodologi di dokumen hasil harus konsisten dengan framing di diskusi judul.
- Karena penelitian menilai tradeoff, hasil testing harus benar-benar simetris: halaman sama, endpoint sama, mode production sama, jumlah run sama.

## 2. Rekomendasi Metodologi

### 2.1 Code Maintainability

Gunakan SonarQube untuk metrik utama:

- Maintainability Rating
- Code Smells / Issues
- Reliability Rating
- Security Rating
- Duplications
- Lines of Code

Prinsipnya:

- Gunakan quality profile yang sama untuk kedua project.
- Analisis source code app saja, bukan `dist`, `.next`, atau `node_modules`.
- Jalankan scan setelah kode dalam kondisi final atau freeze.

Tambahan yang boleh dipakai:

- `pnpm lint` sebagai pemeriksaan pendukung, bukan metrik utama penelitian.

### 2.2 Core Web Vitals dan Lighthouse

Pisahkan dua istilah ini dengan tegas:

- `Core Web Vitals` utama: `LCP`, `CLS`, `INP`
- `Metrik performa Lighthouse`: `Performance Score`, `FCP`, `TBT`, `Speed Index`, `TTI`, dan juga `LCP` serta `CLS`

Untuk skripsi kamu, ada dua opsi:

- Opsi praktis:
  Gunakan Lighthouse sebagai lab testing dan tulis bab hasil sebagai `Pengujian Performa Web berbasis Lighthouse`, lalu sorot `LCP` dan `CLS` sebagai bagian yang overlap dengan Core Web Vitals.
- Opsi paling kuat:
  Gunakan Lighthouse untuk lab metrics, lalu tambahkan field metrics dari deployment nyata untuk `LCP`, `CLS`, dan `INP`.

Jika kamu tidak punya traffic cukup untuk field data besar, Lighthouse tetap bisa dipakai, tetapi penulisannya harus jujur sebagai `lab-based performance evaluation`.

## 3. Protokol Testing yang Disarankan

### 3.1 Maintainability

1. Pastikan kode sudah final dan dependency sudah terpasang.
2. Jalankan lint di kedua project.
3. Jalankan scan SonarQube untuk React.
4. Jalankan scan SonarQube untuk Next.js.
5. Catat metrik utama dari dashboard SonarQube.
6. Ambil screenshot dan export data penting ke tabel hasil.

### 3.2 Lighthouse / Web Performance

1. Gunakan mode production, bukan dev server, bila memungkinkan.
2. Gunakan halaman yang sama untuk kedua framework:
   - Home page
   - Product detail page
3. Pastikan backend middleware sudah hidup dan data source sama.
4. Jalankan Lighthouse beberapa kali pada URL React.
5. Jalankan Lighthouse beberapa kali pada URL Next.js.
6. Ambil rata-rata atau median, jangan pakai satu run saja.
7. Pisahkan pembahasan:
   - Core metrics overlap: LCP, CLS
   - Lab metrics tambahan: FCP, TBT, Speed Index, TTI

## 4. Cara Menjalankan Helper Script

## 4.1 SonarQube

Syarat:

- SonarQube server aktif di `http://localhost:9000`
- SonarScanner CLI tersedia di `PATH`

Contoh:

```powershell
# React
powershell -ExecutionPolicy Bypass -File .\scripts\run-sonar.ps1 -Project react -RunLint

# Next.js
powershell -ExecutionPolicy Bypass -File .\scripts\run-sonar.ps1 -Project next -RunLint
```

Jika scanner tidak ada di PATH:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-sonar.ps1 -Project react -ScannerPath "C:\tools\sonar-scanner\bin\sonar-scanner.bat"
```

### 4.2 Lighthouse

Contoh pengujian 5 kali untuk React:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-lighthouse.ps1 `
  -Name react-home `
  -Url "https://mark0-react.vercel.app" `
  -Runs 5 `
  -Preset mobile
```

Contoh pengujian 5 kali untuk Next.js:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-lighthouse.ps1 `
  -Name next-home `
  -Url "https://mark0-nextjs.vercel.app" `
  -Runs 5 `
  -Preset mobile
```

Contoh halaman detail:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-lighthouse.ps1 `
  -Name react-detail `
  -Url "https://mark0-react.vercel.app/product/1" `
  -Runs 5 `
  -Preset mobile

powershell -ExecutionPolicy Bypass -File .\scripts\run-lighthouse.ps1 `
  -Name next-detail `
  -Url "https://mark0-nextjs.vercel.app/product/1" `
  -Runs 5 `
  -Preset mobile
```

Output akan disimpan di:

- `artifacts/lighthouse/<name>-<timestamp>/run-xx.json`
- `artifacts/lighthouse/<name>-<timestamp>/summary-runs.csv`
- `artifacts/lighthouse/<name>-<timestamp>/summary.json`

## 5. Format Pelaporan yang Lebih Aman

### 5.1 Untuk Maintainability

Gunakan kalimat seperti ini:

> Code maintainability dievaluasi menggunakan SonarQube dengan quality profile JavaScript/TypeScript yang sama pada kedua project. Metrik yang dibandingkan meliputi Maintainability Rating, jumlah issue, code duplication, reliability, security, dan lines of code.

### 5.2 Untuk Performance

Jika hanya memakai Lighthouse:

> Pengujian performa dilakukan menggunakan Google Lighthouse dalam mode mobile sebanyak 5 kali untuk setiap aplikasi. Nilai yang dilaporkan merupakan rata-rata dan median dari setiap run. Metrik LCP dan CLS digunakan sebagai indikator yang relevan terhadap Core Web Vitals, sedangkan FCP, TBT, Speed Index, dan TTI digunakan sebagai metrik performa laboratorium tambahan.

Jika kamu nanti berhasil menambah field data:

> Core Web Vitals utama (LCP, CLS, INP) dikumpulkan dari deployment produksi, sedangkan Lighthouse digunakan sebagai alat diagnostik laboratorium untuk menjelaskan penyebab perbedaan performa.

## 6. Checklist Sebelum Ambil Hasil Final

- URL React dan Next.js sudah live dan stabil
- Middleware backend merespons normal
- Halaman yang diuji sama
- Jumlah run sama
- Preset Lighthouse sama
- Tidak ada build atau deploy yang berubah di tengah pengujian
- SonarQube quality profile sama
- Hasil yang dicatat adalah average atau median, bukan satu run tunggal
