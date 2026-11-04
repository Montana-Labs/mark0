# 🎓 Tanya Jawab Penting — Persiapan Sidang

> **Dibuat:** 29 Oktober 2026
> **Judul:** Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan Variasi Beban Media Menggunakan Core Web Vitals
> **Cara pakai:** tiap jawaban disertai **data pendukung** yang bisa kamu tunjukkan. Jangan menghafal kalimatnya — pahami angkanya.

---

# A. Desain Penelitian

## A1. "React itu library, Next.js itu framework. Ini bukan apple-to-apple."

**Jawaban singkat:** Penelitian ini membandingkan **strategi rendering**, bukan framework. React dipilih sebagai representasi CSR, Next.js sebagai representasi SSR dan SSG. Keduanya sama-sama React — Next.js dibangun di atas React.

**Data pendukung:** `react` dan `react-dom` versi **19.2.4 persis sama** di kedua aplikasi, dan sengaja tidak diupgrade sebagai variabel terkontrol. Bisa dibuktikan di `package.json` keduanya.

Yang berbeda hanya tiga hal, dan ketiganya konsekuensi langsung dari strategi rendering:

| | React | Next.js |
|---|---|---|
| Rendering | client-side | server-side / build-time |
| Data fetching | `useEffect` + `fetch` | async server component |
| Routing | React Router | App Router |

---

## A2. "Bagaimana memastikan kedua aplikasi benar-benar identik?"

**Jawaban singkat:** Dibuktikan berlapis, bukan diklaim.

**Data pendukung:**

1. **Komponen identik byte-per-byte.** `ProductCard.tsx` dan `ProductGrid.tsx` di kedua aplikasi sama persis kecuali baris import routing. Bisa didemokan dengan `diff`.
2. **Sumber data sama persis.** Keduanya fetch ke middleware yang sama, dengan snapshot 20 produk tetap di `products.json`.
3. **Byte media identik.** Terukur pada 180 run: tier light 1,28 MB, medium 6,20 MB, heavy 26,63 MB — **angkanya sama persis di CSR, SSG, dan SSR**. Ini bukti terkuat, karena berupa pengukuran, bukan arsitektur di atas kertas.
4. **ESLint config identik** (lihat C4 untuk catatan jujurnya).

---

## A3. "Kenapa perlu API middleware? Kenapa tidak fetch langsung?"

**Jawaban singkat:** Supaya beban server dan data yang diterima kedua aplikasi persis sama — ini memenuhi permintaan dosen pembimbing.

**Data pendukung:** Middleware memakai cache in-memory plus snapshot 20 produk. Selama pengujian, sumber data pihak ketiga tidak pernah dipanggil, sehingga latensi dan ketidakstabilan layanan luar tereliminasi.

Pada pilot study, middleware melayani **1.326 request/detik dengan 0% error**. Artinya terbukti bukan bottleneck — perbedaan performa antar strategi murni berasal dari rendering, bukan dari lapisan data.

---

## A4. "Kenapa ada 7 deployment? Katanya cuma 2 aplikasi."

**Jawaban singkat:** Tetap 2 aplikasi e-commerce + 1 API. Yang jadi 7 karena **tier media harus dibekukan saat build**, jadi satu build per tier.

| Aplikasi | Deployment |
|---|---|
| react-ecommerce (1 app) | `mark0-react-light` / `-medium` / `-heavy` |
| nextjs-ecommerce (1 app) | `mark0-next-light` / `-medium` / `-heavy` |
| api-middleware (API, bukan toko) | `mark0-middleware` |

Kode sumber ketiga deployment per aplikasi **identik per baris** — yang berbeda hanya satu variabel lingkungan.

---

## A5. "Kenapa tier media tidak bisa diganti lewat URL saja?"

**Jawaban singkat:** Karena halaman SSG dibekukan jadi berkas HTML pada tahap build. Parameter runtime tidak berpengaruh padanya.

| Strategi | Bisa ganti tier saat runtime? |
|---|---|
| CSR | bisa — fetch terjadi di browser |
| SSR | bisa — render tiap request |
| **SSG** | **tidak** — HTML sudah jadi berkas statis |

Kalau tier dikirim lewat query param, CSR dan SSR menurut sementara SSG tetap menyajikan tier bawaan build-nya. Dua strategi akan diuji dengan mekanisme berbeda dari yang ketiga — perbandingannya tidak adil.

Karena itu ketiganya diperlakukan simetris: tier ditetapkan saat build lewat env var (`MEDIA_TIER` / `VITE_MEDIA_TIER`).

---

## A6. "Bagaimana saya tahu aplikasi ini sedang memakai tier tertentu?"

Tiga cara, bisa didemokan langsung:

1. **Halaman indeks Next.js** — buka URL tanpa `/ssg`, tertulis *"Tier beban media aktif: heavy"*
2. **DevTools → Network → filter Img** — URL-nya `media/heavy/img-01.jpg`, kolom Size menunjukkan 2,1 MB. Cara ini berlaku untuk kedua aplikasi
3. **Kolom `image_bytes` di `metrics.csv`** — terekam pada setiap 135 run

---

## A7. "Kenapa SSG dan SSR diuji di halaman terpisah `/ssg` dan `/ssr`?"

**Jawaban singkat:** Supaya keduanya diukur pada halaman yang **identik**, sehingga selisihnya murni dari strategi rendering.

**Konteks jujur:** struktur awal penelitian ini mengukur SSG di halaman katalog (20 gambar) dan SSR di halaman detail produk (1 gambar). Itu berarti yang terukur adalah selisih *halaman*, bukan selisih strategi — dan uji ANOVA jadi tidak valid. Cacat ini ditemukan dan diperbaiki sebelum pengambilan data.

**Data pendukung:** output `next build` menandai `/ssg` sebagai `○ Static` dan `/ssr` sebagai `ƒ Dynamic`. Di produksi, header `x-vercel-cache` menunjukkan `HIT` untuk `/ssg` dan `MISS` untuk `/ssr` — bukti empiris keduanya benar-benar berperilaku berbeda, bukan sekadar label.

---

# A-bis. Asimetri CSR–SSR–SSG

> Bagian ini lahir dari keresahan penulis sendiri, dan justru itulah
> pertanyaan paling tajam yang mungkin diajukan penguji. Kalau hanya satu
> bagian yang sempat kamu kuasai, pilih bagian ini.

## A8. "Kenapa CSR hanya diwakili React? Kenapa Next.js tidak diuji CSR juga?"

**Jawaban singkat:** Karena Batasan Masalah #1 menetapkan demikian, dan asimetrinya bersifat teknis — bukan pilihan sembarangan.

**Kutipan dari proposal yang sudah disetujui:**

> "Penelitian ini berfokus pada perbandingan strategi rendering, yaitu Client-Side Rendering (CSR) **menggunakan React.js** serta Server-Side Rendering (SSR) dan Static Site Generation (SSG) **menggunakan Next.js**."

Kemampuan teknis kedua teknologi memang tidak simetris:

| | CSR | SSR | SSG |
|---|---|---|---|
| React + Vite | bisa | **tidak bisa** | **tidak bisa** |
| Next.js | bisa | bisa | bisa |

React tanpa framework tambahan **tidak memiliki kemampuan rendering di sisi server sama sekali**. Jadi grid simetris 2×3 tidak mungkin dibentuk tanpa mengubah hakikat React sebagai representasi CSR murni.

---

## A9. "Bukankah Next.js diuntungkan karena bisa tiga strategi, sementara React hanya satu?"

**Jawaban singkat:** Tidak. Tidak ada penjumlahan skor antar strategi — setiap sel diukur sendiri-sendiri.

**Analogi:** pelari tidak menang karena mendaftar di tiga nomor lomba. Yang dibandingkan catatan waktu per nomor, bukan banyaknya nomor yang diikuti.

**Data pendukung — dan ini bagian terpentingnya: hasilnya justru kebalikan dari dugaan itu.**

**LCP rata-rata (ms), 180 run:**

| Tier | CSR-React | CSR-Next | SSG-Next | SSR-Next |
|---|---|---|---|---|
| light | **3.224** | 3.507 | 3.865 | 3.991 |
| medium | 8.301 | 7.411 | 9.463 | **5.910** |
| heavy | 25.989 | 22.300 | 23.750 | **20.602** |

Tidak ada satu strategi pun yang unggul di semua kondisi. React-CSR tercepat di tier light, SSR-Next tercepat di tier medium dan heavy.

**TBT rata-rata (ms):**

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | **0,00** | **0,00** | **0,00** |
| CSR-Next | 77,4 | 73,2 | 63,9 |
| SSG-Next | 53,9 | 65,9 | 58,8 |
| SSR-Next | 60,7 | 60,3 | 58,1 |

Kalau desain ini benar-benar berat sebelah ke Next.js, pola seperti ini mustahil terjadi — React-CSR mencatat TBT nol mutlak pada seluruh 180 run.

---

## A10. "Next.js dibangun di atas React. Bukankah itu membuat perbandingannya tidak adil?"

**Jawaban singkat:** Justru sebaliknya — itu fondasi yang membuat perbandingan ini adil.

Karena Next.js memakai React di dalamnya, dan versinya **19.2.4 persis sama** dengan aplikasi React, maka yang dibandingkan bukan dua teknologi tak sejenis. Mesin render, model komponen, dan cara kerja UI-nya identik. **Yang berbeda hanya di mana HTML dirakit.**

**Pembanding yang tidak adil** akan terlihat seperti ini: React (TypeScript, komponen, hydration) versus Laravel Blade (PHP, MVC, tanpa JavaScript ke klien). Beda bahasa, beda paradigma, beda runtime — tidak mungkin diatribusikan ke satu faktor. Kandidat itu memang dipertimbangkan dan **ditolak** pada tahap pemilihan judul, tercatat di `DISKUSI_JUDUL_SKRIPSI.md`.

**Apple-to-apple diukur dari variabel terkontrol, bukan dari jumlah kondisi yang diuji.** Lihat A2 untuk daftar buktinya.

---

## A11. "Kenapa React tidak dibuat SSR saja dengan framework lain?"

**Jawaban singkat:** Karena begitu dipasangi framework, React bukan lagi representasi CSR murni — dan studinya berubah jadi perbandingan tiga framework.

Framework yang paling masuk akal untuk itu adalah **React Router v7 framework mode**, yang merupakan kelanjutan dari Remix. Kandidat Remix sudah dipertimbangkan dan ditolak pada tahap pemilihan judul dengan alasan terdokumentasi: hasilnya terlalu mirip dengan Next.js, tidak punya SSG bawaan, dan urgensi industrinya lemah.

Menempuh jalan itu berarti **memperlebar scope**, bukan memperkuat penelitian.

---

## A12. "Kenapa tidak Next.js saja untuk ketiga strategi? Itu lebih bersih."

**Jawaban singkat:** Secara metodologi memang lebih bersih, tetapi judul dan proposal sudah disetujui pada seminar kolokium dengan kerangka React versus Next.js.

Yang hilang kalau judulnya diganti:

| | |
|---|---|
| Tinjauan pustaka | Bab 2 dibangun dari literatur perbandingan React dan Next.js |
| Rumusan Masalah | Tiga dari empat RM menyebut perbandingan kedua teknologi secara eksplisit |
| Urgensi industri | Hilang skenario nyatanya: *"perusahaan sudah memakai React, apakah sepadan bermigrasi ke Next.js?"* |

Penelitian ini mempertahankan kerangka yang disetujui, dan menyatakan asimetrinya secara terbuka sebagai keterbatasan.

---

## A13. ⚠️ Keterbatasan yang WAJIB kamu sebut sendiri

Ini satu-satunya keberatan yang benar-benar sah pada desain ini. Sebutkan sebelum penguji menemukannya:

> **Karena CSR hanya diamati pada React, pengaruh strategi rendering dan pengaruh framework tidak dapat dipisahkan sepenuhnya.** Ketika hasil menunjukkan CSR unggul pada LCP, secara ketat belum dapat dipastikan apakah keunggulan itu berasal dari strategi CSR-nya atau dari karakteristik React sebagai pustaka yang lebih ringan dibanding Next.js.

**Kalimat lengkap untuk Bab 3:**

> "Sesuai Batasan Masalah, penelitian ini membandingkan strategi rendering dengan React sebagai representasi Client-Side Rendering dan Next.js sebagai representasi Server-Side Rendering serta Static Site Generation. Asimetri ini bersifat teknis: React tanpa framework tambahan tidak mendukung rendering di sisi server, sehingga pengujian ketiga strategi pada kedua teknologi secara simetris tidak dimungkinkan. Konsekuensinya, pengaruh strategi rendering dan pengaruh framework tidak dapat dipisahkan sepenuhnya pada kondisi CSR, dan hal ini dinyatakan sebagai keterbatasan penelitian."

**Celah ini SUDAH DITUTUP.** Route CSR ditambahkan pada Next.js, sehingga penelitian memiliki 12 sel dan tiga lapis analisis. Hasilnya ada di A14.

---

## A14. "Jadi perbedaan yang Anda ukur itu karena strateginya, atau karena framework-nya?"

**Jawaban singkat:** Keduanya berpengaruh signifikan dan searah — framework memperlambat, strategi juga berpengaruh, dan keduanya terpisah secara terukur berkat kondisi CSR-Next.

> ⚠️ **Catatan metodologi penting.** Jawaban awal untuk pertanyaan ini sempat keliru akibat cacat pengukuran: Lighthouse secara default memakai `throttlingMethod: "simulate"`, yang pada pola render CSR (DOM berpindah total dari teks "Loading..." ke grid produk) salah mengidentifikasi elemen LCP. Setelah diperbaiki dengan `throttlingMethod: "devtools"` (throttling jaringan sungguhan, bukan simulasi) dan pengukuran diulang penuh, hasilnya berubah. Angka di bawah adalah hasil final yang sudah diverifikasi bebas dari cacat itu (0/15 anomali pada seluruh sel tier heavy).

### Hasil final — efek framework (CSR-React vs CSR-Next, strategi sama)

| Tier | LCP CSR-React | LCP CSR-Next | p | ε² |
|---|---|---|---|---|
| light | 9.913 ms | 11.251 ms | 3,07×10⁻⁶ | 0,742 |
| medium | 28.346 ms | 29.465 ms | 0,00033 | 0,424 |
| heavy | 55.394 ms | 56.947 ms | 3,67×10⁻⁵ | 0,573 |

**Framework berpengaruh signifikan terhadap LCP di ketiga tier.** CSR-Next konsisten lebih lambat 1.000–1.500 ms dibanding CSR-React, pada strategi yang sama persis. Ini masuk akal: runtime Next.js membawa overhead (bundel lebih besar, inisialisasi framework) yang tidak ada pada React murni, terlepas dari strategi rendering yang dipakai.

### Hasil final — efek strategi murni (CSR-Next vs SSG vs SSR, framework sama)

| Tier | p | ε² |
|---|---|---|
| light | 4,09×10⁻⁷ | 0,653 |
| medium | 4,22×10⁻⁷ | 0,651 |
| heavy | 1,13×10⁻⁷ | **0,714** |

**Strategi rendering berpengaruh signifikan di ketiga tier, dan justru menguat pada tier heavy.** SSG dan SSR konsisten lebih cepat daripada CSR-Next di semua tier.

**Kesimpulan gabungan:** LCP dipengaruhi baik oleh strategi rendering maupun oleh framework, dan keduanya terbukti berpengaruh secara independen dan dapat dipisahkan berkat kondisi CSR-Next. Confound yang dikhawatirkan di A8–A13 tetap relevan disebutkan sebagai keterbatasan rancangan asli, tetapi kini terjawab dengan data, bukan dugaan.

---

## A15. "Bukankah TBT yang tinggi itu biaya hydration?"

**Jawaban singkat:** Tidak. Data membantahnya, dan temuan ini tetap kokoh pada pengukuran final.

| Strategi | TBT (light / medium / heavy) | Hydration HTML server? |
|---|---|---|
| CSR-React | 0,0 / 5,0 / 137,2 ms | tidak ada |
| **CSR-Next** | **83,3 / 82,6 / 83,3 ms** | **tidak ada** (`ssr: false`) |
| SSG-Next | 32,3 / 69,6 / 83,7 ms | ada |
| SSR-Next | 34,7 / 57,7 / 82,9 ms | ada |

CSR-Next memakai `next/dynamic` dengan `ssr: false`, sehingga HTML yang dikirim server **kosong** — tidak ada apa pun untuk di-hydrate. Namun TBT-nya tetap stabil di kisaran 83 ms pada ketiga tier, setara dengan SSG dan SSR, dan jauh di atas CSR-React.

**Kesimpulan:** selisih TBT berasal dari **runtime framework Next.js**, bukan dari proses hydration maupun dari strategi rendering. CSR-React yang benar-benar tanpa framework tambahan adalah satu-satunya kondisi dengan TBT mendekati nol. Tanpa sel CSR-Next, kesimpulan ini tidak akan pernah terbukti.

---

## A16. "Apakah pilihan strategi rendering selalu berpengaruh?"

**Jawaban singkat:** Ya, pada ketiga tier — dan pengaruhnya justru paling kuat pada beban terberat.

Uji efek strategi murni (CSR-Next vs SSG vs SSR, framework sama) terhadap LCP:

| Tier | p | ε² | Kesimpulan |
|---|---|---|---|
| light | 4,09×10⁻⁷ | 0,653 | signifikan |
| medium | 4,22×10⁻⁷ | 0,651 | signifikan |
| **heavy** | **1,13×10⁻⁷** | **0,714** | **signifikan, terkuat** |

Pada analisis utama (CSR-React vs SSG vs SSR, sesuai Batasan Masalah), polanya sama: SSG dan SSR berbeda signifikan dari CSR-React pada ketiga tier, dan SSG vs SSR sendiri mulai berbeda signifikan pada tier heavy (p = 0,016, sebelumnya tidak signifikan pada light dan medium).

**Implikasi:** strategi rendering tetap relevan bahkan pada beban media terberat — tidak hilang pengaruhnya seperti dugaan awal. Namun ini tidak mengubah temuan utama penelitian: efek beban media (ε² ≈ 0,86–0,88 pada RQ2, lihat C1) tetap jauh lebih besar daripada efek strategi rendering (ε² ≈ 0,65–0,71) maupun efek framework (ε² ≈ 0,42–0,74). Beban media tetap faktor paling dominan, strategi rendering adalah faktor kedua yang juga terbukti bermakna.

---

# B. Metodologi Pengukuran

## B1. "Kenapa 15 kali pengulangan? Kenapa tidak sekali saja?"

**Jawaban singkat:** Karena satu run bisa menyesatkan sepenuhnya.

**Data pendukung — contoh nyata dari penelitian ini:** pada uji coba satu run, SSG heavy menghasilkan LCP **44.668 ms** sementara SSR heavy 12.914 ms — selisih 3,5 kali. Setelah 15 run, rata-ratanya ternyata **hampir sama** (25.006 ms vs 25.177 ms) dan uji statistik menyatakan **tidak berbeda signifikan** (p = 0,97).

Kalau penelitian ini berhenti di satu run, kesimpulannya akan terbalik.

Variabilitas tier heavy memang sangat tinggi — SD LCP mencapai 13.778 ms pada SSG heavy. Justru karena itu pengulangan wajib.

---

## B2. "Kenapa memakai Kruskal-Wallis, bukan ANOVA?"

**Jawaban singkat:** Karena datanya tidak memenuhi asumsi ANOVA. Keputusan ini diambil berdasarkan uji, bukan preferensi.

**Data pendukung:** dari 35 pengujian, **nol** yang lolos asumsi normalitas (Shapiro-Wilk) **dan** homogenitas varians (Levene) sekaligus. Setiap keputusan beserta p-value uji asumsinya tercetak di `results/analisis.md`, jadi bisa ditelusuri satu per satu.

Post-hoc memakai Mann-Whitney dengan koreksi Bonferroni (alpha 0,05/3 = 0,0167).

---

## B3. "Kenapa LCP sampai 23 detik? Itu tidak masuk akal."

**Jawaban singkat:** Karena Lighthouse secara default mensimulasikan perangkat mobile dengan throttling jaringan lambat, dan tier heavy memuat 26,63 MB gambar.

Angka absolutnya memang ekstrem, tapi itu **justru tujuan desainnya**: efek variasi beban media jadi terukur jelas, tidak tenggelam dalam noise.

**Yang harus dinyatakan:** penelitian ini *lab-based* dengan throttling tersimulasi, bukan pengukuran kondisi jaringan nyata (*field data*).

---

## B4. "Kenapa hanya 13 dari 20 gambar yang terunduh?"

**Jawaban singkat:** Karena 16 dari 20 kartu memakai `loading="lazy"`, dan pada viewport mobile gambar di bawah lipatan layar memang tidak diunduh. Ini perilaku yang benar, bukan kegagalan.

**Data pendukung:** angkanya **13 di seluruh 180 run tanpa kecuali** — nol variasi. Konsistensi ini sendiri membuktikan tidak ada yang terblokir secara acak.

Empat kartu pertama sengaja dibuat `loading="eager"` + `fetchPriority="high"` karena menjadi kandidat LCP. Kalau semuanya dibiarkan lazy, gambar di bawah lipatan tidak pernah diunduh dan **variasi beban media tidak akan terukur sama sekali**.

---

## B5. "Kenapa pakai Brave, bukan Google Chrome?"

**Jawaban singkat:** Brave berbasis Chromium — mesin render (Blink) dan engine JavaScript (V8)-nya identik dengan Chrome. Lighthouse mengukur lewat DevTools Protocol yang sama.

**Data pendukung:** aplikasi uji tidak memuat resource pihak ketiga sama sekali — seluruh JavaScript dan gambar berasal dari domain sendiri — sehingga fitur pemblokiran bawaan Brave tidak punya sasaran. Diverifikasi empiris: seluruh request gambar terunduh penuh pada setiap run (kolom `image_requests` konsisten 13/13).

**Catatan jujur:** user-agent melaporkan `HeadlessChrome/154.0.0.0`, jadi data CSV tidak membedakannya. Browser sebenarnya **Brave Browser 154.1.96.59** dan itu dinyatakan eksplisit di Bab 3.

---

## B6. "Gambarnya bukan foto produk asli?"

**Jawaban singkat:** Benar, gambar dihasilkan secara sintetis dan deterministik. Ini **keterbatasan yang dinyatakan**, bukan yang disembunyikan.

**Alasannya:** untuk eksperimen terkontrol, ukuran byte harus bisa dikendalikan presisi. Hasilnya 60 dari 60 gambar masuk rentang target:

| Tier | Target | Aktual |
|---|---|---|
| light | 50–150 KB | 97,2 – 103,0 KB |
| medium | 200–800 KB | 480,6 – 518,0 KB |
| heavy | 1–3 MB | 2085,5 – 2110,9 KB |

Ketiga tier berasal dari **satu gambar sumber yang sama** per produk, hanya beda resolusi dan kompresi. Kalau isinya berbeda, yang terukur bukan lagi murni ukuran byte.

Generator-nya mendukung foto asli: cukup taruh `01.jpg`..`20.jpg` di folder `media-source/`.

---

# C. Hasil & Interpretasi

## C1. "Apa temuan utama penelitian ini?"

**Beban media adalah faktor paling dominan, diikuti strategi rendering dan framework, keduanya juga signifikan.**

| Faktor terhadap LCP | p | effect size |
|---|---|---|
| Variasi beban media (RQ2) | 3,18×10⁻⁹ | **ε² = 0,884** (tertinggi) |
| Strategi rendering, framework sama (RQ1 pelengkap) | 4,09×10⁻⁷ – 1,13×10⁻⁷ | ε² = 0,65 – 0,71 |
| Framework, strategi sama (CSR-React vs CSR-Next) | 3,67×10⁻⁵ – 3,07×10⁻⁶ | ε² = 0,42 – 0,74 |

Beban media menjelaskan **sekitar 88%** variasi LCP — jauh di atas dua faktor lainnya, dan konsisten di keempat strategi (ε² = 0,884 identik pada CSR-Next, SSG-Next, SSR-Next; 0,860 pada CSR-React). Strategi rendering dan framework sama-sama terbukti berpengaruh signifikan, dengan skala pengaruh yang sebanding satu sama lain tapi keduanya di bawah pengaruh beban media.

**Implikasi praktis:** untuk e-commerce padat media, mengoptimalkan media tetap memberi dampak terbesar, tetapi pemilihan strategi rendering dan framework bukan faktor yang bisa diabaikan. Ini menjawab langsung judul penelitian sekaligus memperkaya nuansanya — bukan "media saja yang penting", melainkan "media paling penting, dan sisanya tetap bermakna".

---

## C2. "Jadi mana yang lebih baik, React atau Next.js?"

**Next.js (SSG/SSR) unggul LCP secara konsisten; React-CSR unggul responsivitas (TBT).**

**LCP rata-rata (ms):**

| Tier | CSR-React | CSR-Next | SSG-Next | SSR-Next |
|---|---|---|---|---|
| light | 9.913 | 11.251 | 8.892 | **8.961** |
| medium | 28.346 | 29.465 | **26.612** | 25.909 |
| heavy | 55.394 | 56.947 | 43.582 | **42.806** |

Urutan kecepatan LCP **konsisten di ketiga tier**: SSR-Next dan SSG-Next selalu terdepan, CSR-React di tengah, CSR-Next selalu paling lambat. Tidak ada pembalikan posisi seperti dugaan sebelumnya — pola ini jauh lebih tegas setelah throttling jaringan diperbaiki menjadi pengukuran sungguhan (lihat A14).

**TBT:** CSR-React paling rendah (0,0–137,2 ms, tergantung tier); CSR-Next, SSG-Next, SSR-Next semuanya di kisaran 32–84 ms. Ini efek framework, bukan efek strategi maupun hydration (lihat A15).

**FCP:** CSR-React paling lambat (≈1.800 ms konsisten); ketiga varian Next.js (termasuk CSR-Next) semuanya ≈1.300–1.350 ms — pola yang sama seperti TBT, menguatkan bahwa ini efek framework.

Jadi: Next.js (SSG/SSR) unggul LCP di semua kondisi, React-CSR unggul responsivitas (TBT) dan kecepatan render awal murni (FCP lebih lambat tapi TBT jauh lebih rendah). **Itulah trade-off yang dicari penelitian ini** — bukan satu pemenang mutlak, melainkan dua sumbu performa yang berlawanan arah.

---

## C3. "Kenapa CLS nol semua? Apakah pengukurannya gagal?"

**Jawaban singkat:** Tidak gagal — ini temuan.

CLS bernilai **0,00 pada seluruh 180 run**, di ketiga strategi dan ketiga tier. Penyebabnya: komponen `ProductCard` menetapkan `width={200} height={160}` pada setiap elemen `<img>`, sehingga browser memesan ruang sebelum gambar termuat dan tidak terjadi pergeseran layout.

**Kesimpulan yang bisa ditarik:** praktik menetapkan dimensi gambar secara eksplisit menghilangkan Cumulative Layout Shift **terlepas dari strategi rendering maupun beban media**. Karena variansnya nol, uji statistik tidak dapat dilakukan dan hal ini dinyatakan apa adanya.

---

## C4. "Bukankah SSG seharusnya selalu lebih cepat dari SSR?"

**Jawaban singkat:** Untuk LCP, ternyata tidak berbeda signifikan.

**Data pendukung:** uji post-hoc LCP antara SSG dan SSR menghasilkan p = 0,21 (light), 0,07 (medium), dan 0,97 (heavy) — **tidak signifikan di ketiga tier**.

Penjelasannya masuk akal: ketika beban media besar, waktu transfer gambar mendominasi total LCP, sehingga keuntungan SSG pada tahap pembuatan HTML menjadi tidak berarti. Perbedaan keduanya terlihat pada FCP, bukan LCP.

---

## C5. "Apa yang membuat penelitian ini berbeda dari penelitian sebelumnya?"

1. **Variasi beban media sebagai variabel utama**, bukan sekadar perbandingan kecepatan umum
2. **Testbed identik** — bukan membandingkan dua aplikasi berbeda, melainkan satu rancangan yang sama dengan tiga strategi rendering
3. **Pengujian pada tiga lapis**: sisi klien (Core Web Vitals), sisi server (load testing), dan kualitas kode (analisis statik)
4. **Hasil tidak dapat ditebak sebelumnya** — temuan bahwa beban media mengalahkan strategi rendering tidak diprediksi di awal

---

# D. Keterbatasan & Titik Rawan

> Bagian ini sengaja ditulis supaya kamu yang menyebutkannya lebih dulu, bukan penguji.
>
> 📄 **Daftar lengkap 13 keterbatasan beserta buktinya ada di `KETERBATASAN.md`** — itu yang dipakai saat menulis subbab Keterbatasan Penelitian.

## D0. 🔴 "Katanya menguji sampai 1000 pengguna. Mana datanya?"

**Jawaban singkat:** Hanya 100 pengguna virtual yang berhasil diukur secara sah. Pada beban lebih tinggi, mitigasi DDoS otomatis Vercel menghadang request — sehingga yang terukur adalah ambang perlindungan platform, bukan kapasitas aplikasi.

**Bukti bahwa ini bukan kegagalan arsitektur:**

1. **CSR-React ikut error 16%** padahal hanya menyajikan berkas statis dari CDN. CDN tidak mungkin tumbang pada 181 request/detik.
2. **Throughput turun justru saat error naik.** Burst 900 VU ke target sama: 605 req/s, 0% error. Ramp panjang 1000 VU: 181 req/s, 56% error. Pola ini hanya masuk akal bila ada yang menolak request.
3. Header respons: `x-vercel-mitigated: challenge`. Dashboard firewall: 100.300 request di-*challenge*.
4. Pengecualian IP hanya tersedia pada plan berbayar.

**Yang tetap terbukti pada 100 VU, nol error:** SSR 200 ms vs CSR 51 ms — **3,9× lebih berat**. Trade-off inti RQ3 terjawab.

**Jangan pernah mengatakan** "SSR gagal menangani 500 pengguna". Itu firewall, bukan arsitektur.

---

## D1. Istilah Core Web Vitals

**Core Web Vitals resmi saat ini adalah LCP, CLS, dan INP.** FCP, TBT, Speed Index, dan TTI **bukan** Core Web Vitals, melainkan metrik performa Lighthouse pendukung.

**INP tidak diukur** karena memerlukan data interaksi pengguna nyata (*field data*), sedangkan penelitian ini berbasis laboratorium. TBT dipakai sebagai **proksi** responsivitas, dan disebut sebagai proksi.

Nyatakan ini sendiri di Bab 3. Kalau penguji yang mengoreksi lebih dulu, posisimu lemah.

## D2. Lab data, bukan field data

Seluruh pengukuran memakai Lighthouse dengan throttling tersimulasi. Angka absolutnya tidak mewakili kondisi jaringan pengguna nyata. Yang valid adalah **perbandingan antar kondisi**, bukan nilai absolutnya.

## D3. "Error rate 100%" pada pilot study

Angka itu **kegagalan threshold k6** (p95 < 3 detik), **bukan server crash**. Server tetap merespons; waktu responsnya saja yang melampaui ambang.

Di laporan akhir, pisahkan dua metrik: **error rate** (persentase respons non-200) dan **SLA breach rate** (persentase respons > 3 detik). Kalau tidak dipisah, kesimpulan bisa dibantah dalam satu pertanyaan.

## D4. "Security Rating A" dari SonarQube

SonarQube menjalankan **SAST** — analisis statis terhadap source code sendiri. Ia **tidak memindai kerentanan dependency** (itu tugas **SCA**: `pnpm audit`, Snyk, Dependabot).

Jadi "Security Rating A" **tidak berarti aplikasinya aman**. Nyatakan batasan ini, dan konsisten dengan Batasan Masalah yang sudah menempatkan keamanan di luar cakupan.

## D5. Data pilot study bulan Maret tidak sebanding

Jangan mencampur angka pilot dengan data final. Yang berbeda: Next.js 15 → 16.4.3 (termasuk ganti bundler ke Turbopack), Node v22 → v26, Lighthouse 13.0.3 → 13.5.0, k6 1.6.1 → 2.3.0, localhost → Vercel sin1, dan n=1 → n=15.

Posisikan pilot study sebagai **proof-of-concept** yang membuktikan penelitian ini dapat dikerjakan — itu nilai plus, bukan kelemahan.

## D6. Variabilitas tier heavy

SD LCP mencapai 13.778 ms pada SSG heavy (mean 25.006, maks 45.237). Untuk tier heavy, **laporkan median** di samping mean, karena mean mudah tertarik oleh outlier.

---

# E. Environment yang Harus Dinyatakan di Bab 3

| Komponen | Versi |
|---|---|
| Browser host | **Brave Browser 154.1.96.59** |
| Lighthouse | 13.5.0 |
| k6 | 2.3.0 |
| Node.js | v26.0.0 |
| pnpm | 11.1.2 |
| React / React DOM | 19.2.4 (identik di kedua aplikasi) |
| Strategi yang diuji | CSR-React, CSR-Next, SSG-Next, SSR-Next |
| Next.js | 16.4.3 |
| React Router | 7.18.4 |
| Vite | 8.0.1 |
| Platform deploy | Vercel Hobby, region Singapore (`sin1`) |
| Mode Lighthouse | default — emulasi mobile + throttling tersimulasi |
| Analisis statistik | Python 3.13, numpy 2.5.4, scipy 1.18.1 |
| Jumlah run | **12 sel × 15 run = 180** |

---

**Terakhir diperbarui:** 29 Oktober 2026
