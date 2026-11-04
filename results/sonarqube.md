# Hasil Analisis SonarQube — Maintainability (Analisis Sekunder)

> **Diukur:** 4 November 2026
> **Tool:** SonarQube Community Build 26.10.0, SonarScanner CLI 8.3.1
> **Cakupan:** sesuai Batasan Masalah #6 — analisis statik kode sebagai faktor tambahan (sekunder)

## Ringkasan

| Metrik | React-ecommerce (CSR) | Next.js-ecommerce (SSR/SSG) |
|---|---|---|
| Lines of Code | 681 | 794 |
| Bugs | 2 | **1** |
| Vulnerabilities | 0 | 0 |
| Code Smells | 0 | 0 |
| Duplicated Lines | 0,0% | 0,0% |
| Cyclomatic Complexity | 72 | 85 |
| Cognitive Complexity | 55 | **46** |
| Reliability Rating | C | C |
| Security Rating | **A** | **A** |
| Maintainability Rating | **A** | **A** |
| Technical Debt | 0 menit | 0 menit |

## Detail Bug

Ketiga bug yang ditemukan **jenisnya sama**: *floating promise* — pemanggilan fungsi `async` di dalam `useEffect` tanpa penanganan penolakan (`.catch()`) eksplisit. Ini pola umum pada aplikasi React yang mengambil data lewat `useEffect`, karena `useEffect` tidak boleh menerima callback `async` secara langsung.

| Berkas | Baris | Severity |
|---|---|---|
| `react-ecommerce/src/pages/Home.tsx` | 57 | Major |
| `react-ecommerce/src/pages/ProductDetail.tsx` | 53 | Major |
| `nextjs-ecommerce/components/CsrCatalog.tsx` | 64 | Major |

**Catatan:** React memiliki 2 bug (Home + ProductDetail), Next.js memiliki 1 bug (CsrCatalog) — bukan karena Next.js "lebih baik", melainkan karena Next.js hanya punya satu halaman yang memakai pola `useEffect` fetch (CSR); dua halaman SSG/SSR lainnya mengambil data di server (`async` function biasa, bukan `useEffect`), sehingga pola ini secara struktural tidak muncul di sana.

## Interpretasi untuk Bab 4/5

- **Maintainability Rating A pada kedua aplikasi** — tidak ada perbedaan bermakna pada kebersihan kode dasar.
- **Reliability Rating C pada kedua aplikasi** — diturunkan oleh severity Major bug di atas, bukan oleh jumlah bug (keduanya kecil, 1-2 saja).
- **Duplikasi kode 0,0% pada kedua aplikasi** — membuktikan kode ditulis apple-to-apple, bukan hasil salin-tempel antar aplikasi.
- **Cognitive Complexity Next.js lebih rendah** (46 vs 55) meski Cyclomatic Complexity lebih tinggi (85 vs 72) — Next.js punya lebih banyak percabangan struktural (tiga strategi rendering dalam satu basis kode: `/csr`, `/ssg`, `/ssr`), tetapi kode tiap percabangan lebih sederhana untuk dipahami manusia.

⚠️ **Penting:** "Security Rating A" di sini adalah hasil **SAST** (analisis statis kode sendiri), **bukan SCA** (pemindaian kerentanan dependency). Lihat `KETERBATASAN.md` butir #13 — klaim ini tidak berarti aplikasi bebas dari kerentanan pada dependency pihak ketiga.

## Perbaikan yang Disarankan (opsional, di luar cakupan skripsi)

Ketiga bug dapat diperbaiki dengan menambahkan `.catch()` pada pemanggilan `async` di dalam `useEffect`, atau membungkusnya dalam fungsi IIFE. Tidak dilakukan pada repositori ini karena mengubah kode produksi berarti perlu mengulang pengukuran Core Web Vitals (180 run) untuk menjaga keutuhan data — perubahan kode murni kosmetik ini tidak memengaruhi performa, sehingga tidak sepadan dengan biaya pengulangan.

---

**Berkas mentah:** `results/sonarqube/*.json` (measures + issues, dari SonarQube API)
