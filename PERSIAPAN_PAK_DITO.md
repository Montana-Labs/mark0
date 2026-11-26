# Persiapan Bimbingan Pak Dito

> **Fokus Pak Dito:** teori, alasan setiap pilihan, dan sitasi (hanya jurnal; teori umum 5 tahun terakhir, teori dasar boleh lama).
> **Terakhir bertemu:** bimbingan 2, 9 November 2026 (`BIMBINGAN_2_HASIL.md`). Kalau materi `UPDATE_BIMBINGAN_3.md` (19 Nov)
> sudah pernah disampaikan, cukup ulas singkat dan langsung ke bagian 3.
> **Sejak itu ada bimbingan 3 dengan Bu Nila** (`BIMBINGAN_3_HASIL.md`); arahannya wajib dilaporkan ke Pak Dito (bagian 4).
> Semua isi di bawah sudah dicocokkan dengan naskah `skripsi_2.docx` per 26 November 2026.

---

## 1. Pembuka (±1 menit)

> "Pak, sejak bimbingan 9 November ada tiga perkembangan. **Pertama**, tugas penelusuran sitasi dari Bapak sudah saya
> kerjakan: metrik k6, tingkat VU, ambang 3 detik, uji statistik, dan pembatasan JPG/MP4 sekarang punya rujukan jurnal,
> dan sudah masuk ke naskah. **Kedua**, load test sudah dijalankan di dua server lokal, 100/500/1000 VU, dan hasilnya
> sudah masuk Bab 4. **Ketiga**, Bu Nila meminta setiap skenario k6 diulang minimal 5 kali dan CPU/RAM disajikan
> sebagai grafik, jadi itu pekerjaan saya berikutnya."

---

## 2. Status tugas dari bimbingan 2

| # | Tugas (bimbingan 2) | Status | Yang disampaikan |
|---|---|---|---|
| 1 | Telusuri sitasi 4 metrik k6 | ✅ | Lihat bagian 3. Mulai dari daftar pustaka Hermanto & Engel (2025) dan Handoko dkk. (2026), sesuai trik Bapak |
| 2 | Jurnal untuk SLA / ambang | 🟡 | Ada rujukan ambang (Yuwono, Nah, Galletta), tetapi belum ada jurnal yang menamai "SLA breach rate" sebagai metrik baku |
| 3 | Putuskan tingkat VU + alasan di Batasan Masalah | ✅ | 100/500/1000, mengacu Hermanto & Engel (2025) dan Yuwono (2026); sudah tertulis di Batasan Masalah |
| 4 | Load test di PC fisik + spesifikasi | ✅ | Dua server: Pentium N6000 dan Core i5-8250U; spesifikasi di Bab 3 |
| 5 | Monitoring RAM dan bandwidth | ✅ data / 🔴 grafik | Data per detik ada; Bu Nila minta disajikan sebagai grafik |
| 6 | Argumen pembatasan JPG dan MP4 | ✅ | Sudah di Batasan Masalah (Wiegand 2003, Yusuf 2025) |
| 7 | Catat versi Next.js 16.4.3 dan software | ✅ | React 19.2.4, Next.js 16.4.3, Node v26.12.1, pnpm 11.1.2 |
| 8 | Rombak Bab 1 dan Bab 3 | 🟡 | Sudah diperbarui dengan server lokal; masih disempurnakan |
| 9 | Pahami metrik/output k6 | ✅ | `PAHAMI_K6.md` |
| 10 | Perbarui keterbatasan | 🟡 | Butir 15-17 baru; akan disesuaikan setelah 5 ulangan |
| 11 | Slide utama + hidden slides | ⬜ | Belum |

---

## 3. Sitasi: apa dipakai untuk apa (bagian terpenting)

Bawa PDF-nya (folder `Obsidian Vault/Jurnal/`). Pak Dito bisa meminta halaman yang dikutip.

### 3.1 Metrik pengujian beban

| Dipakai untuk | Rujukan | Kalimat |
|---|---|---|
| Response time, throughput, error rate | Ismail dkk. (2023), JIP 9(2); Triawan dkk. (2026), JUPTIK 4(1), 69-77; Hermanto & Engel (2025), TIN 6(5), 450-463; Yuwono (2026), JITEK 6(1), 53-66; Annisa dkk. (2026), JAIC 10(1), 585-590 | "Metrik ini dipakai berulang pada penelitian pengujian beban sebelumnya." |
| Rata-rata, median, p95, maksimum, throughput | **Danutirta dkk. (2026)**, Simtek 11(2), 410-419 | "Penelitian ini juga **memakai k6**, alat yang sama dengan saya." |
| CPU, memori, bandwidth | Ismail dkk. (2023); Annisa dkk. (2026) (bandwidth); Hanggara dkk. (2024), J-INTECH 12(1) (CPU, memori) | "Pemantauan sumber daya server mengikuti penelitian tersebut." |

**Kalau ditanya "kenapa k6, kebanyakan jurnalnya JMeter?"**
> "Metriknya sama, Pak, dan k6 juga dipakai oleh Danutirta dkk. (2026). Saya memilih k6 karena skenarionya berupa skrip
> yang tersimpan di repositori, jadi bisa diulang persis."

### 3.2 Ambang 3 detik ⚠️ hati-hati

Rumusan yang **benar** (sama dengan naskah):
> "Ambang 3 detik saya tetapkan sebagai **ambang operasional**. Rujukannya Yuwono (2026) yang menyatakan waktu respons
> kurang dari 2 sampai 3 detik umumnya dianggap baik. Itu ditopang dua eksperimen waktu tunggu pengguna web: Nah (2004)
> menemukan toleransi sekitar 2 detik, dan Galletta dkk. (2004) menemukan penurunan yang mulai mendatar di sekitar 4 detik.
> Jadi 3 detik berada di antara keduanya."

**Jangan ucapkan:**
- ❌ "Hans (2003)": namanya **Nah**, tahunnya **2004**.
- ❌ "Pencetus 3 detik": Nah menemukan ±2 detik, bukan 3. Tidak ada satu jurnal pun yang mencetuskan 3 detik.
- ❌ "Standar 3 detik": yang benar ambang operasional.

**Kalau ditanya "Yuwono itu mengutip siapa?"**
> "Yuwono mengutip Nielsen (1993), Pak, tetapi itu buku, jadi saya tidak mengutip Nielsen langsung. Saya topang dengan
> dua eksperimen jurnal, Nah dan Galletta."

**Kalau ditanya "Nah dan Galletta sudah lebih dari 20 tahun?"**
> "Keduanya penelitian dasar tentang toleransi waktu tunggu pengguna web, Pak, sesuai aturan Bapak bahwa teori dasar boleh
> lebih lama. Rujukan terbarunya Yuwono (2026)." (Bu Nila juga sudah menyetujui rujukan lama yang merupakan rujukan utama.)

### 3.3 Tingkat VU 100/500/1000

> "Mengacu penelitian sejenis: Hermanto & Engel (2025) menguji Next.js SSR pada 250, 500, dan 1000 pengguna virtual,
> dan Yuwono (2026) menguji 100 sampai 1000 pengguna. Tujuannya mencari titik jenuh, bukan meniru trafik nyata.
> Hasilnya, SSR sudah jenuh di 500 VU, jadi rentang ini cukup untuk memperlihatkan polanya."

### 3.4 Uji statistik

> "Data Lighthouse tidak normal menurut Shapiro-Wilk, jadi saya memakai Kruskal-Wallis (definisi dari Makarim, 2026) dengan
> alur lengkap mengikuti Simatupang & Satriyawan (2026): Shapiro-Wilk dan Levene, lalu Kruskal-Wallis, post-hoc Mann-Whitney
> dengan koreksi Bonferroni, dan ukuran efek epsilon-kuadrat." (Anggraini 2024 sudah diganti karena kurang relevan.)

### 3.5 JPG dan MP4 (pertanyaan yang Bapak prediksi di bimbingan 2)

> "Tujuannya agar yang berubah hanya **ukuran media**, bukan algoritma kompresi. Setiap format punya kompresi dan biaya
> dekode sendiri, jadi mencampur format menambah variabel perancu. H.264 dirancang untuk aplikasi siaran, streaming, dan
> jaringan LAN maupun Internet (Wiegand dkk., 2003). Format modern seperti WebP dan AVIF memang lebih kecil (Yusuf, 2025),
> jadi saya jadikan saran penelitian lanjutan. Sesuai saran Bapak, video saya kunci: durasi 4 detik, 1280x720, 25 fps,
> gerakan sama; yang divariasikan hanya bitrate."

- Wiegand dkk. (**2003**), bukan 2004.
- Untuk JPEG, naskah **belum** memuat rujukan (Wallace 1992 baru metadata, belum dibaca). Kalau ditanya "rujukan JPEG?",
  jawab jujur: masih dicari, kandidatnya Wallace (1992), IEEE Trans. Consumer Electronics.

### 3.6 Yang masih terbuka (akui sendiri)

1. Belum ada jurnal yang menamai "SLA breach rate" sebagai metrik baku; dirumuskan sebagai proporsi permintaan yang melewati
   ambang waktu tunggu.
2. Tiga sumber non-jurnal masih ada: APJII, Google web.dev, dan skripsi Syah (2024). Akan diganti atau dihapus.
3. Rujukan JPEG belum masuk naskah.
4. Entri Anggraini (2024) di daftar pustaka masih harus dihapus (sudah ditandai).

---

## 4. Arahan Bu Nila (bimbingan 3) yang perlu diketahui Pak Dito

| Arahan | Rencana |
|---|---|
| Uji k6 minimal **5 kali per skenario** | 12 sel x 5 = 60 uji di server i5, dijalankan bergiliran (ulangan 1 untuk 12 sel, lalu ulangan 2, dst.), dilaporkan rata-rata ± SD |
| CPU/RAM disajikan sebagai **grafik berbasis waktu** | Dibuat dari data monitoring per detik: idle → 100/500/1000 VU → setelah uji |
| Pakai dan jelaskan **jalur LAN dan Wi-Fi**, catat bandwidth | Server memakai LAN, klien memakai Wi-Fi (kondisi nyata); bandwidth diukur dengan iperf3 |
| Laporan dikerjakan paralel | Bab metodologi dan skenario uji diselesaikan dulu |

Ini juga menjawab pertanyaan saya ke Bapak sebelumnya ("satu kali jalan cukup atau perlu ulangan?"): **Bu Nila sudah
memutuskan minimal 5 kali.** Lighthouse sudah 15 run per sel, jadi sudah memenuhi syarat.

---

## 5. Perkiraan pertanyaan Pak Dito

| Pertanyaan | Jawaban |
|---|---|
| Kenapa pindah dari Vercel? | Arahan Bu Nila dan persetujuan Bapak: spesifikasi hardware pasti, tidak ada fluktuasi internet; Vercel juga membatasi beban di atas 100 VU. Data Vercel 100 VU disimpan sebagai pembanding. |
| Kenapa dua server? | Server pertama (Pentium) dibatasi kabel 100 Mbps. Server kedua (i5, 1 Gbps) untuk memastikan pola hasil tidak hanya berlaku pada satu perangkat keras. |
| Apa hasil utamanya? | SSR paling berat di server: throughput mendatar (~157 req/s di i5, ~75 di Pentium) karena satu proses Node jenuh merender setiap permintaan. CSR tetap di bawah 3 detik sampai 1000 VU. |
| Kenapa k6 tidak memakai variasi media? | k6 hanya mengunduh HTML, dan HTML ketiga tier praktis sama. Pengaruh media ada di sisi browser dan diukur dengan Lighthouse. Dinyatakan di batasan. |
| Kesimpulan besarnya apa? | Trade-off: SSR dan SSG paling cepat bagi pengguna (LCP), CSR paling ringan bagi server, SSR paling mahal bagi server. |
| Teknik penarikan simpulan k6 dengan 5 ulangan? | Rata-rata ± SD per sel; konsistensi dilihat dari SD antar ulangan. (Kalau ditanya uji statistik untuk k6: belum diputuskan, tanyakan ke Bapak, lihat bagian 6.) |

**Jawaban aman kalau tidak tahu:** "Itu belum saya pastikan, Pak. Saya cek dulu sumbernya dan saya kabari." Jangan menebak
nama penulis atau tahun.

---

## 6. Pertanyaan untuk Pak Dito

1. Dengan 5 ulangan k6 per sel, apakah cukup dilaporkan **rata-rata ± SD**, atau perlu uji statistik juga (misalnya
   Kruskal-Wallis antar strategi seperti pada Lighthouse)?
2. Ambang 3 detik sebagai **ambang operasional** (Yuwono 2026, ditopang Nah 2004 dan Galletta dkk. 2004): apakah rumusan ini
   sudah aman untuk sidang?
3. Rujukan JPEG: apakah Wallace (1992) boleh sebagai rujukan standar dasar, atau perlu rujukan yang lebih baru?
4. Struktur bab: Bu Nila menyebut bab metodologi dan bab rancangan sistem/skenario uji diselesaikan dulu. Apakah susunan
   bab yang sekarang sudah sesuai?

---

## 7. Checklist sebelum masuk

- [ ] PDF jurnal: Yuwono, Nah, Galletta, Hermanto & Engel, Annisa, Ismail, Danutirta, Wiegand, Makarim, Simatupang
- [ ] Naskah `skripsi_2.docx` dibuka di halaman Batasan Masalah dan bagian metrik k6 Bab 2
- [ ] Hafal: **Nah 2004** (bukan Hans 2003), **Wiegand 2003**, **Danutirta 2026 = jurnal k6**
- [ ] `BIMBINGAN_3_HASIL.md` untuk melaporkan arahan Bu Nila
- [ ] Catat semua arahan Pak Dito, lalu tulis di `BIMBINGAN_4_HASIL.md`
