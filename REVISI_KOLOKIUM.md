# Revisi Naskah Kolokium — Menyesuaikan dengan Hasil Penelitian

> **Sumber:** `Kolokium_Fix_Revisi2.docx` · **Disusun:** 3 November 2026
> **Cara pakai:** cari paragraf lama di Word, ganti dengan teks baru. Nomor dalam kurung siku adalah urutan paragraf dalam berkas.

---

## 1. Batasan Masalah butir 2 — istilah Core Web Vitals  `[77]`

**❌ Teks lama**

> Pengujian performa aplikasi dilakukan menggunakan metrik Core Web Vitals yang meliputi Largest Contentful Paint (LCP), First Contentful Paint (FCP), Total Blocking Time (TBT), Speed Index (SI), Cumulative Layout Shift (CLS).

**Kenapa diganti:** FCP, TBT, dan Speed Index bukan Core Web Vitals. Core Web Vitals resmi saat ini terdiri atas LCP, CLS, dan INP. Kalau kelimanya disebut sebagai Core Web Vitals, penguji yang memperhatikan perkembangan metrik Google akan langsung menemukan kekeliruan ini.

**✅ Teks baru**

> Pengukuran performa sisi klien bertumpu pada dua metrik Core Web Vitals, yaitu Largest Contentful Paint (LCP) dan Cumulative Layout Shift (CLS). Metrik ketiga, Interaction to Next Paint (INP), tidak diukur karena penentuannya menuntut rekaman interaksi pengguna sungguhan di lapangan, sementara penelitian ini berlangsung sepenuhnya di lingkungan laboratorium. Sebagai pelengkap, penelitian turut mencatat First Contentful Paint (FCP), Total Blocking Time (TBT), Speed Index (SI), dan Time to Interactive (TTI). Keempatnya merupakan metrik performa Lighthouse, bukan bagian dari Core Web Vitals, dan TBT diperlakukan sebagai penanda tidak langsung bagi responsivitas halaman.

---

## 2. Batasan Masalah butir 5 — versi framework  `[80]`

**❌ Teks lama**

> Pengujian dilakukan menggunakan versi stabil terbaru dari framework React.js versi 19.2 dan Next.js versi 16.2.1 saat penelitian dilaksanakan, dalam lingkungan pengujian (testing environment) yang terkontrol.

**Kenapa diganti:** versi yang benar-benar dipakai adalah React 19.2.4 dan Next.js 16.4.3. Angka 16.2.1 sudah tertinggal beberapa rilis dan termasuk versi yang terdampak pembaruan keamanan Next.js pada pertengahan Oktober 2026.

**✅ Teks baru**

> Aplikasi uji dibangun di atas React.js versi 19.2.4 dan Next.js versi 16.4.3. Keduanya merupakan rilis stabil termutakhir pada saat pengambilan data berlangsung, dan versinya dikunci secara eksak agar siapa pun yang hendak mengulang penelitian ini memperoleh lingkungan yang persis sama. Seluruh pengujian berjalan dalam lingkungan yang terkendali.

---

## 3. Batasan Masalah — butir BARU tentang batas pengujian beban

**Kenapa ditambahkan:** pengujian beban hanya berhasil sampai 100 pengguna virtual. Lebih dari itu, mitigasi DDoS bawaan platform mulai menghadang permintaan. Batas ini wajib disebutkan sendiri sebelum penguji menemukannya.

**✅ Sisipkan sebagai butir baru setelah butir 4**

> Pengujian beban sisi server dibatasi hingga 100 pengguna virtual simultan. Pada tingkat beban di atas angka tersebut, mekanisme perlindungan bawaan platform hosting mulai menolak permintaan yang datang, sehingga angka yang terbaca tidak lagi menggambarkan kemampuan aplikasi melainkan ambang perlindungan platform. Uraian lengkap beserta buktinya disajikan pada bagian metode penelitian.

---

## 4. Batasan Masalah butir 1 — cakupan strategi rendering  `[76]`

**Kenapa diperluas:** rancangan akhir menambahkan satu kondisi, yaitu CSR yang dijalankan di atas Next.js. Penambahan ini membuat pengaruh strategi dan pengaruh framework dapat dipisahkan.

**✅ Teks baru**

> Penelitian berfokus pada perbandingan strategi rendering, dengan Client-Side Rendering (CSR) diwakili React.js serta Server-Side Rendering (SSR) dan Static Site Generation (SSG) diwakili Next.js. Di luar ketiga kondisi utama tersebut, penelitian menyertakan satu kondisi pelengkap berupa CSR yang berjalan di atas Next.js. Kondisi tambahan ini berfungsi memisahkan pengaruh strategi rendering dari pengaruh framework, dua hal yang pada rancangan semula tidak dapat dibedakan karena CSR hanya teramati pada React.

---

## 5. Pengujian media video  `[176]`

**❌ Teks lama**

> Penelitian ini juga melibatkan media video sebagai bagian dari skenario pengujian. Video ringan memiliki ukuran antara 1 MB hingga 5 MB, video sedang berkisar antara 5 MB hingga 15 MB, dan video berat berada pada rentang 15 MB hingga 50 MB.

**⚠️ Ini yang paling mendesak diputuskan.** Video **tidak jadi diuji**. Ada dua jalan, pilih salah satu:

**Pilihan A — hapus video dari cakupan** (disarankan, karena data sudah lengkap tanpanya)

> Variasi beban media pada penelitian ini dibatasi pada media gambar. Media video tidak disertakan karena perilaku pemuatannya bergantung pada pengaturan `preload` peramban: dengan nilai bawaan, berkas video tidak diunduh sehingga tidak memengaruhi metrik sama sekali, sedangkan pemuatan paksa menghasilkan konsumsi kuota jaringan yang jauh melampaui batas wajar pengujian berulang. Pembatasan pada media gambar membuat ukuran byte yang diterima setiap aplikasi dapat dikendalikan secara presisi.

**Pilihan B — tetap uji video.** Perlu tambahan kerja: membuat enam berkas video, mengubah komponen, deploy ulang keenam aplikasi, dan mengulang seluruh 180 pengukuran. Perkiraan 3–4 jam, dan hasilnya kemungkinan besar tidak mengubah kesimpulan.

---

## 6. Rancangan eksperimen  `[161]`, `[162]`, `[163]`

**❌ Teks lama** — menyebut dua aplikasi dengan pembagian "Aplikasi A" dan "Aplikasi B".

**Kenapa diganti:** rancangan akhir menguji empat kondisi rendering pada tiga tingkat beban media, menghasilkan dua belas sel pengujian.

**✅ Teks baru (ganti ketiga paragraf sekaligus)**

> Rancangan eksperimen bertumpu pada dua aplikasi e-commerce yang dibangun dengan fitur, struktur halaman, tampilan, dan kumpulan data yang sama persis. Kesamaan ini menjamin bahwa selisih hasil yang muncul bersumber dari strategi rendering, bukan dari perbedaan lain di luar kendali peneliti.
>
> Dari kedua aplikasi tersebut diturunkan empat kondisi rendering. Aplikasi React menyediakan satu kondisi, yaitu Client-Side Rendering. Aplikasi Next.js menyediakan tiga kondisi, yaitu Client-Side Rendering melalui pemuatan dinamis tanpa rendering di server, Static Site Generation, dan Server-Side Rendering. Ketiga kondisi pada Next.js menampilkan halaman katalog yang identik dan hanya berbeda pada direktif caching-nya, sehingga selisih yang terukur benar-benar berasal dari cara halaman dirakit.
>
> Keempat kondisi tersebut diuji pada tiga tingkat beban media sehingga terbentuk dua belas sel pengujian. Setiap sel diukur sebanyak lima belas kali, menghasilkan 180 pengukuran secara keseluruhan.

---

## 7. Lingkungan pengujian  `[167]`

**❌ Teks lama** — menyebut "runtime Node.js versi yang sesuai dengan framework" tanpa angka pasti, dan belum menyebut peramban yang dipakai.

**✅ Teks baru**

> Lingkungan penelitian memakai platform Vercel paket Hobby dengan wilayah server Singapura (sin1), yaitu lokasi terdekat dari Indonesia. Aplikasi berjalan di atas Node.js v26.0.0 dengan pnpm 11.1.2 sebagai pengelola paket, dan konfigurasi build kedua aplikasi disamakan sepenuhnya.
>
> Pengukuran sisi klien dijalankan melalui Lighthouse 13.5.0 di atas Brave Browser 154.1.96.59. Brave berbagi mesin render dan mesin JavaScript yang sama dengan Google Chrome karena keduanya berbasis Chromium. Aplikasi uji sama sekali tidak memuat sumber daya dari pihak ketiga, sehingga fitur pemblokiran bawaan Brave tidak memiliki sasaran. Hal ini dipastikan secara empiris: seluruh permintaan gambar terunduh utuh pada setiap pengukuran.
>
> Pengujian sisi server menggunakan k6 2.3.0 yang diarahkan ke alamat produksi masing-masing aplikasi, sehingga angka yang diperoleh mencerminkan kondisi akses pengguna sebenarnya. Pengolahan statistik dikerjakan dengan Python 3.13 beserta pustaka NumPy 2.5.4 dan SciPy 1.18.1.

---

## 8. Prosedur pengukuran sisi klien  `[177]`

**❌ Teks lama** — "dilakukan secara berulang sebanyak 10 hingga 20 kali, kemudian dihitung nilai rata-rata".

**Kenapa diperjelas:** menyimpan hasil mentah tiap pengukuran adalah syarat mutlak. Tanpa itu simpangan baku tidak dapat dihitung, dan tanpa simpangan baku uji statistik tidak mungkin dijalankan.

**✅ Teks baru**

> Setiap sel pengujian diukur sebanyak lima belas kali. Laporan mentah dari setiap pengukuran disimpan sebagai berkas tersendiri, tidak langsung dirata-ratakan, sebab simpangan baku hanya dapat dihitung bila nilai setiap pengulangan tersedia utuh. Sebelum setiap rangkaian pengukuran dimulai, singgahan data pada lapisan API dihangatkan terlebih dahulu agar pengukuran pertama tidak terbebani kondisi singgahan yang masih kosong.
>
> Metrik yang dicatat meliputi Largest Contentful Paint, Cumulative Layout Shift, First Contentful Paint, Total Blocking Time, Speed Index, Time to Interactive, dan Performance Score. Selain itu dicatat pula jumlah serta ukuran total berkas gambar yang benar-benar terunduh pada setiap pengukuran, sebagai bukti terukur bahwa perlakuan beban media sungguh terjadi.

---

## 9. Pengujian beban  `[180]`

**❌ Teks lama**

> Pengujian menyimulasikan 100, 500, dan 1000 pengguna virtual (virtual users) secara simultan...

**✅ Teks baru**

> Pengujian beban dirancang untuk tiga tingkat jumlah pengguna, yaitu 100, 500, dan 1000 pengguna virtual, yang masing-masing dijalankan sebagai pengukuran terpisah. Pada pelaksanaannya hanya tingkat 100 pengguna virtual yang menghasilkan data sahih.
>
> Pada beban yang lebih besar, mekanisme perlindungan bawaan platform hosting mulai menghadang permintaan dengan halaman verifikasi, sehingga yang terekam bukan lagi kemampuan aplikasi melainkan ambang perlindungan platform. Tiga hal menguatkan simpulan ini. Pertama, aplikasi berbasis berkas statis yang disajikan lewat jaringan distribusi konten pun ikut gagal pada tingkat beban yang sama, padahal jaringan semacam itu mustahil kewalahan pada laju 181 permintaan per detik. Kedua, laju layanan justru menurun bersamaan dengan naiknya tingkat kegagalan: pengujian singkat pada 900 pengguna virtual terhadap sasaran yang sama mencatat 605 permintaan per detik tanpa satu pun kegagalan, sementara pengujian berdurasi panjang pada 1000 pengguna virtual hanya mencatat 181 permintaan per detik dengan kegagalan 56 persen. Pola semacam itu hanya masuk akal bila ada pihak yang menolak permintaan, bukan bila server kehabisan daya. Ketiga, tajuk respons yang diterima menunjukkan penanda mitigasi platform secara eksplisit.
>
> Pengujian beban juga dibatasi pada satu tingkat beban media. Pembatasan ini diambil karena k6 hanya mengunduh dokumen HTML dan tidak mengunduh berkas gambar, sedangkan ukuran dokumen HTML praktis sama pada ketiga tingkat beban media. Dengan demikian pengujian beban mengukur ongkos pembangkitan dokumen di sisi server, sementara pengaruh beban media berada di sisi klien dan diukur melalui Lighthouse.

---

## 10. Dua metrik kegagalan yang dipisah  `[180]` — paragraf tambahan

**Kenapa perlu:** pada pengujian awal, "tingkat kesalahan 100 persen" sebenarnya berarti ambang waktu terlampaui, bukan server mati. Kalau tidak dipisah, kalimat itu mudah dipatahkan.

**✅ Sisipkan setelah penjelasan k6**

> Tingkat kegagalan dan pelanggaran ambang waktu dicatat sebagai dua besaran terpisah. Tingkat kegagalan menghitung proporsi respons yang berstatus selain 200, sedangkan pelanggaran ambang waktu menghitung proporsi respons yang melampaui tiga detik. Pemisahan ini penting karena respons yang lambat tidak berarti server gagal melayani, dan menggabungkan keduanya berpotensi melahirkan simpulan yang menyesatkan.

---

## 11. Analisis data  `[193]`

**❌ Teks lama** — menyebut ANOVA sebagai pilihan utama, Kruskal-Wallis sebagai alternatif bila asumsi tidak terpenuhi.

**Kenapa diganti:** kerangkanya tetap benar, tetapi hasilnya perlu dinyatakan. Tidak satu pun dari 35 pengujian memenuhi asumsi, sehingga seluruhnya memakai jalur non-parametrik.

**✅ Teks baru**

> Pengujian signifikansi diawali dengan pemeriksaan asumsi. Normalitas sebaran diuji menggunakan Shapiro-Wilk dan kehomogenan ragam diuji menggunakan Levene. Apabila keduanya terpenuhi, perbedaan antar kelompok diuji dengan Analysis of Variance satu arah yang dilanjutkan uji lanjut Tukey HSD. Apabila salah satu asumsi tidak terpenuhi, pengujian beralih ke Kruskal-Wallis dengan uji lanjut Mann-Whitney berkoreksi Bonferroni. Besar pengaruh dilaporkan melalui eta-kuadrat atau epsilon-kuadrat, pada taraf nyata 0,05.
>
> Pada pelaksanaannya, tidak satu pun dari tiga puluh lima pengujian memenuhi kedua asumsi secara bersamaan. Seluruh analisis karena itu menempuh jalur non-parametrik. Pemilihan ini merupakan konsekuensi dari sifat data, bukan preferensi peneliti, dan nilai peluang dari setiap uji asumsi dilampirkan agar dapat ditelusuri.
>
> Pengujian terhadap pengaruh strategi rendering dan pengaruh beban media dijalankan secara terpisah. Pengaruh strategi diuji pada setiap tingkat beban media, sedangkan pengaruh beban media diuji pada setiap strategi. Pemisahan ini diperlukan supaya kedua faktor tidak saling mengaburkan.

---

## 12. Landasan teori — dua subbab baru

**✅ Tambahkan pada bagian 6.2**

**6.2.7 Hydration.** Diperlukan karena pembahasan hasil menguji anggapan umum bahwa Total Blocking Time yang tinggi bersumber dari proses hydration. Penelitian ini menemukan hal yang berbeda, sehingga konsepnya perlu dijelaskan lebih dahulu.

**6.2.8 Uji statistik non-parametrik.** Mencakup Kruskal-Wallis, Mann-Whitney, koreksi Bonferroni, dan epsilon-kuadrat. Diperlukan karena seluruh analisis menempuh jalur ini.

---

## 13. Definisi Core Web Vitals  `[109]`

**✅ Sisipkan setelah paragraf pembuka 6.2.1**

> Perlu ditegaskan bahwa Core Web Vitals sebagaimana ditetapkan Google saat ini mencakup tiga metrik, yaitu Largest Contentful Paint, Cumulative Layout Shift, dan Interaction to Next Paint. Metrik lain seperti First Contentful Paint, Total Blocking Time, Speed Index, dan Time to Interactive bukan bagian dari Core Web Vitals, melainkan metrik performa yang dilaporkan Lighthouse untuk memperkaya gambaran perilaku pemuatan halaman.

---

# Ringkasan

| # | Bagian | Jenis |
|---|---|---|
| 1 | Batasan Masalah butir 2 | ganti |
| 2 | Batasan Masalah butir 5 | ganti |
| 3 | Batasan Masalah butir baru | tambah |
| 4 | Batasan Masalah butir 1 | perluas |
| 5 | Media video | **perlu keputusan** |
| 6 | Rancangan eksperimen 8.1 | ganti |
| 7 | Lingkungan pengujian 8.1.1 | ganti |
| 8 | Prosedur pengukuran klien | ganti |
| 9 | Pengujian beban | ganti |
| 10 | Pemisahan dua metrik kegagalan | tambah |
| 11 | Analisis data 8.3 | ganti |
| 12 | Landasan teori 6.2.7 & 6.2.8 | tambah |
| 13 | Definisi Core Web Vitals | tambah |

**Terakhir diperbarui:** 3 November 2026

---

# Lampiran — Jawaban untuk 3 Masukan Dosen Kolokium

> Ditambahkan 3 November 2026. Tiga masukan diterima saat sidang kolokium.
> Jawaban di bawah disusun dari apa yang sudah dibangun dan diukur, bukan rencana.

## Masukan 1 — "Perlu disebutkan aplikasi e-commerce apa yang digunakan: buatan sendiri atau CMS?"

**Jawaban:** aplikasi dibangun sendiri (custom-built), bukan CMS seperti WordPress/WooCommerce, Shopify, atau Magento.

**Sisipkan sebagai paragraf baru di 8.1 Pendekatan Penelitian, setelah penjelasan dua aplikasi:**

> Kedua aplikasi dibangun sepenuhnya oleh peneliti, bukan menggunakan Content Management System (CMS) seperti WordPress dengan WooCommerce, Shopify, atau Magento. Keputusan ini diambil karena CMS pada umumnya sudah membawa arsitektur rendering tertentu yang tidak dapat diganti secara bebas — WooCommerce misalnya terikat pada rendering sisi server milik WordPress, sementara Shopify menentukan sendiri strategi rendering platformnya. Jika testbed dibangun di atas CMS, peneliti tidak dapat mengisolasi strategi rendering sebagai variabel bebas, dan hasil pengukuran akan tercampur dengan karakteristik bawaan platform tersebut. Dengan aplikasi yang dibangun sendiri, struktur komponen, halaman, dan sumber data dapat dijaga identik di antara kedua aplikasi, sehingga perbedaan hasil benar-benar dapat diatribusikan pada strategi rendering yang diuji.
>
> Kedua aplikasi mengambil data produk dari sumber yang sama, yaitu lapisan API middleware yang menyajikan dua puluh produk dengan struktur data identik (nama, harga, kategori, gambar, dan rating), diperkaya dengan media gambar dan video dalam tiga tingkat beban sebagai variabel utama penelitian.

**Catatan jujur soal sumber data produk:** data produk (nama, harga, kategori) berasal dari FakeStoreAPI sebagai snapshot tetap, lalu gambar produknya diunduh ulang dan disajikan sendiri oleh middleware. Ini perlu disebut eksplisit supaya tidak terkesan data sepenuhnya rekaan.

---

## Masukan 2 — "Metrik apa yang digunakan untuk pengukuran performa server?"

**Jawaban:** empat metrik dari k6, dibagi dua kelompok — waktu respons dan ketersediaan.

**Sisipkan sebagai paragraf baru, bisa digabung ke 8.2.1 bagian Pengujian Performa Server:**

> Pengujian performa server mengukur empat metrik. Kelompok pertama, waktu respons, mencakup rata-rata (average), median, persentil ke-95 (p95), dan nilai maksimum — keempatnya diukur dalam milidetik dan mencerminkan seberapa cepat server menjawab permintaan pada kondisi beban tertentu. Kelompok kedua, ketersediaan, mencakup throughput (jumlah permintaan yang berhasil dilayani per detik) serta dua metrik kegagalan yang sengaja dipisahkan: tingkat kesalahan (error rate), yaitu persentase respons berstatus selain 200, dan tingkat pelanggaran ambang waktu (SLA breach rate), yaitu persentase respons yang melebihi tiga detik. Pemisahan dua metrik kegagalan tersebut penting karena respons yang lambat tidak selalu berarti server gagal melayani permintaan.

**Dasar pemilihan empat metrik ini** didukung praktik yang sama di penelitian sejenis — studi pengujian beban pada sistem informasi akademik memakai persis response time, throughput, dan error rate sebagai tiga metrik utamanya (Danutirta et al., 2026).

---

## Masukan 3 — "Perlu diperbanyak daftar pustaka serta sitasinya"

**4 sitasi baru, sudah diverifikasi sumbernya langsung — bukan hasil mengarang.** Ditambahkan ke Daftar Pustaka, urut abjad:

> Anggraini, E. P. (2024). Statistika non parametrik: Analisis perbedaan pengunjung website resmi Kabupaten Malang menurut Devices Mobile menggunakan Uji Kruskal-Wallis. Maliki Interdisciplinary Journal, 2(2).

> Danutirta, A. S., Sulasno, M. S., Anto, D., & Igriza, M. (2026). Performance and rate limiting testing of an academic information system using the k6 testing tool: A case study of Politeknik XYZ. Simtek: Jurnal Sistem Informasi dan Teknik Komputer, 11(2), 410–419. https://doi.org/10.51876/simtek.v11i2.1824

> Google. (2025). Interaction to Next Paint (INP). web.dev. Diakses dari https://web.dev/articles/inp

**Dipakai di mana:**
- Anggraini (2024) → mendukung 8.3 Analisis Data, bagian pemilihan uji Kruskal-Wallis untuk data yang tidak normal
- Danutirta et al. (2026) → mendukung 8.2.1, pemilihan response time/throughput/error rate sebagai metrik server (lihat Masukan 2 di atas)
- Google (2025) → mendukung 6.2.1 dan Batasan Masalah #2, definisi resmi Core Web Vitals (LCP, CLS, INP) dan alasan INP tidak diukur

### Yang masih perlu kamu cari sendiri

Saya temukan tapi **tidak bisa memverifikasi detail sitasinya** (halamannya memblokir pengambilan otomatis) — cek manual kalau mau dipakai:
- Jurnal TIN: Terapan Informatika Nusantara, Vol 7 No 1, Juni 2026, tentang load testing k6 dengan 150 virtual users. URL: `ejurnal.seminar-id.com/index.php/tin/article/view/9838`

Topik yang belum dicarikan sitasinya sama sekali — kalau dosen masih merasa kurang, prioritaskan ini:
- Perbandingan performa video encoding / bitrate terhadap waktu muat halaman
- Hydration pada React Server Components (untuk subbab 6.2.7 yang baru)
- Metodologi pengujian A/B atau controlled experiment pada rendering strategi (umum, bukan spesifik web)

**Saran pencarian:** Garuda (garuda.kemdikbud.go.id) dan Sinta (sinta.kemdikbud.go.id) untuk jurnal nasional terakreditasi — pola sitasi yang sudah ada di kolokiummu (Hanafi, Haryono, dkk.) semuanya dari sana. Kata kunci yang efektif: gabungkan istilah Indonesia + Inggris, misal "load testing aplikasi web k6" atau "static code analysis maintainability SonarQube".

