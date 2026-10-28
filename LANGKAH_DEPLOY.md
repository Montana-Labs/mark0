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

```bash
cd ~/Documents/Developer/skripsi/mark0/api-middleware
vercel link --yes --project mark0-middleware
vercel --prod
```

Catat URL yang keluar, lalu **verifikasi tiga hal ini sebelum lanjut**:

```bash
MW=https://mark0-middleware.vercel.app     # ganti sesuai URL asli

curl -s $MW/health | python3 -m json.tool        # harus ada mediaTiers
curl -s "$MW/products?media=heavy" | head -c 200 # image -> /media/heavy/
curl -o /dev/null -w "%{http_code} %{size_download}\n" $MW/media/heavy/img-01.jpg
```

Yang terakhir harus `200` dengan ukuran **~2,1 MB**. Kalau `404`, aset media tidak ikut ter-deploy — berhenti dan cek `git ls-files api-middleware/public/media | wc -l` (harus 60).

---

## §3 Deploy 3 varian React (CSR)

Env var disuntik langsung lewat flag, bukan lewat dashboard — supaya perintahnya **self-contained dan bisa dilampirkan di skripsi** sebagai bukti reproducibility.

```bash
cd ~/Documents/Developer/skripsi/mark0/react-ecommerce
MW=https://mark0-middleware.vercel.app

for TIER in light medium heavy; do
  vercel link --yes --project mark0-react-$TIER
  vercel --prod \
    --build-env VITE_API_URL=$MW \
    --build-env VITE_MEDIA_TIER=$TIER
done
```

Vite hanya butuh **build-env** — semuanya di-bake ke bundle.

---

## §4 Deploy 3 varian Next.js (SSG + SSR)

```bash
cd ~/Documents/Developer/skripsi/mark0/nextjs-ecommerce
MW=https://mark0-middleware.vercel.app

for TIER in light medium heavy; do
  vercel link --yes --project mark0-next-$TIER
  vercel --prod \
    --build-env API_URL=$MW --build-env MEDIA_TIER=$TIER \
    --env API_URL=$MW --env MEDIA_TIER=$TIER
done
```

**Kenapa `--build-env` DAN `--env`:**

- `/ssg` di-render saat **build** → butuh `--build-env`
- `/ssr` di-render saat **request** → butuh `--env` (runtime)

Kalau salah satu lupa dipasang, `/ssr` akan jatuh ke `DEFAULT_API_URL` yang masih menunjuk Render dan **sudah mati** → halaman error.

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
| middleware | | ⬜ |
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
