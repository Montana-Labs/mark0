# Pustaka dan argumen pembatasan format (disiapkan 17 November 2026)

Aturan: hanya jurnal. Kolom "Status baca" jujur: **Dibaca** = teks/abstrak sendiri dibuka; **Metadata** = hanya catatan
bibliografi/abstrak dari pangkalan indeks, PDF belum dibuka (buka dulu sebelum dikutip dengan angka/halaman).

## A. Jurnal yang sudah terverifikasi

| # | Sitasi | Dipakai untuk | Status baca |
|---|---|---|---|
| 1 | Ismail, A., Ananta, A. Y., Arief, S. N., & Hamdana, E. N. (2023). Performance testing sistem ujian online menggunakan JMeter pada lingkungan virtual. *Jurnal Informatika Polinema (JIP)*, 9(2). https://doi.org/10.33795/jip.v9i2.1190 | Throughput, response time, error %, serta CPU dan memori sebagai target load testing; target 1000 pengguna; batas "2 menit" ditetapkan sesuai konteks sistem | **Dibaca** (PDF penuh) |
| 2 | Hanggara, B. T., Nasrullah, M. H., & Pramono, D. (2024). Analisis perbandingan performa framework NestJS dan Lumen pada studi kasus aplikasi berbasis REST API. *J-INTECH*, 12(1). https://doi.org/10.32664/j-intech.v12i1.1354 | Response time, CPU, dan memori sebagai metrik perbandingan performa | Metadata + abstrak (situs jurnal bersertifikat kedaluwarsa) |
| 3 | Nah, F. F.-H. (2004). A study on tolerable waiting time: how long are Web users willing to wait? *Behaviour & Information Technology*, 23(3), 153-163. https://doi.org/10.1080/01449290410001669914 | Waktu tunggu yang ditoleransi pengguna web ~2 detik | Metadata + abstrak |
| 4 | Galletta, D. F., Henry, R., McCoy, S., & Polak, P. (2004). Web site delays: how tolerant are users? *Journal of the Association for Information Systems*, 5(1), 1-28. | Penundaan 0-12 detik pada 196 subjek; penurunan performa dan niat perilaku mendatar mulai ~4 detik, sikap mendatar ~8 detik; rujukan ambang bervariasi antara 2 dan 12 detik | **Dibaca** (teks penuh) |
| 5 | Wallace, G. K. (1992). The JPEG still picture compression standard. *IEEE Transactions on Consumer Electronics*, 38(1). https://doi.org/10.1109/30.125072 | Metode Baseline JPEG paling banyak diimplementasikan | Metadata |
| 6 | Wiegand, T., Sullivan, G. J., Bjontegaard, G., & Luthra, A. (2003). Overview of the H.264/AVC video coding standard. *IEEE Transactions on Circuits and Systems for Video Technology*, 13(7), 560-576. | H.264/AVC untuk aplikasi siaran, streaming, dan jaringan LAN/Internet; rancangan "network-friendly" | **Dibaca** (halaman 1-2) |
| 7 | Yusuf, A. M. (2025). Uji efektivitas kompresi gambar WebP dan AVIF dalam mengurangi waktu load perangkat desktop dan mobile. *INTECOMS: Journal of Information Technology and Computer Science*, 8(5). https://doi.org/10.31539/tdvykv48 | Format modern (AVIF/WebP) lebih kecil dari JPEG; dasar menyebut format lain sebagai keterbatasan/saran | Abstrak **dibaca** |
| 8 | Triawan dkk. (2026), JUPTIK 4(1), DOI 10.52060/juptik.v4i1.4270 | Response time, throughput, error rate sebagai metrik load testing (sudah diverifikasi 5 Nov) | Dibaca (sesi sebelumnya) |

## B. Peringatan (jangan salah kutip)

1. **Tahun Hanggara.** Handoko dkk. (2026) mencantumkan "Hanggara dkk. (2022), J-INTECH, 204, 181-189". Catatan resmi jurnal:
   **2024, vol. 12 no. 1**. Pakai 2024. Abstraknya hanya menyebut response time, CPU, dan memori (bukan throughput atau error rate),
   jadi jangan dikutip untuk dua metrik itu.
2. **Oktafianto, Hanggara, & Akbar (2025)**, *Jurnal Pengembangan Teknologi Informasi dan Ilmu Komputer* 9(2), 1-10: hanya
   ditemukan sebagai entri daftar pustaka Handoko dkk. Naskah dan abstraknya belum ditemukan. **Jangan dikutip** sebelum dibuka.
3. **Ambang SLA 3 detik.** Tidak ada jurnal terverifikasi yang menyebut persis 3 detik. Yang ada: ~2 detik (Nah, 2004) dan
   penurunan yang mendatar mulai ~4 detik (Galletta dkk., 2004). Jadi 3 detik berada di antara keduanya. Tulis sebagai
   **ambang operasional peneliti** yang dibatasi dua rujukan itu, jangan sebagai angka baku. Ismail dkk. (2023) juga menetapkan
   batasnya sendiri (2 menit) sesuai konteks sistem; jadi menetapkan ambang menurut konteks adalah praktik yang lazim.
4. Rujukan Handoko dkk. sendiri (REST API Node.js/.NET/Laravel) sudah ditolak sebagai rujukan utama karena topik berbeda.
   Pakai hanya untuk menelusuri jurnal asal.
5. Angka "53% pengguna seluler pergi setelah 3 detik" berasal dari laporan industri/blog, **bukan jurnal**; jangan dipakai.

## C. Konsep untuk menjawab Bu Nila (4 metrik k6)

Dukungan jurnal yang sekarang terverifikasi: response time, throughput, error (Ismail dkk. 2023; Triawan dkk. 2026), sumber daya
CPU/memori (Ismail dkk. 2023; Hanggara dkk. 2024), dan ambang waktu tunggu pengguna (Nah 2004; Galletta dkk. 2004) untuk metrik
SLA breach. Landasan SRE/RED di `BIMBINGAN_1_HASIL.md` bagian 9 bukan jurnal; tinggal sebagai konteks tambahan, bukan rujukan utama.
Yang belum ada: jurnal yang menamai "SLA breach rate" sebagai metrik baku. Rumuskan sebagai proporsi permintaan yang melampaui
ambang waktu tunggu pengguna (turunan dari Nah 2004 dan Galletta dkk. 2004).

## D. Draf argumen pembatasan JPG dan MP4 (untuk Batasan Masalah)

> Penelitian ini membatasi media pada gambar JPEG dan video MP4 (H.264). Pembatasan ini bertujuan menjaga **variabel yang
> diubah hanya beban media (ukuran berkas)**, bukan jenis algoritma kompresinya. Setiap format memakai algoritma kompresi dan
> biaya dekode yang berbeda, sehingga mencampur format (misalnya PNG, WebP, AVIF, AVI, atau RAW) akan menambah variabel
> perancu terhadap Core Web Vitals. JPEG dipilih karena metode Baseline-nya merupakan metode JPEG yang paling banyak
> diimplementasikan (Wallace, 1992), sedangkan H.264/AVC dirancang untuk aplikasi siaran, streaming, dan jaringan
> LAN/Internet dengan representasi yang "ramah jaringan" (Wiegand dkk., 2003).
>
> Ukuran media dikendalikan secara eksplisit. Gambar JPEG dibagi tiga tingkat: ringan (640 px, 50-150 KB), sedang (1500 px,
> 200-800 KB), dan berat (2800 px, 1-3 MB). Video MP4 berdurasi tetap 4 detik, resolusi 1280x720, 25 fps, dengan gerakan
> konten yang sama pada ketiga tingkat; yang divariasikan hanya bitrate (ringan 1-5 MB, sedang 5-15 MB, berat 15-50 MB).
> Dengan demikian pengaruh durasi dan gerakan konten, yang dapat membuat ukuran video tidak sebanding dengan bitrate,
> sudah dikendalikan.
>
> Format yang lebih baru seperti WebP dan AVIF terbukti menghasilkan berkas lebih kecil dibanding JPEG (Yusuf, 2025), tetapi
> tidak dimasukkan agar variabel tetap tunggal; hal ini dicatat sebagai keterbatasan dan saran penelitian lanjutan.

Yang masih lemah (butuh jurnal sebelum dipakai): alasan PNG, AVI, RAW tidak umum untuk e-commerce (klaim "lossless besar, jarang
dipakai"). Selama belum ada jurnalnya, jangan menulis klaim itu; cukup alasan pengendalian variabel di atas.
Catatan: load test k6 hanya mengunduh HTML, jadi format media memengaruhi hasil Lighthouse/CWV, bukan k6.

## E. Empat PDF dari Downloads (dibaca 19 November 2026) dan keputusan pemakaian

Keempatnya memakai **JMeter**, bukan k6 (alat berbeda, metrik sama); tulis begitu di Bab 2.

| Jurnal | Isi yang terverifikasi (dibaca) | Keputusan |
|---|---|---|
| Hermanto, R. R., & Engel, M. M. (2025). Analisis komparatif kinerja Next.js, Nuxt.js, dan Remix.js dalam implementasi SSR website berita. *TIN: Terapan Informatika Nusantara*, 6(5), 450-463. DOI 10.47065/tin.v6i5.8315 | Next.js SSR; Lighthouse + JMeter 250/500/1000 VU; response time, throughput, error rate | **Utama** (topik paling dekat; dasar 500/1000 VU) |
| Yuwono, J. (2026). Analisis kinerja sistem e-learning Universitas Pamulang menggunakan load testing berbasis Apache JMeter. *Jurnal Informatika dan Teknologi Komputer (JITEK)*, 6(1), 53-66. DOI 10.55606/jitek.v6i1.8599 | 100-1000 pengguna; response time, throughput, tingkat kegagalan; CPU/memori/network; menyatakan respons <2-3 detik umumnya dianggap baik (merujuk Nielsen 1993, sebuah buku); titik kritis 300-500 pengguna | **Utama** (metrik + dasar ambang 3 detik + rentang VU) |
| Annisa, A. R., Ardiana, M., Rahayu, P. N., Brian, T., & Jami'in, M. A. (2026). Performance evaluation of web applications using JMeter load testing for server capacity and response efficiency. *Journal of Applied Informatics and Computing (JAIC)*, 10(1), 585-590. e-ISSN 2548-6861 | 50-5000 pengguna; response time, error rate, throughput, **bandwidth**; batas kemampuan server ditemukan di ~300 pengguna | **Utama** (bandwidth = permintaan Bu Nila; pola mencari titik jenuh) |
| Ginasari, N. L. A. S., Wibawa, K. S., & Wirdiani, N. K. A. (2021). Pengujian stress testing API sistem pelayanan dengan Apache JMeter. *JITTER*, 2(3). | Hanya 25-75 sampel, API Android; tidak ada CPU/memori | **Cadangan/dibuang**: skala kecil, topik API, 5 tahun |

Koreksi pada bagian B nomor 3: **Yuwono (2026) menyebut ambang 2-3 detik**, jadi ambang 3 detik punya rujukan jurnal langsung
(dengan catatan sumber aslinya buku Nielsen, jadi tulis "Yuwono, 2026, mengutip Nielsen, 1993" dan topang dengan Nah 2004 dan Galletta dkk. 2004
yang merupakan eksperimen).
Peluang telusur: Yuwono mengutip Gunasekaran & Kannan (2012), *International Journal of Computer Science and Engineering Technology*, 3(1), 38-44
sebagai sumber metrik (response time, throughput, CPU/memori, kegagalan). Belum dibuka; cari naskahnya dulu sebelum dikutip.
