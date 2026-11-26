# Hasil Bimbingan 3 — Bu Nila

Dosen pembimbing: **Bu Nila**. Sumber: rekaman `konsul 3 skripsi bu nila.m4a` (disimpan di luar repo), diringkas penulis.
Pasangan dokumen: `BIMBINGAN_1_HASIL.md` (Bu Nila), `BIMBINGAN_2_HASIL.md` (Pak Dito), `UPDATE_BIMBINGAN_4.md`.

---

## 1. Ringkasan arahan

| # | Topik | Arahan Bu Nila |
|---|---|---|
| 1 | Jaringan | Pakai dan jelaskan **kedua jalur** (LAN dan Wi-Fi). **Catat bandwidth** masing-masing. Kondisi nyata: server memakai kabel LAN, klien memakai Wi-Fi. |
| 2 | Sitasi lama | Rujukan lama **boleh** bila merupakan rujukan pencetus/utama. |
| 3 | Pengulangan | **Minimal 5 kali pengulangan per skenario.** Dua kali tidak cukup (analogi cabai: dua gigitan belum cukup untuk menyimpulkan pedas). Kesimpulan sah bila hasil 5 kali stabil dan konsisten. |
| 4 | Monitoring | CPU dan RAM **wajib disajikan sebagai grafik berbasis waktu**, bukan teks angka: idle → saat diserang 100/500/1000 VU → setelah serangan, untuk membuktikan memori turun kembali (tidak ada memory leak). |
| 5 | Laporan | Kerjakan **paralel** dengan pengujian. Selesaikan dulu bab metodologi dan rancangan sistem/skenario uji, supaya data 5 kali ulangan tinggal dimasukkan. |

## 2. Yang perlu DILURUSKAN pada bimbingan berikutnya

Beberapa penjelasan saat konsultasi tidak sesuai dengan skrip dan data di repo. Sampaikan koreksinya sendiri.

| # | Yang terucap saat bimbingan | Yang benar (dari repo) | Bukti |
|---|---|---|---|
| 1 | Beban VU ditembak **langsung serentak (blast), tanpa bertahap** | **Bertahap**: naik 15 detik dari 0 ke target VU, stabil 45 detik, turun 5 detik (executor `ramping-vus`) | `load-testing/k6-cell.js` baris 51-62 |
| 2 | Rata-rata bandwidth **Wi-Fi ~95** | Wi-Fi 5 GHz ~75-80 Mbps; **95-96 Mbps adalah kabel 100 Mbps** di laptop Pentium; iperf3 kabel ~93 Mbps | `results/kapasitas-jaringan.md`, `KETERBATASAN.md` butir 15 |
| 3 | Ambang 3 detik dari **"Hans (2003)" sebagai pencetus** | Rujukan yang terverifikasi: **Nah (2004)** (temuan ~2 detik, bukan 3) dan **Galletta dkk. (2004)** (mendatar ~4 detik); angka 2-3 detik dari **Yuwono (2026) yang mengutip Nielsen (1993, buku)**. Tidak ada jurnal terverifikasi yang "mencetuskan" 3 detik | `PUSTAKA_DAN_ARGUMEN.md` bagian B.3 dan E |
| 4 | MP4 H.264 dari **2004** | **Wiegand dkk. (2003)**, IEEE TCSVT 13(7) | `PUSTAKA_DAN_ARGUMEN.md` bagian A |
| 5 | Baru **2 kali** percobaan | Per sel baru **1 kali** per lingkungan; yang ada adalah 4 lingkungan berbeda (Pentium Wi-Fi, Pentium kabel, i5 Defender mati, i5 Defender menyala), **bukan ulangan** | `results/k6-*/` |

Catatan untuk Pak Dito: poin 3 berisiko. Jangan menyebut satu sumber sebagai "pencetus 3 detik". Rumusan aman: 3 detik adalah
ambang operasional, dengan rujukan Yuwono (2026, mengutip Nielsen 1993) dan ditopang eksperimen Nah (2004) dan Galletta dkk. (2004).

## 3. Catatan pendukung untuk menjawab

- **Sitasi k6 memang sudah ada:** Danutirta dkk. (2026), Simtek 11(2), 410-419, memakai k6 (sudah di naskah).

- **Lighthouse sudah memenuhi syarat pengulangan:** 15 run per sel (180 run). Syarat 5 kali terutama berlaku untuk k6.
- **Arahan jaringan Bu Nila cocok dengan susunan sekarang:** server i5 memakai kabel LAN 1 Gbps, klien Mac memakai Wi-Fi.
- Data monitoring per detik **sudah ada** (`results/monitor-*/`, dengan `run-log.csv` untuk jendela waktu tiap uji). Yang
  belum ada hanya grafiknya, jadi grafik bisa dibuat dari data yang ada tanpa mengulang uji.

## 4. Tindak lanjut

| # | Tugas | Status |
|---|---|---|
| 1 | Grafik CPU dan RAM berbasis waktu (idle → 100/500/1000 VU → pasca uji), area tiap uji ditandai dari `run-log.csv` | 🔴 |
| 2 | Ulang k6: **5 kali per sel** (12 sel x 5 = 60 uji; ±2 jam per lingkungan), laporkan rata-rata ± SD antar ulangan | 🔴 |
| 3 | Tentukan "kedua jalur": klien Mac Wi-Fi (sekarang) dan klien Mac kabel LAN (butuh adaptor). Kalau klien kabel tersedia, keterbatasan SSG 500/1000 sekaligus teruji | 🔴 perlu keputusan |
| 4 | Catat bandwidth tiap jalur dengan iperf3 sebelum uji | 🟡 sudah ada untuk Pentium; i5 belum |
| 5 | Luruskan 5 poin di bagian 2 pada bimbingan berikutnya | 🔴 |
| 6 | Selesaikan bab metodologi dan rancangan sistem/skenario uji secara paralel | 🟡 |

---

**Terakhir diperbarui:** 26 November 2026
