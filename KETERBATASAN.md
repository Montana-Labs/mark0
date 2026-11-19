# ⚠️ Keterbatasan Penelitian

> **Diperbarui:** 19 November 2026
> **Kegunaan:** bahan langsung untuk subbab *Keterbatasan Penelitian* di Bab 3 dan Bab 5.
> **Prinsip:** setiap keterbatasan disertai **bukti** dan **alasan mengapa tidak dapat dihindari**. Sebutkan sendiri sebelum penguji menemukannya.

---

## 1. ✅ Load testing di Vercel terbatas pada 100 pengguna virtual (diatasi dengan server lokal)

> **Pembaruan 19 November 2026:** keterbatasan ini sudah diatasi dengan memindahkan pengujian ke server lokal (100/500/1000 VU; lihat butir 15-17 untuk keterbatasan yang tersisa). Bagian di bawah dipertahankan sebagai catatan alasan pindah.

**Masalah.** Kolokium 8.2.1 menjanjikan pengujian pada 100, 500, dan 1000 pengguna virtual simultan. Yang berhasil diukur secara sah hanya **100 pengguna virtual**.

**Penyebab.** Vercel menjalankan mitigasi DDoS otomatis pada seluruh plan, termasuk Hobby. Ketika beban mencapai 500 pengguna virtual, platform mulai menghadang request dengan halaman *Security Checkpoint*.

**Bukti.**

| Bukti | Nilai |
|---|---|
| Header respons | `x-vercel-mitigated: challenge` |
| Status | HTTP 403 pada seluruh endpoint |
| Dashboard firewall | **100.300** request *challenge* vs 50.500 *allow* |
| Ketersediaan bypass | `Bypass — Requires Pro or Enterprise` |

**Bukti bahwa ini BUKAN keterbatasan arsitektur:**

1. **CSR-React ikut gagal 16%**, padahal hanya menyajikan berkas statis dari CDN. CDN tidak mungkin tumbang pada 181 request/detik.
2. **Throughput justru turun saat error naik.** Burst pendek 900 VU ke target yang sama mencatat **605 req/s dengan 0% error**; ramp panjang ke 1000 VU mencatat **181 req/s dengan 56% error**. Target dan mesin identik — yang berbeda hanya durasi beban. Pola ini hanya masuk akal bila ada pihak yang menolak request, bukan bila server kewalahan.
3. **Mitigasi tidak membedakan browser.** Diuji dengan user-agent curl, Chrome, dan Brave dari IP yang sama — ketiganya 403.

**Mengapa tidak diatasi.** Pengecualian IP (*system bypass*) hanya tersedia pada plan berbayar. Menyebarkan beban dari banyak IP untuk menghindari deteksi menyerupai pola serangan dan tidak dapat dipertanggungjawabkan secara etis.

**Yang tetap dapat disimpulkan.** Pada 100 pengguna virtual dengan nol error, perbedaan antar strategi sudah tegas:

| Strategi | Rata-rata respons |
|---|---|
| CSR-React | 51 ms |
| CSR-Next | 51 ms |
| SSG-Next | 109 ms |
| SSR-Next | **200 ms** |

SSR **3,9× lebih berat** daripada CSR. Trade-off yang menjadi inti RQ3 terbukti.

**Rumusan untuk Bab 3:**

> "Pengujian beban hanya dapat dilakukan secara sah hingga 100 pengguna virtual simultan. Pada tingkat beban yang lebih tinggi, mitigasi DDoS otomatis platform mulai menghadang request dengan halaman verifikasi, sehingga yang terukur bukan lagi kapasitas aplikasi melainkan ambang perlindungan platform. Hal ini dibuktikan oleh header respons `x-vercel-mitigated: challenge` serta oleh fakta bahwa aplikasi berbasis berkas statis pun mengalami kegagalan pada tingkat beban yang sama. Pengecualian alamat IP pengujian hanya tersedia pada plan berbayar."

**Catatan tambahan yang dapat diangkat sebagai temuan:** pada platform terkelola, batas praktis jumlah pengguna simultan ditentukan oleh ambang mitigasi platform, bukan oleh kapasitas komputasi aplikasi. Untuk konteks e-commerce, informasi ini relevan secara praktis.

**Status:** ✅ diatasi (17 November 2026) dengan server lokal atas arahan Bu Nila (5 Nov) dan persetujuan Pak Dito (9 Nov). Data Vercel 100 VU tetap dipakai sebagai pembanding.

---

## 2. Cakupan RQ3 tidak mencakup variasi beban media

k6 hanya mengunduh dokumen HTML, **tidak mengunduh gambar**. Ukuran HTML praktis sama pada ketiga tier karena yang berbeda hanya alamat gambar, bukan gambarnya.

Konsekuensinya, pengujian beban mengukur **biaya generasi dokumen di sisi server**, sedangkan pengaruh variasi beban media berada di **sisi klien** dan diukur terpisah melalui Lighthouse. Pengujian beban hanya dijalankan pada satu tier.

**Status:** disengaja, dinyatakan sebagai pembatasan cakupan.

---

## 3. Istilah Core Web Vitals

Core Web Vitals resmi saat ini adalah **LCP, CLS, dan INP**. FCP, TBT, Speed Index, dan TTI **bukan** Core Web Vitals melainkan metrik performa Lighthouse pendukung.

**INP tidak diukur** karena memerlukan data interaksi pengguna nyata (*field data*), sedangkan penelitian ini berbasis laboratorium. **TBT dipakai sebagai proksi** responsivitas dan disebut sebagai proksi.

**Status:** perlu diperbaiki di Batasan Masalah #2 yang masih menyebut kelimanya sebagai Core Web Vitals.

---

## 4. Lab data, bukan field data

Seluruh pengukuran memakai Lighthouse dengan emulasi perangkat mobile dan throttling jaringan tersimulasi. Nilai absolutnya tidak mewakili kondisi jaringan pengguna nyata — LCP tier heavy mencapai 20–26 detik karena simulasi jaringan lambat dengan 26,63 MB gambar.

Yang sahih adalah **perbandingan antar kondisi**, bukan nilai absolutnya.

**Status:** melekat pada metode, dinyatakan apa adanya.

---

## 5. Gambar produk bersifat sintetis

Gambar dihasilkan secara deterministik oleh `scripts/generate-media.py`, bukan foto produk asli.

**Alasan:** ukuran byte harus terkendali presisi. Hasilnya 60 dari 60 gambar masuk rentang target, dan ketiga tier berasal dari satu gambar sumber yang sama per produk sehingga yang berbeda murni ukuran byte.

**Dapat diubah:** letakkan `01.jpg`–`20.jpg` pada folder `media-source/` lalu jalankan ulang generator.

**Status:** terbuka, keputusan ada pada penulis.

---

## 6. Browser host bukan Google Chrome

Pengukuran dijalankan di atas **Brave Browser 154.1.96.59**, bukan Google Chrome. Keduanya berbasis Chromium dengan mesin render dan engine JavaScript identik.

Aplikasi uji tidak memuat resource pihak ketiga sama sekali, sehingga fitur pemblokiran bawaan Brave tidak memiliki sasaran. Diverifikasi empiris: seluruh request gambar terunduh penuh pada setiap run.

**Catatan penting:** user-agent melaporkan diri sebagai `HeadlessChrome/154.0.0.0`, sehingga berkas data tidak membedakannya. Browser sebenarnya **wajib dinyatakan eksplisit** di Bab 3.

**Status:** dapat diterima, wajib dinyatakan.

---

## 7. Atribusi strategi dan framework pada kondisi CSR

Batasan Masalah #1 menetapkan CSR diwakili React serta SSR dan SSG diwakili Next.js. Karena React tanpa framework tambahan tidak mendukung rendering di sisi server, grid simetris tidak dapat dibentuk.

**Sudah ditangani sebagian:** kondisi CSR pada Next.js ditambahkan sebagai analisis pelengkap, sehingga efek strategi dan efek framework dapat dipisahkan. Hasilnya efek framework terhadap LCP **tidak signifikan** (p = 0,69 pada tier medium; p = 0,79 pada tier heavy).

**Sisa keterbatasan:** analisis utama tetap mengikuti Batasan Masalah, sehingga pemisahan tersebut berstatus pelengkap, bukan desain utama.

**Status:** sebagian besar tertutup.

---

## 8. CLS tidak dapat diuji secara statistik

CLS bernilai **0,00 pada seluruh 180 run**, pada keempat strategi dan ketiga tier. Variansnya nol sehingga uji statistik tidak terdefinisi.

Penyebabnya komponen `ProductCard` menetapkan `width` dan `height` pada setiap elemen `<img>`, sehingga browser memesan ruang sebelum gambar termuat.

**Tulis sebagai temuan, bukan kegagalan:** praktik menetapkan dimensi gambar secara eksplisit menghilangkan Cumulative Layout Shift terlepas dari strategi rendering maupun beban media.

**Status:** melekat pada desain aplikasi, dilaporkan sebagai temuan.

---

## 9. Jumlah gambar yang terunduh 13 dari 20

Enam belas dari dua puluh kartu memakai `loading="lazy"`. Pada viewport mobile yang menjadi default Lighthouse, gambar di bawah lipatan layar tidak diunduh.

**Bukan anomali:** angkanya **13 pada seluruh 180 run tanpa kecuali** — nol variasi. Empat kartu pertama sengaja dibuat `eager` karena menjadi kandidat LCP.

**Status:** perilaku yang benar, dinyatakan agar tidak disalahpahami.

---

## 10. Aset media disajikan melalui function, bukan CDN statis

Vercel menjalankan Express secara native, sehingga `express.static` melayani gambar melalui serverless function, bukan langsung dari CDN.

**Dampak terhadap validitas: tidak ada** — keempat strategi menerima media melalui jalur yang persis sama, sehingga tetap merupakan variabel terkontrol. Terbukti dari byte gambar yang identik di keempat strategi pada setiap tier.

**Status:** dapat diterima, dinyatakan untuk transparansi.

---

## 11. Variabilitas tinggi pada tier heavy

Simpangan baku LCP mencapai **11.303 ms** pada SSG tier heavy. Untuk tier heavy, **laporkan median di samping mean**, karena mean mudah tertarik oleh outlier.

Variabilitas inilah yang membuat seluruh 35+ pengujian memakai Kruskal-Wallis — tidak satu pun kelompok lolos asumsi normalitas dan homogenitas varians.

**Status:** melekat pada data, ditangani dengan uji non-parametrik.

---

## 12. Data pilot study tidak sebanding

Pilot study 24 Maret 2026 dijalankan pada Next.js 15, Node v22, Lighthouse 13.0.3, k6 1.6.1, di localhost, dengan n = 1.

Data final memakai Next.js 16.4.3 (bundler Turbopack), Node v26, Lighthouse 13.5.0, k6 2.3.0, di Vercel sin1, dengan n = 15.

**Jangan mencampur angkanya.** Posisikan pilot study sebagai *proof-of-concept* yang membuktikan penelitian dapat dikerjakan.

**Status:** diselesaikan dengan pelabelan ulang.

---

## 13. SonarQube mengukur SAST, bukan SCA

SonarQube menganalisis source code sendiri (*static application security testing*). Ia **tidak memindai kerentanan dependency** (*software composition analysis*).

Karena itu "Security Rating A" **tidak berarti aplikasinya aman**. Konsisten dengan Batasan Masalah #7 yang menempatkan keamanan di luar cakupan.

**Status:** perlu dinyatakan saat menulis bagian maintainability.

---

## 14. ✅ RESOLVED — Lighthouse `throttlingMethod: simulate` sempat menghasilkan LCP tidak valid

**Masalah yang ditemukan.** Pengukuran 180 run pertama (sebelum perbaikan ini) memakai pengaturan bawaan Lighthouse, `throttlingMethod: "simulate"`. Pada metode ini, jaringan sungguhan berjalan di kecepatan asli (cepat), lalu metrik performa **dihitung ulang** lewat model matematis -- bukan diukur langsung dari observasi nyata.

Untuk strategi CSR (yang menukar total DOM dari teks "Loading..." menjadi grid produk setelah data diterima), model simulasi ini salah mengidentifikasi elemen LCP. Akibatnya, **13 dari 15 run CSR-React dan 14 dari 15 run CSR-Next pada tier heavy** menghasilkan LCP yang terkunci pada teks pemuatan awal (sekitar 2 detik), bukan pada gambar produk yang sesungguhnya -- padahal 29-38 MB gambar dan video masih diunduh di latar belakang saat trace pengukuran berakhir.

**Bukti diagnostik:** pada run yang rusak, FCP, LCP, dan TTI tercatat sangat berdekatan (misalnya 1.220 / 2.301 / 2.301 ms) walau ukuran halaman mencapai puluhan megabita -- pola klasik metrik yang "terkunci" pada tampilan awal, bukan tampilan akhir.

**Perbaikan.** Seluruh 180 pengukuran diulang dengan `throttlingMethod: "devtools"` (throttling jaringan diterapkan sungguhan, bukan disimulasikan secara matematis) dan `max-wait-for-load` diperpanjang menjadi 240 detik. Hasilnya diverifikasi bersih: 0 dari 15 run pada tiap sel tier heavy menunjukkan gejala serupa, dan LCP naik konsisten dari tier light ke heavy pada keempat strategi.

**Dampak pada kesimpulan.** Kesimpulan awal bahwa "efek framework tidak signifikan terhadap LCP" dan "efek strategi hilang pada tier heavy" **terbukti keliru** -- keduanya berasal dari data yang cacat. Dengan data yang benar, baik efek strategi rendering maupun efek framework terbukti signifikan pada ketiga tier, dengan efek strategi justru menguat pada tier heavy (ε² = 0,714, tertinggi di antara ketiga tier).

**Status:** ✅ diperbaiki dan diverifikasi sebelum data final digunakan. Dicatat di sini sebagai bentuk transparansi proses penelitian -- bukan disembunyikan -- karena menunjukkan proses verifikasi yang cermat terhadap validitas instrumen pengukuran.

---

## 15. 🔴 SSG pada 500 dan 1000 VU terbatas jaringan

**Masalah.** Pada pengujian server lokal, hasil SSG pada 500 dan 1000 pengguna virtual tidak mencerminkan kapasitas server.

**Bukti.**

| Bukti | Nilai |
|---|---|
| Trafik keluar server (kabel) | 96 Mbps (500 VU), 95 Mbps (1000 VU) |
| Kapasitas kabel terukur (iperf3) | ~93 Mbps kedua arah (adaptor USB 100 Mbps) |
| CPU proses Node | ~55% dari satu inti; CPU total 32% |
| Ukuran dokumen | ~49 KB; 216 req/s x 49 KB = ~85 Mbps |
| Pengujian Wi-Fi 5 GHz sebelumnya | Tx 73 Mbps rata-rata (maks 85) = kapasitas Wi-Fi ~75-80 Mbps; CPU 18% |

**Mengapa tidak diatasi.** Adaptor Ethernet yang tersedia hanya 100 Mbps. Adaptor gigabit (dan port router gigabit) akan menghilangkan batas ini; belum dibeli.

**Yang tetap dapat disimpulkan.** Pada 100 VU semua strategi valid; pada 500/1000 VU, SSR dan kedua CSR valid sebagai data server.

**Status:** terbuka. Opsional diulang untuk SSG saja dengan adaptor gigabit.

---

## 16. Satu mesin, satu proses Node per layanan, satu kali jalan per sel

**Masalah.** Server uji berkemampuan rendah (Pentium Silver N6000, 4 inti, 7,75 GB) dan setiap layanan berjalan sebagai satu proses Node tanpa cluster/PM2. Pemantauan menunjukkan proses SSR dan CSR menjenuhkan satu inti (~99-119%) sementara CPU total di bawah 52%. Setiap sel hanya dijalankan satu kali per pengujian jaringan.

**Dampak.** Angka absolut (misalnya throughput SSR ~75 req/s) khas untuk konfigurasi ini; produksi dengan banyak proses/inti akan berbeda. Variasi antar ulangan belum terukur.

**Status:** ✅ dinyatakan sebagai batasan; ulangan opsional bila waktu cukup.

---

## 17. k6 hanya mengunduh HTML dan hanya pada tier light

**Masalah.** Pengujian beban hanya mengunduh dokumen HTML, bukan gambar atau video, dan hanya pada satu tier media. Pengaruh variasi media pada sisi klien diukur terpisah dengan Lighthouse (lihat butir 2).

**Status:** ✅ disengaja; dijelaskan di 3.7.

---

# Ringkasan status

| # | Keterbatasan | Status |
|---|---|---|
| 1 | Load testing Vercel terbatas 100 VU | ✅ diatasi (server lokal) |
| 2 | RQ3 tidak mencakup variasi media | ✅ disengaja |
| 3 | Istilah Core Web Vitals | 🟡 perbaiki dokumen |
| 4 | Lab data, bukan field data | ✅ dinyatakan |
| 5 | Gambar sintetis | 🟡 keputusan penulis |
| 6 | Browser Brave, bukan Chrome | ✅ dinyatakan |
| 7 | Atribusi strategi vs framework | ✅ sebagian tertutup |
| 8 | CLS tidak dapat diuji | ✅ jadi temuan |
| 9 | 13 dari 20 gambar | ✅ perilaku benar |
| 10 | Media lewat function | ✅ tidak berdampak |
| 11 | Variabilitas tier heavy | ✅ ditangani |
| 12 | Pilot study tidak sebanding | ✅ dilabeli ulang |
| 13 | SonarQube SAST bukan SCA | 🟡 perbaiki saat menulis |
| 14 | Lighthouse throttling simulate -> LCP tidak valid | ✅ ditemukan & diperbaiki |
| 15 | SSG 500/1000 VU terbatas jaringan | 🔴 terbuka (opsional adaptor gigabit) |
| 16 | Satu mesin, satu proses Node, satu kali jalan | ✅ dinyatakan |
| 17 | k6 hanya HTML dan tier light | ✅ disengaja |

---

**Terakhir diperbarui:** 19 November 2026
