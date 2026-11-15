# 🖥️ Runbook Server Lokal di Laptop Windows

> **Dibuat:** 12 November 2026
> **Dasar:** arahan Bu Nila (bimbingan 1, 5 Nov) dan disetujui Pak Dito (bimbingan 2, 9 Nov). Lihat `BIMBINGAN_1_HASIL.md` §4 dan `BIMBINGAN_2_HASIL.md` §2.
> **Pengganti:** `LANGKAH_DEPLOY.md` (Vercel) untuk kebutuhan load testing k6

---

## §0 Gambaran

```
Mac M1 (klien: k6, Lighthouse) ──LAN──▶ Router ──LAN──▶ Laptop Windows (server)
                                                         ├─ api-middleware   :4000
                                                         ├─ next  (light)    :3000   /csr /ssg /ssr
                                                         └─ react (light)    :5000
```

| Peran | Mesin | Yang dijalankan |
|---|---|---|
| Server | Laptop Windows | 3 aplikasi di atas, mode **production** |
| Klien | Mac M1 | k6 (dan Lighthouse kalau perlu) |

**Kenapa cukup tier `light`:** k6 hanya mengunduh dokumen HTML, bukan gambar/video, dan ukuran HTML praktis sama di ketiga tier (lihat komentar di `scripts/run-k6.sh`). Kalau nanti Core Web Vitals juga diukur ulang di server lokal, lihat §9 untuk menjalankan tier medium dan heavy.

**Aturan penting:** jangan pakai `pnpm dev` dan jangan pakai WSL. Mode dev jauh lebih lambat dan tidak mewakili produksi. WSL menambah lapisan virtualisasi dan NAT jaringan sehingga hasil jadi bias.

---

## §1 Siapkan Windows (sekali saja)

### 1a. Daya dan sleep

Buka **PowerShell sebagai Administrator**:

```powershell
# Power plan High Performance
powercfg /setactive SCHEME_MIN
# Jangan sleep / matikan layar / hibernate saat dicolok listrik
powercfg /change standby-timeout-ac 0
powercfg /change monitor-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
```

Laptop **wajib dicolok charger** selama pengujian. Pada mode baterai, CPU di-throttle.

### 1b. IP tetap

Build React mem-*bake* alamat server ke dalam bundle. Kalau IP Windows berubah setelah build, aplikasinya rusak. Jadi IP harus tetap:

- **Paling mudah:** atur *DHCP reservation* di halaman admin router (ikat MAC address laptop Windows ke satu IP).
- **Alternatif:** Settings → Network & Internet → Ethernet/Wi-Fi → IP assignment → Manual.

Cek IP:

```powershell
ipconfig
```

Catat nilai **IPv4 Address** (misalnya `192.168.1.10`). Di seluruh panduan ini, nilai tersebut ditulis sebagai `<IP>`.

> Kalau memungkinkan, sambungkan **kedua laptop ke router dengan kabel LAN**. Wi-Fi lebih fluktuatif, padahal bandwidth juga ikut diukur (arahan Bu Nila).

### 1c. Firewall

Masih di PowerShell Administrator:

```powershell
New-NetFirewallRule -DisplayName "mark0 server" -Direction Inbound -Protocol TCP -LocalPort 3000,4000,5000 -Action Allow -Profile Private
```

Pastikan jaringan Windows berstatus **Private**, bukan Public (Settings → Network → properti jaringan → Network profile type → Private).

### 1d. Pasang Node.js, pnpm, dan Git

Yang perlu diunduh hanya tiga, sisanya sudah bawaan Windows atau terpasang lewat npm:

| # | Yang dipasang | Sumber | Catatan |
|---|---|---|---|
| 1 | **Node.js** v26 (Windows Installer `.msi`, x64) | nodejs.org/en/download | Sudah termasuk `npm` dan `npx`. Samakan versi major dengan Mac (v26.0.0 di `ENVIRONMENT.txt`). **Jangan centang** "Automatically install the necessary tools" (Chocolatey, Python, Visual Studio Build Tools): tidak dibutuhkan dan memakan beberapa GB. |
| 2 | **Git for Windows** (64-bit) | git-scm.com/download/win | Semua pilihan installer biarkan default. |
| 3 | **Microsoft Visual C++ Redistributable** (x64) | aka.ms/vs/17/release/vc_redist.x64.exe | Dibutuhkan kompiler SWC milik Next.js. Tanpa ini `pnpm build` bisa gagal dengan pesan "Failed to load SWC binary". |

Setelah ketiganya terpasang, **tutup dan buka lagi PowerShell**, lalu:

```powershell
# Izinkan PowerShell menjalankan npm/pnpm (di Windows baru, skrip diblokir)
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

node -v
git --version

# pnpm dipasang lewat npm (corepack tidak lagi disertakan sejak Node 25)
npm install -g pnpm@11.1.2
pnpm -v
```

Tidak perlu dipasang: Python, Visual Studio, VS Code, Docker, WSL, k6 (k6 berjalan di Mac). `curl.exe`, `tar.exe`, dan alat monitoring (`Get-Counter`) sudah bawaan Windows 10/11. Paket `serve` terunduh otomatis lewat `npx` saat §5 dijalankan pertama kali.

---

## §2 Clone repo dan install

```powershell
mkdir C:\Skripsi -Force
cd C:\Skripsi
git clone --branch upgrade/patch-deps-okt-2026 https://github.com/Montana-Labs/mark0.git
cd mark0
git log --oneline -1

cd api-middleware;   pnpm install --frozen-lockfile; cd ..
cd nextjs-ecommerce; pnpm install --frozen-lockfile; cd ..
cd react-ecommerce;  pnpm install --frozen-lockfile; cd ..
```

> ⚠️ **Wajib pakai branch `upgrade/patch-deps-okt-2026`.** Branch `main` di GitHub masih berisi kode lama (tertinggal 45 commit per 15 Nov 2026), tanpa Next.js 16.4.3 dan tanpa perubahan penelitian. `git clone` biasa akan mengambil `main`.

Taruh repo di path pendek tanpa spasi (sekarang `C:\Skripsi`), jangan di OneDrive. Sinkronisasi OneDrive bisa mengganggu disk I/O saat pengujian.

---

## §2b Salin aset media dari Mac (tidak ada di git)

Folder `api-middleware/public/media/` (120 berkas, ±819 MB) **sengaja tidak di-commit** (lihat `.gitignore`). Di Vercel aset ini terunggah langsung dari disk Mac. Di server lokal, folder ini harus disalin manual. Tanpa ini semua gambar dan video 404.

Salin dari Mac, jangan dibuat ulang dengan skrip generator, supaya berkasnya identik byte demi byte dengan yang dipakai pada pengukuran sebelumnya.

**Di Mac** (Terminal):

```bash
mkdir -p ~/mark0-transfer
COPYFILE_DISABLE=1 tar -cf ~/mark0-transfer/media.tar -C ~/Documents/Developer/skripsi/mark0/api-middleware/public media
cd ~/mark0-transfer && python3 -m http.server 8000
```

Biarkan berjalan. Cek IP Mac dengan `ipconfig getifaddr en0`.

**Di Windows** (PowerShell):

```powershell
cd C:\Skripsi\mark0\api-middleware
mkdir -Force public | Out-Null
cd public
curl.exe -O http://<IP-MAC>:8000/media.tar
tar -xf media.tar
del media.tar
(Get-ChildItem media -Recurse -File).Count
```

Angka terakhir harus **120**. Setelah itu tekan `Ctrl+C` di Terminal Mac untuk mematikan server berkas, lalu hapus `~/mark0-transfer`.

Alternatif: salin folder `media` lewat flashdisk ke `C:\Skripsi\mark0\api-middleware\public\media`.

---

## §3 Build dan jalankan middleware (port 4000)

Buka **jendela PowerShell #1**:

```powershell
cd C:\Skripsi\mark0\api-middleware
pnpm build
$env:NODE_ENV="production"
$env:PORT="4000"
$env:PUBLIC_BASE_URL="http://<IP>:4000"
node dist/index.js
```

Harus muncul `Middleware API running on port 4000`.

> **Kenapa `PUBLIC_BASE_URL` wajib:** middleware menyusun URL gambar dari header `Host` request. Halaman SSR/SSG Next.js memanggil middleware dari sisi server, sehingga tanpa variabel ini URL gambar akan berbunyi `localhost:4000`. Browser di Mac tidak bisa membuka alamat itu.

Biarkan jendela ini tetap terbuka.

---

## §4 Build dan jalankan Next.js (port 3000)

Buka **jendela PowerShell #2**. Middleware harus sudah jalan, karena build SSG mengambil data darinya.

```powershell
cd C:\Skripsi\mark0\nextjs-ecommerce
$env:API_URL="http://<IP>:4000"
$env:NEXT_PUBLIC_API_URL="http://<IP>:4000"
$env:MEDIA_TIER="light"
$env:NEXT_PUBLIC_MEDIA_TIER="light"
$env:NODE_ENV="production"
pnpm build
pnpm start -- -p 3000 -H 0.0.0.0
```

Saat `pnpm build`, **simpan output tabel route-nya** (screenshot). `/ssg` harus bertanda statis (○ atau ●) dan `/ssr` dinamis (ƒ). Ini bukti strategi rendering untuk Bab 4, menggantikan bukti header `x-vercel-cache` di Vercel.

---

## §5 Build dan jalankan React (port 5000)

Buka **jendela PowerShell #3**:

```powershell
cd C:\Skripsi\mark0\react-ecommerce
$env:VITE_API_URL="http://<IP>:4000"
$env:VITE_MEDIA_TIER="light"
pnpm build
npx --yes serve@14 -s dist -l tcp://0.0.0.0:5000
```

- `-s` = mode SPA (semua rute dilayani `index.html`), setara dengan `rewrites` di `react-ecommerce/vercel.json`.
- Jangan pakai `vite preview`. Itu server pratinjau untuk development, bukan untuk produksi.
- Catat di bab Alat dan Bahan bahwa build statis React disajikan dengan `serve` (sebut versinya). Di Vercel, build ini disajikan oleh CDN.

---

## §6 Verifikasi dari Mac

Jalankan di **Terminal Mac**, ganti `<IP>`:

```bash
S=http://<IP>

curl -s $S:4000/health | python3 -m json.tool              # status ok, ada mediaTiers
curl -o /dev/null -w "%{http_code} %{size_download}\n" $S:4000/media/light/img-01.jpg

for p in csr ssg ssr; do
  curl -s -o /dev/null -w "next /$p : %{http_code}\n" $S:3000/$p
done
curl -s -o /dev/null -w "react /   : %{http_code}\n" $S:5000/

curl -s $S:3000/ssg | grep -o "http://[^\"]*/media/light/img-01.jpg" | head -1
```

Semua harus `200`. Baris terakhir harus menampilkan `http://<IP>:4000/media/light/img-01.jpg`, bukan `localhost`. Setelah itu buka `http://<IP>:5000` dan `http://<IP>:3000/csr` di Brave Mac, lalu pastikan gambar dan video muncul.

---

## §7 Catat spesifikasi server (wajib untuk laporan)

Di PowerShell Windows:

```powershell
$f = "C:\Skripsi\spesifikasi-server.txt"
"=== Spesifikasi server $(Get-Date -Format 'yyyy-MM-dd HH:mm') ===" | Out-File $f
Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, OSArchitecture | Format-List | Out-File $f -Append
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed | Format-List | Out-File $f -Append
"RAM (GB): " + [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB, 1) | Out-File $f -Append
Get-PhysicalDisk | Select-Object FriendlyName, MediaType, Size | Format-Table | Out-File $f -Append
Get-NetAdapter | Where-Object Status -eq Up | Select-Object Name, InterfaceDescription, LinkSpeed | Format-Table | Out-File $f -Append
"node : $(node -v)"   | Out-File $f -Append
"pnpm : $(pnpm -v)"   | Out-File $f -Append
"next : 16.4.3"       | Out-File $f -Append
Get-Content $f
```

Salin isi `spesifikasi-server.txt` ke repo, misalnya ke `results/spesifikasi-server.txt`, untuk Bab 3 (Alat dan Bahan).

---

## §8 Sebelum setiap sesi pengujian

- [ ] Charger tercolok, power plan High Performance
- [ ] Windows Update di-*pause* (Settings → Windows Update → Pause updates)
- [ ] Real-time protection Defender dimatikan sementara, **nyalakan lagi setelah selesai**
- [ ] Semua aplikasi lain ditutup (browser, Discord, OneDrive, dan sebagainya)
- [ ] 3 jendela PowerShell (§3–§5) berjalan, verifikasi §6 lolos
- [ ] Mac dan Windows di jaringan yang sama (kabel LAN kalau bisa)
- [ ] Monitoring RAM dan bandwidth dinyalakan (script menyusul)
- [ ] Laptop Windows **tidak disentuh** selama k6 berjalan

---

## §9 (Opsional) Tier medium dan heavy

Hanya perlu kalau Core Web Vitals juga diukur ulang di server lokal. Tier di-*bake* saat build, jadi tiap tier butuh salinan folder dan port sendiri:

| Tier | Next.js | React |
|---|---|---|
| light | :3000 | :5000 |
| medium | :3001 | :5001 |
| heavy | :3002 | :5002 |

```powershell
cd C:\Skripsi\mark0
robocopy nextjs-ecommerce nextjs-medium /E /XD .next
robocopy react-ecommerce  react-medium  /E /XD dist
```

Ulangi §4 dan §5 di folder salinan dengan `MEDIA_TIER` / `VITE_MEDIA_TIER` = `medium` dan port 3001 / 5001. Lakukan hal yang sama untuk heavy. Tambahkan port 3001, 3002, 5001, dan 5002 ke aturan firewall §1c.

Middleware cukup satu, karena ia melayani ketiga tier.

---

## §10 Langkah berikutnya

1. Ubah `scripts/run-k6.sh` supaya target URL bisa diarahkan ke `http://<IP>:…`. Sekarang URL Vercel masih tertulis langsung di script.
2. Buat script PowerShell untuk monitoring RAM, CPU, dan bandwidth di Windows, berjalan paralel dengan k6 dan menyimpan hasilnya ke CSV.
3. Tingkat VU sudah diputuskan: **100, 500, 1000** (lihat `BIMBINGAN_2_HASIL.md` §5; alasan pemilihan wajib ditulis di Batasan Masalah).
4. Jalankan k6, lalu perbarui `KETERBATASAN.md` (keterbatasan Vercel tidak berlaku lagi).

---

**Terakhir diperbarui:** 12 November 2026
