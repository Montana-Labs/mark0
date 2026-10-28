# 🚀 Runbook Deploy ke Vercel (P0-4)

> **Dibuat:** 28 Oktober 2026
> **Target:** Vercel Hobby, region **Singapore (`sin1`)** sesuai kolokium §8.1.1
> **Prasyarat:** P0-1/2/3 selesai (commit `d108374`, `99becaa`)

---

## §0 Kenapa 7 project, bukan 3

Tier beban media di-*bake* saat **build** (SSG dibekukan jadi HTML; bundle Vite juga). Jadi tiap tier butuh build sendiri:

| Project Vercel | Dari folder | Tier | Yang diukur |
|---|---|---|---|
| `mark0-middleware` | `api-middleware/` | — | sumber data + aset media |
| `mark0-react-light` | `react-ecommerce/` | light | CSR |
| `mark0-react-medium` | `react-ecommerce/` | medium | CSR |
| `mark0-react-heavy` | `react-ecommerce/` | heavy | CSR |
| `mark0-next-light` | `nextjs-ecommerce/` | light | SSG `/ssg` + SSR `/ssr` |
| `mark0-next-medium` | `nextjs-ecommerce/` | medium | SSG + SSR |
| `mark0-next-heavy` | `nextjs-ecommerce/` | heavy | SSG + SSR |

**Kenapa project terpisah, bukan satu project di-deploy ulang tiap tier:**

1. URL produksi **stabil** — tidak ada risiko salah ukur tier
2. Kesembilan sel hidup **bersamaan**, bisa diukur ulang kapan saja tanpa rebuild
3. Menghindari jebakan **Deployment Protection**: deployment *preview* di Vercel default-nya dilindungi autentikasi, sehingga Lighthouse dan k6 akan kena halaman login. Deployment `--prod` tidak

---

## §1 Pasang CLI & login

```bash
pnpm add -g vercel
vercel --version
```

Login bersifat interaktif (buka browser). Jalankan lewat prefix `!` supaya outputnya masuk ke sesi ini:

```
! vercel login
```

---

## §2 Deploy middleware DULU

Semua app butuh URL-nya, jadi ini harus pertama.

> ⚠️ **JALANKAN SATU PER SATU, jangan di-paste berbarengan.**
> `vercel link`, `vercel --prod`, dan `vercel project rm` semuanya punya prompt
> interaktif yang akan **memakan baris perintah berikutnya** sebagai jawaban.
> Terbukti 28 Okt 2026: `rm -rf .vercel` ter-paste ke kolom konfirmasi
> penghapusan project.

```bash
cd ~/Documents/Developer/skripsi/mark0/api-middleware
vercel link --yes --project mark0-middleware
```
```bash
vercel --prod
```

> ⚠️ **JEBAKAN: Project Settings menimpa `vercel.json`.**
> Saat `vercel link` dijalankan, CLI membaca `vercel.json` **saat itu juga** dan
> menyimpan `buildCommand`/`outputDirectory` sebagai **Project Settings** di
> dashboard. Kalau `vercel.json` kemudian diperbaiki, setting lama **tetap
> dipakai** dan error-nya berulang persis sama.
>
> Gejalanya: log build masih menjalankan perintah lama (mis. `skip`) walaupun
> `vercel.json` sudah bersih.
>
> Dua cara memperbaiki:
> 1. **Dashboard** — Project Settings → Build & Development Settings → matikan
>    override pada Build Command dan Output Directory
> 2. **Buat ulang project** — `vercel project rm <nama>`, lalu `rm -rf .vercel`,
>    lalu `vercel link` lagi (kali ini `vercel.json` sudah benar)

### Catatan: Express berjalan native

Vercel menjalankan Express tanpa konfigurasi. **Jangan** pakai pola lama
`api/` + rewrites + `outputDirectory`. Cukup sediakan file yang memanggil
`app.listen(process.env.PORT)` di salah satu lokasi yang dicari Vercel:
`index.*`, `app.*`, `server.*`, atau `src/` dari ketiganya.

Di project ini entrypoint-nya `api-middleware/src/index.ts`.

### Catatan: build region ≠ function region

Log akan menampilkan `Running build in Washington, D.C. – iad1`. Itu **normal** —
itu region tempat build berjalan. `regions: ["sin1"]` mengatur region tempat
function melayani request, diverifikasi lewat header `x-vercel-id` (lihat §5).

Catat URL yang keluar, lalu **verifikasi tiga hal ini sebelum lanjut**:

```bash
MW=https://mark0-middleware.vercel.app     # ganti sesuai URL asli

curl -s $MW/health | python3 -m json.tool        # harus ada mediaTiers
curl -s "$MW/products?media=heavy" | head -c 200 # image -> /media/heavy/
curl -o /dev/null -w "%{http_code} %{size_download}\n" $MW/media/heavy/img-01.jpg
```

Yang terakhir harus `200` dengan ukuran **~2,1 MB**. Kalau `404`, aset media tidak ikut ter-deploy — berhenti dan cek `git ls-files api-middleware/public/media | wc -l` (harus 60).

---

## §3 ⚠️ Env var HARUS di level project, bukan flag deploy

`vercel link` **otomatis menyambungkan repo GitHub** (terlihat di output:
`Connecting GitHub repository`). Konsekuensinya berbahaya:

> Kalau tier dikirim lewat `--build-env` saja, sekali kamu `git push`, Vercel
> akan men-deploy ulang **semua** project dari git **tanpa** flag itu — dan
> ketujuh project diam-diam kembali ke tier default `light`.
> Kamu baru sadar setelah data terkumpul dan semua sel ternyata light.

Karena itu tier disimpan sebagai **Environment Variable level project**. Env var
production berlaku untuk build **dan** runtime, jadi deploy dari CLI maupun dari
git sama-sama menghasilkan tier yang benar.

Nilai middleware yang dipakai semua app:

```bash
MW=https://mark0-middleware.vercel.app
```

---

## §4 Deploy 3 varian React (CSR)

Jalankan **per tier**, satu blok per kali — jangan di-paste berbarengan karena
`vercel link` punya prompt interaktif.

```bash
cd ~/Documents/Developer/skripsi/mark0/react-ecommerce
MW=https://mark0-middleware.vercel.app
TIER=light          # ulangi dengan medium, lalu heavy

vercel link --yes --project mark0-react-$TIER
echo "$MW"  | vercel env add VITE_API_URL production
echo "$TIER" | vercel env add VITE_MEDIA_TIER production
vercel --prod
```

Vite hanya butuh env saat build — semuanya di-bake ke bundle.

---

## §4b Deploy 3 varian Next.js (SSG + SSR)

```bash
cd ~/Documents/Developer/skripsi/mark0/nextjs-ecommerce
MW=https://mark0-middleware.vercel.app
TIER=light          # ulangi dengan medium, lalu heavy

vercel link --yes --project mark0-next-$TIER
echo "$MW"   | vercel env add API_URL production
echo "$TIER" | vercel env add MEDIA_TIER production
vercel --prod
```

`/ssg` memakai env saat build, `/ssr` memakainya saat request. Env var level
project production mencakup keduanya, jadi satu kali set sudah cukup.

---

## §4c Bersihkan project lama

Ada `mark0-nextjs` dan `mark0-react` dari deploy 7 hari lalu. Keduanya berisi
kode lama (tanpa route `/ssg` `/ssr`, tanpa variasi media) dan bisa tertukar
saat pengukuran. Hapus:

```bash
vercel project rm mark0-nextjs
vercel project rm mark0-react
```

Ketik sendiri nama project saat diminta konfirmasi.

---

## §5 Verifikasi semua 9 sel

```bash
for TIER in light medium heavy; do
  echo "--- $TIER ---"
  curl -s "https://mark0-react-$TIER.vercel.app/" -o /dev/null -w "  react : %{http_code}\n"
  curl -s "https://mark0-next-$TIER.vercel.app/ssg" | grep -o "media/[a-z]*/img-01" | head -1 | sed 's/^/  ssg   : /'
  curl -s "https://mark0-next-$TIER.vercel.app/ssr" | grep -o "media/[a-z]*/img-01" | head -1 | sed 's/^/  ssr   : /'
done
```

Tiap tier **harus** menyebut tier-nya sendiri. Kalau `mark0-next-heavy/ssg` menampilkan `media/light/...`, berarti `--build-env` tidak terbaca → deploy ulang.

> ⚠️ Halaman React adalah SPA — isinya baru muncul setelah JavaScript jalan, jadi `curl` hanya bisa memastikan HTTP 200, bukan isi gambar. Verifikasi tier sisi React lewat DevTools → Network di browser.

### Cek region benar-benar sin1

```bash
curl -sI https://mark0-middleware.vercel.app/health | grep -i "x-vercel-id"
```

Harus mengandung `sin1`. Kalau muncul region lain, `regions` di `vercel.json` tidak terpakai — periksa Project Settings → Functions → Region.

---

## §6 Matikan Deployment Protection

Kalau Lighthouse atau k6 mendapat halaman login, bukan aplikasi:

**Project Settings → Deployment Protection → Vercel Authentication → Disabled**

Lakukan untuk ketujuh project. Tanpa ini pengukuran otomatis tidak bisa jalan.

---

## §7 Update target k6

Setelah semua URL ada, `load-testing/k6-nextjs.js` masih hardcode `http://localhost:3000` dan `k6-react.js` default `localhost:4173`. Keduanya harus menerima URL dari env:

```bash
k6 run -e NEXTJS_URL=https://mark0-next-light.vercel.app load-testing/k6-nextjs.js
```

> ⚠️ **Jangan masukkan aset media ke skenario k6.** `http.get()` hanya mengunduh dokumen HTML, jadi media tidak terukur di sana — tapi kalau kamu sengaja meminta file media di bawah 1000 VU, bandwidth Vercel Hobby (100 GB/bulan) bisa habis dalam satu sesi. Lihat Keputusan B di `RENCANA_REVISI.md`.

---

## §8 Checklist

- [ ] Vercel CLI terpasang, sudah login
- [ ] `mark0-middleware` ter-deploy, `/health` menampilkan `mediaTiers`
- [ ] `GET /media/heavy/img-01.jpg` → 200, ~2,1 MB
- [ ] 3 project React ter-deploy dengan `VITE_MEDIA_TIER` benar
- [ ] 3 project Next ter-deploy dengan `MEDIA_TIER` benar (build **dan** runtime)
- [ ] 9 sel terverifikasi menyebut tier masing-masing
- [ ] `x-vercel-id` mengandung `sin1`
- [ ] Deployment Protection dimatikan di 7 project
- [ ] Skenario k6 diarahkan ke URL produksi
- [ ] Semua URL dicatat di tabel untuk Bab 3

---

## §9 Tabel URL — isi sambil jalan

| Sel | URL | Terverifikasi |
|---|---|---|
| middleware | `https://mark0-middleware.vercel.app` | ✅ 28 Okt 2026 — media 3 tier https, region sin1 |
| CSR light | | ⬜ |
| CSR medium | | ⬜ |
| CSR heavy | | ⬜ |
| SSG light | `/ssg` | ⬜ |
| SSG medium | `/ssg` | ⬜ |
| SSG heavy | `/ssg` | ⬜ |
| SSR light | `/ssr` | ⬜ |
| SSR medium | `/ssr` | ⬜ |
| SSR heavy | `/ssr` | ⬜ |

---

**Terakhir diperbarui:** 28 Oktober 2026
