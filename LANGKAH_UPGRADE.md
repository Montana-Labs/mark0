# 🧰 Runbook Upgrade & Kebersihan Cache — mark0

> **Dibuat:** 27 Oktober 2026
> **Pasangan dokumen:** `RENCANA_REVISI.md` (item P1-6)
> **Prasyarat:** kerjakan SEBELUM pengambilan data final. Upgrade di tengah jalan = semua data harus diulang.

Jalankan dari root project:

```bash
cd ~/Documents/Developer/skripsi/mark0
```

---

## §0 Dua aturan yang tidak boleh dilanggar

1. **Bersih-bersih dan upgrade SEBELUM mulai ukur.** Sekali batch pengukuran jalan, jangan sentuh dependency atau cache apa pun sampai 135 run selesai.
2. **Jangan campur hasil dari dua versi berbeda dalam satu tabel.** Kalau terpaksa upgrade di tengah jalan, buang semua data dan mulai ulang.

> ℹ️ **Kondisi awal (dicek 27 Okt 2026):** disk sudah bersih. Tidak ada `node_modules/`, `dist/`, maupun `.next/` di ketiga sub-project. `pnpm store` cuma 39 MB. Jadi "cache menumpuk" **belum** jadi masalah sekarang — runbook ini untuk menjaganya tetap begitu.

---

## §1 Pre-flight

```bash
# 1. Branch terpisah, jangan di main
git checkout -b upgrade/patch-deps-okt-2026

# 2. Catat environment SEBELUM upgrade (masuk lampiran skripsi)
{
  echo "=== Environment $(date '+%Y-%m-%d %H:%M') ==="
  echo "arch : $(uname -m)"
  echo "macOS: $(sw_vers -productVersion)"
  echo "node : $(node -v)"
  echo "pnpm : $(pnpm -v)"
} | tee ENVIRONMENT.txt

# 3. Simpan snapshot audit SEBELUM upgrade (bukti "before")
for p in api-middleware react-ecommerce nextjs-ecommerce; do
  (cd $p && pnpm audit 2>&1) > "audit-before-$p.txt"
done
```

---

## §2 Bersihkan total (clean slate)

### Yang BOLEH dihapus — semuanya regenerate sendiri

| Target | Isi | Regenerate dengan |
|---|---|---|
| `*/node_modules/` | dependency | `pnpm install` |
| `node_modules/.vite/` | cache pre-bundle Vite — **tersangka utama "kok masih versi lama?"** | `pnpm dev` |
| `nextjs-ecommerce/.next/` | build + cache Next.js | `pnpm build` |
| `react-ecommerce/dist/` | build produksi Vite | `pnpm build` |
| `api-middleware/dist/` | output `tsc` | `pnpm build` |
| `*.tsbuildinfo` | cache inkremental TS — **`tsc -b` di react-ecommerce sangat agresif meng-cache** | otomatis |
| `.scannerwork/` | working dir SonarScanner | otomatis saat scan |
| `*/.vercel/` | link project Vercel lokal | `vercel link` |
| `lighthouse-*.json` | laporan lama | run Lighthouse baru |

### Yang JANGAN dihapus

| Jangan hapus | Alasan |
|---|---|
| `pnpm-lock.yaml` | ini **bukti reproducibility** skripsimu. Boleh di-*update* lewat `pnpm add`, jangan di-*delete* |
| `api-middleware/src/data/products.json` | snapshot dataset — jantung apple-to-apple |
| `.env` / `.env.local` | isinya URL API, tidak ada di git |
| `kolokium.pdf` / `.txt` | dokumen proposal |

### Perintahnya

```bash
rm -rf api-middleware/node_modules react-ecommerce/node_modules nextjs-ecommerce/node_modules
rm -rf nextjs-ecommerce/.next react-ecommerce/dist api-middleware/dist
rm -rf .scannerwork api-middleware/.scannerwork react-ecommerce/.scannerwork nextjs-ecommerce/.scannerwork
find . -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete

# Buang paket yang sudah tidak dirujuk lockfile mana pun (AMAN)
pnpm store prune
```

> ⚠️ `rm -rf ~/Library/pnpm/store/v11` = opsi nuklir. **Hanya** kalau store korup. Konsekuensinya semua project di Mac-mu harus unduh ulang dari nol.

---

## §3 Upgrade per project

### 3.1 `nextjs-ecommerce` — ini yang paling penting

```bash
cd ~/Documents/Developer/skripsi/mark0/nextjs-ecommerce

# next 15.5.14 (3 critical) → 16.4.3
pnpm add next@16.4.3

# WAJIB ikut naik — major-nya harus cocok dengan next
pnpm add -D eslint-config-next@16.4.3

# JANGAN diupgrade: react/react-dom tetap 19.2.4 (nol advisory + variabel terkontrol)
pnpm install
pnpm audit
```

- Peer deps `next@16.4.x` menerima `react: ^19.0.0` → **19.2.4 aman, tidak ada paksaan bump React**
- `sharp` ter-patch otomatis ikut `next` (ini mitigasi CVE-2026-96889)
- `@types/node` di sini masih `^20` padahal Node-mu v26 → naikkan (lihat §4)

### 3.2 `react-ecommerce`

```bash
cd ~/Documents/Developer/skripsi/mark0/react-ecommerce

# 9 advisory (6 high) → latest
pnpm add react-router-dom@7.18.4

# dev-server only, tidak mempengaruhi hasil pengukuran — opsional
pnpm add -D vite@latest

# JANGAN: react/react-dom tetap 19.2.4
pnpm install
pnpm audit
```

### 3.3 `api-middleware`

```bash
cd ~/Documents/Developer/skripsi/mark0/api-middleware

pnpm update express
pnpm audit
```

`pnpm update express` **tidak akan** memperbaiki `proxy-addr` — Express 4.22.3 mem-pin `proxy-addr: ~2.0.7`. Sudah dikonfirmasi 27 Okt 2026. Perlu override.

> ⚠️ **Sejak pnpm 10, `overrides` HARUS di `pnpm-workspace.yaml`, bukan `package.json`.**
> Field `pnpm.overrides` di `package.json` **diabaikan diam-diam tanpa error** — gejalanya `pnpm install` bilang `Already up to date` padahal tidak terjadi apa-apa. Ini memakan waktu saat eksekusi pertama.

Buat `api-middleware/pnpm-workspace.yaml`:

```yaml
overrides:
  proxy-addr: '>=2.0.8'
  body-parser: '>=1.20.9'
  path-to-regexp: '>=0.1.13'
  qs: '>=6.16.0'
```

lalu:

```bash
pnpm install --no-frozen-lockfile
pnpm audit --prod
```

> ⚠️ **Jangan pakai `CI=true`.** Itu memaksa mode frozen-lockfile: pnpm menolak memperbarui lockfile DAN mengosongkan `node_modules`. Flag `--no-frozen-lockfile` wajib saat lockfile memang perlu berubah.

Override lebih aman daripada lompat ke Express 5 yang bisa merusak kode TS yang sudah jalan.

**Hasil (27 Okt 2026):** `proxy-addr@2.0.8`, `body-parser@1.20.9`, `path-to-regexp@0.1.13`, `qs@6.16.1` → audit bersih total.

---

## §4 Pin versi eksak + rapikan drift environment

### 4.1 Buang `^` sebelum ambil data final

`^16.4.3` artinya "16.4.3 atau lebih baru" — pnpm bisa diam-diam menaikkan versi saat install ulang, dan datamu jadi tidak reproducible. Pin eksak di ketiga `package.json`:

```json
"next": "16.4.3",
"react": "19.2.4",
"react-dom": "19.2.4",
"react-router-dom": "7.18.4"
```

### 4.2 Drift yang ketemu saat audit — harus diselaraskan

| Item | Tercatat di dokumen | Realita Mac-mu | Aksi |
|---|---|---|---|
| Node | `v22.22.1` (`HASIL_TESTING.md`) | **v26.0.0** | pilih satu, deklarasikan di Bab 3 |
| Node engines | `20.x` (`api-middleware`) | v26.0.0 | update field `engines` |
| pnpm | `10.32.1` / `10.15.1` | **11.1.2** | update `packageManager` |
| `packageManager` | hanya ada di `api-middleware` (`pnpm@10.15.1`) | — | samakan di ketiga project |
| `@types/node` | next `^20`, react `^24`, middleware `^22` | — | samakan ketiganya |

> ⚠️ **Node v26 ≠ v22.22.1 yang tercatat di pilot study.** Jadi angka pilot tidak bisa dibandingkan langsung dengan data final — satu alasan lagi me-label pilot sebagai *proof-of-concept* (P2-10). Catat versi aktual, jangan menyalin angka lama.

---

## §5 Verifikasi — jangan lewati

```bash
cd ~/Documents/Developer/skripsi/mark0

# 1. audit bersih di tiga project (simpan sebagai bukti "after")
for p in api-middleware react-ecommerce nextjs-ecommerce; do
  echo "=== $p ==="; (cd $p && pnpm audit 2>&1 | tail -3)
done

# 2. versi yang BENAR-BENAR terpasang (jangan percaya package.json, percaya lockfile)
grep -A1 "^      next:" nextjs-ecommerce/pnpm-lock.yaml
grep -A1 "^      react-router-dom:" react-ecommerce/pnpm-lock.yaml

# 3. ketiganya masih bisa build
(cd api-middleware   && pnpm build)
(cd react-ecommerce  && pnpm build)
(cd nextjs-ecommerce && pnpm build)
```

### ⚠️ Verifikasi paling kritis: SSG/SSR masih benar?

Perilaku caching Next.js berubah antar mayor version. Setelah `pnpm build` di `nextjs-ecommerce`, **baca tabel route di output**:

| Route | Harus bertanda | Arti |
|---|---|---|
| `/ssg` | `○` atau `●` | static — SSG benar |
| `/ssr` | `ƒ` | dynamic — SSR benar |

> ✅ **Sudah diverifikasi 27 Okt 2026 di Next.js 16.4.3** — sebelum route `/ssg` dan `/ssr` dibuat, struktur lama sudah membuktikan directive-nya masih bermakna:
> ```
> ┌ ○ /                 ← force-cache  → Static  ✓
> └ ƒ /product/[id]     ← no-store     → Dynamic ✓
> ```
> Jadi upgrade 15 → 16 **tidak merusak** strategi rendering. Tetap verifikasi ulang setelah `/ssg` dan `/ssr` dibuat.

> ⚠️ **Next.js 16 memakai Turbopack sebagai bundler build default** (output: `▲ Next.js 16.4.3 (Turbopack)`), menggantikan webpack di v15. Ini mengubah karakteristik bundle — satu alasan lagi data pilot study tidak sebanding dengan data final. Catat di Bab 3.

> ℹ️ Next.js 16 otomatis mengubah `tsconfig.json`: `"jsx": "preserve"` → `"jsx": "react-jsx"`. **Ini kebetulan menguntungkan** — `react-ecommerce/tsconfig.app.json` memang sudah `"react-jsx"`, jadi kedua project kini identik di setting ini.

Kalau `/ssr` ternyata static, `cache: "no-store"` tidak lagi bermakna di versi baru → tambahkan `export const dynamic = "force-dynamic"` dan build ulang.

**Screenshot tabel ini. Masukkan ke Bab 4 sebagai bukti validitas strategi rendering.**

---

## §6 Kebersihan cache rutin

| Kapan | Perintah | Kenapa |
|---|---|---|
| Habis ganti versi dependency | `rm -rf node_modules .next dist && pnpm install` | cache lama bisa menyimpan modul versi lama |
| Vite berperilaku aneh | `rm -rf node_modules/.vite` | pre-bundle cache basi |
| `tsc` melaporkan error yang sudah dibenahi | `find . -name "*.tsbuildinfo" -delete` | cache inkremental basi |
| Tiap selesai satu batch pengukuran | `pnpm store prune` | buang paket tak terpakai |
| Sebelum scan SonarQube | `rm -rf .scannerwork` | hasil scan lama bisa nyampur |
| Sebulan sekali | `pnpm store prune` | store tetap kecil (sekarang 39 MB) |

---

## §7 🔴 Aturan cache SELAMA pengukuran — paling sering bikin data rusak

### Jangan hapus `.next` di tengah 15 run

Halaman SSG di-render saat **build**. Kalau `.next` dihapus di antara run, kamu mengukur kondisi yang berbeda-beda.

**Alur yang benar per sel:**
```
build sekali  →  warmup middleware  →  15 run Lighthouse  →  baru pindah sel
```

### Warmup middleware sebelum tiap batch

```bash
curl http://<middleware>/cache/warmup
curl http://<middleware>/health      # pastikan cacheSize sudah terisi
```

Tanpa ini, run pertama mengukur cold cache dan jadi outlier.

### ⚠️ Query param TIDAK bekerja untuk SSG — ini mengubah rencana P0-3

`?media=heavy` tidak akan berpengaruh pada halaman SSG, karena HTML-nya sudah dibekukan saat build. Query param hanya jalan untuk CSR dan SSR.

Supaya ketiga strategi diperlakukan **simetris**, tier media harus ditentukan lewat **env var saat build**, bukan query param:

```bash
# Next.js — satu build per tier
MEDIA_TIER=light  pnpm build && pnpm start     # ukur /ssg dan /ssr
rm -rf .next
MEDIA_TIER=medium pnpm build && pnpm start
rm -rf .next
MEDIA_TIER=heavy  pnpm build && pnpm start

# React (Vite)
VITE_MEDIA_TIER=light pnpm build && pnpm preview
```

**Konsekuensi: 9 build terpisah, bukan 3.** Dan `rm -rf .next` **wajib** antar tier — kalau tidak, halaman SSG tier sebelumnya ikut tersaji dan datamu tercampur. Ini satu-satunya titik di mana menghapus cache di tengah eksperimen justru **wajib**.

---

## §8 Rapikan git supaya artefak tidak menumpuk di repo

### Dua file ini ter-commit padahal sudah di-`.gitignore`

`.gitignore` sudah punya `lighthouse-*.json`, tapi kedua file ini masuk git **sebelum** aturan itu ada — jadi masih terlacak:

```bash
git rm --cached nextjs-ecommerce/lighthouse-nextjs.json react-ecommerce/lighthouse-react.json
```

(Simpan dulu salinannya kalau mau dipakai sebagai arsip pilot study.)

### Tambahkan ke `.gitignore` sebelum mulai mengukur

```gitignore
# Hasil pengukuran (P1-5) — 135 file, jangan masuk git
results/
audit-before-*.txt
audit-after-*.txt
ENVIRONMENT.txt

# Aset media (P0-3) — bisa ratusan MB
api-middleware/public/media/
```

> 💡 Aset media **jangan** di-commit — 20 gambar × 3 tier + 3 video bisa >200 MB dan repo-mu jadi berat permanen. Simpan skrip generate-nya saja (dari gambar sumber), plus tabel ukuran file aktual untuk Bab 3.

---

## §9 Temuan sampingan: klaim "ESLint 100% identik" perlu diverifikasi

`.eslintrc.json` di kedua project **memang identik byte-per-byte** (sudah dicek). Tapi ada dua masalah:

1. **ESLint 9 memakai flat config (`eslint.config.js`) secara default.** Tidak ada file flat config di kedua project — hanya `.eslintrc.json` format lama. ESLint 9 tidak membacanya kecuali `ESLINT_USE_FLAT_CONFIG=false`.
2. **Plugin yang dirujuk tidak terpasang di `nextjs-ecommerce`.** Config-nya butuh `@typescript-eslint/parser`, `eslint-plugin-react`, `eslint-plugin-react-hooks` — `react-ecommerce` punya semuanya, `nextjs-ecommerce` hanya punya `eslint` + `eslint-config-next`.

Artinya config-nya identik **sebagai file**, tapi belum tentu benar-benar **dieksekusi** sama.

**Kabar baiknya:** ini **tidak** mempengaruhi angka SonarQube — SonarQube pakai analyzer sendiri, tidak membaca `.eslintrc.json`-mu. Jadi hasil maintainability tetap sah. Yang perlu diperbaiki cuma **klaim pendukungnya**.

**Yang dikerjakan:**
- [ ] Jalankan `pnpm lint` di kedua project, bandingkan output
- [ ] Kalau error/tidak jalan: migrasikan ke `eslint.config.js` yang identik, atau pasang plugin yang kurang di `nextjs-ecommerce`
- [ ] Kalau tetap tidak bisa identik: turunkan klaimnya jadi *"ESLint dipakai sebagai pemeriksaan pendukung"*, bukan bukti variabel terkontrol. SonarQube yang jadi bukti utama

---

## §10 Checklist ringkas

- [ ] Branch `upgrade/patch-deps-okt-2026` dibuat
- [ ] `ENVIRONMENT.txt` + `audit-before-*.txt` disimpan
- [ ] Clean slate (§2) dijalankan
- [ ] `next` → 16.4.3 · `eslint-config-next` → 16.4.3
- [ ] `react-router-dom` → 7.18.4
- [ ] `express` ter-patch (atau override ditambahkan)
- [ ] `react` / `react-dom` **tetap 19.2.4** ✋
- [ ] `pnpm audit` bersih di tiga project, `audit-after-*.txt` disimpan
- [ ] Versi di-pin eksak (tanpa `^`)
- [ ] Node / pnpm / `@types/node` / `engines` / `packageManager` diselaraskan
- [ ] Ketiga project berhasil `pnpm build`
- [ ] **Tabel route Next.js di-screenshot** — `/ssg` static, `/ssr` dynamic
- [ ] `git rm --cached` dua file lighthouse
- [ ] `.gitignore` ditambah `results/`, `media/`, `audit-*`
- [ ] `pnpm lint` diverifikasi di kedua project
- [ ] Commit, lalu **baru** mulai pengambilan data

---

## 📋 Catatan eksekusi — 27 Oktober 2026

§1–§5 sudah dijalankan. Hasil:

| Project | Sebelum | Sesudah (`--prod`) |
|---|---|---|
| `nextjs-ecommerce` | 3 critical, 36 high | **0 critical** (1 high: `next>postcss>source-map-js`, build-time) |
| `react-ecommerce` | 0 critical, 32 high | **bersih** |
| `api-middleware` | 1 critical | **bersih** |

Versi terpasang & ter-pin: `next@16.4.3` · `react@19.2.4` · `react-router-dom@7.18.4` · `express@4.22.3` + override.
Ketiga project `pnpm build` sukses. Bundle React: **242.42 kB (gzip 76.94 kB)** — baseline untuk dibandingkan nanti.
`packageManager` disamakan ke `pnpm@11.1.2` di tiga project (sebelumnya middleware diam-diam pakai 10.15.1 via Corepack).

**Sisa:** commit, lalu lanjut P0-1/2/3.

---

**Terakhir diperbarui:** 27 Oktober 2026
