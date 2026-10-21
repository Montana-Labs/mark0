# Tools yang Dibutuhkan untuk Melanjutkan Proyek di Mac M1

Dokumen ini mencatat alat yang diperlukan untuk menjalankan aplikasi dan mengulang pengujian penelitian `mark0` di macOS Apple Silicon.

## 1. Tools utama untuk menjalankan aplikasi

| Tool | Kegunaan | Catatan |
|---|---|---|
| macOS Terminal (zsh) | Menjalankan perintah proyek | Terminal bawaan macOS sudah cukup. |
| Git | Mengelola repository dan perubahan kode | Periksa dengan `git --version`. |
| Node.js 22 | Menjalankan API, React, dan Next.js | Catatan pengujian sebelumnya memakai Node `v22.22.1`. Vite 8 perlu Node 20.19+ atau 22.12+. Gunakan instalasi Apple Silicon/native (`arm64`). |
| pnpm 10.15.1 | Memasang dependency dan menjalankan script | Versi ini tercatat pada `api-middleware/package.json`; gunakan versi yang sama untuk ketiga subproyek. |
| Editor kode, misalnya VS Code | Membaca dan mengubah TypeScript/React | Ekstensi TypeScript bawaan sudah cukup untuk mulai. |
| Browser Chromium, misalnya Google Chrome | Membuka aplikasi dan menjalankan Lighthouse | Dibutuhkan saat mengambil pengukuran performa melalui Lighthouse. |

Contoh pemeriksaan versi:

```bash
uname -m       # Harapannya: arm64
node -v        # Gunakan Node 22
pnpm -v        # Harapannya: 10.15.1
git --version
```

## 2. Tools untuk pengukuran penelitian

Tools berikut diperlukan ketika mulai mengulang pengujian, tetapi tidak diperlukan hanya untuk menjalankan aplikasi secara lokal.

| Tool | Kegunaan | Kapan diperlukan |
|---|---|---|
| Lighthouse CLI | Mengukur performa halaman dan menghasilkan laporan JSON | Saat mengulang pengukuran performa React dan Next.js. Perlu browser Chromium/Chrome. |
| SonarQube Server Community Build | Menyimpan dan menampilkan hasil analisis kualitas kode | Saat mengukur maintainability, reliability, security, dan duplikasi kode. Dapat dijalankan lokal dengan Docker atau di mesin/server terpisah. |
| SonarScanner CLI | Mengirim analisis source code ke SonarQube Server | Saat melakukan scan masing-masing subproyek. |
| Grafana k6 | Menjalankan skenario load testing yang ada di `load-testing/` | Saat mengukur waktu respons, throughput, dan error rate. |
| Docker Desktop (opsional) | Menjalankan SonarQube Server dalam container | Hanya diperlukan jika SonarQube Server ingin dijalankan lokal melalui Docker. |
| PowerShell 7 (opsional) | Menjalankan helper script `.ps1` yang ada di `scripts/` | Tidak dibutuhkan untuk `pnpm dev`; berguna jika ingin memakai helper Lighthouse/Sonar yang sudah disediakan tanpa mengubahnya. |

Di Mac, k6 dapat dipasang melalui Homebrew:

```bash
brew install k6
k6 version
```

Helper script di folder `scripts/` menggunakan PowerShell. Jika ingin menjalankannya di Mac, PowerShell dapat dipasang melalui Homebrew:

```bash
brew install powershell
pwsh --version
```

Alternatifnya, jalankan Lighthouse dan SonarScanner CLI secara manual dari Terminal; PowerShell tidak wajib untuk aplikasi.

## 3. Catatan kesesuaian versi proyek

Ada satu perbedaan konfigurasi yang perlu diingat sebelum pengujian final:

- `HASIL_TESTING.md` mencatat Node.js `v22.22.1` sebagai environment pengujian.
- `api-middleware/package.json` masih menyatakan `engines.node` sebagai `20.x`.

Untuk mulai menjalankan proyek, Node.js 22 sesuai dengan catatan pengujian dan persyaratan Vite 8. Sebelum mengambil data skripsi final, selaraskan deklarasi versi Node di proyek dan catat versi aktual seluruh tools agar hasilnya dapat direproduksi.

README utama menyebut template environment untuk Next.js, tetapi `nextjs-ecommerce/.env.example` saat ini tidak tersedia. Pengembangan lokal tetap menggunakan alamat API bawaan `http://localhost:4000`, sehingga file tersebut tidak diperlukan untuk mulai.

## 4. Urutan penggunaan

1. Pasang Git, Node.js 22, dan pnpm 10.15.1.
2. Jalankan API middleware, React, dan Next.js untuk memastikan aplikasi berfungsi.
3. Pasang k6 dan browser Chrome ketika siap mengulang pengukuran performa/load.
4. Siapkan SonarQube Server dan SonarScanner CLI ketika siap mengulang analisis maintainability.
5. Catat versi tools dan kondisi pengujian sebelum mengambil hasil baru.

## 5. Dokumentasi resmi

- [Node.js releases](https://nodejs.org/en/about/previous-releases)
- [Vite: Getting Started dan persyaratan Node.js](https://vite.dev/guide/)
- [pnpm: Installation](https://pnpm.io/installation/)
- [Homebrew: Installation](https://docs.brew.sh/Installation)
- [Grafana k6: Install k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- [SonarQube: SonarScanner CLI](https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/scanners/sonarscanner)
- [SonarQube: menjalankan server dari Docker image](https://docs.sonarsource.com/sonarqube-server/server-installation/from-docker-image/installation-overview)
- [PowerShell: Install di macOS](https://learn.microsoft.com/powershell/scripting/install/install-powershell-on-macos)
