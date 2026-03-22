# AGENT PROMPT — Analisis & Perbaikan Project Skripsi mark0

## KONTEKS PENELITIAN

Saya adalah mahasiswa PSD/UI/UX yang sedang mengerjakan skripsi berjudul:

> **"Evaluasi Code Maintainability dan Core Web Vitals Next.js dan React Berdasarkan Strategi Rendering CSR, SSR, dan SSG pada Aplikasi E-Commerce"**

Repository: https://github.com/Montana-Labs/mark0

Penelitian membandingkan dua framework:
- `react-ecommerce` → React + Vite + TypeScript (CSR)
- `nextjs-ecommerce` → Next.js 15 + TypeScript + App Router (SSR + SSG)

---

## KERESAHAN DOSEN YANG HARUS DIJAWAB

Dosen saya memiliki beberapa keresahan teknis yang WAJIB dijawab oleh struktur kode:

### Keresahan 1 — Apple-to-Apple Architecture
Kedua aplikasi HARUS mengakses data dari sumber yang SAMA PERSIS. Saat ini keduanya langsung fetch ke FakeStoreAPI. Dosen meminta ada **shared middleware/API layer** di tengah agar beban servernya identik.

### Keresahan 2 — Subjektivitas Code Maintainability
Kode harus ditulis dengan **konvensi yang identik** di kedua project agar perbedaan hasil SonarQube mencerminkan perbedaan framework, bukan perbedaan gaya coding developer.

### Keresahan 3 — Pengukuran UI Rendering yang Akurat
Pengukuran waktu render harus sampai UI benar-benar selesai dimuat (100%), bukan hanya status 200 dari server.

### Keresahan 4 — Environment Produksi
Dosen mempertanyakan validitas pengujian di localhost. Penelitian perlu diuji di environment yang lebih realistis.

---

## TUGAS AGENT

### TUGAS 1 — ANALISIS KODE

Baca seluruh isi folder `react-ecommerce/` dan `nextjs-ecommerce/` lalu laporkan:

```
1. Apakah kedua project sudah memiliki struktur folder yang identik?
2. Apakah naming convention komponen sudah sama?
3. Apakah data fetching pattern sudah benar?
   - React: useEffect + useState (CSR) ✓
   - Next.js Home: cache: 'force-cache' (SSG) ✓
   - Next.js Product Detail: cache: 'no-store' (SSR) ✓
4. Apakah ada middleware/API layer? (seharusnya BELUM ADA)
5. Apakah ESLint config sudah identik di kedua project?
6. Apakah ada perbedaan kode yang tidak seharusnya ada?
7. Apakah ada komponen yang berbeda antara React dan Next.js padahal seharusnya sama?
```

Tampilkan hasil analisis dalam format tabel yang jelas.

---

### TUGAS 2 — BUAT SHARED MIDDLEWARE

Buat folder baru bernama `api-middleware/` di root repository dengan struktur:

```
api-middleware/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

Isi `src/index.ts`:
```typescript
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000
const FAKESTORE_BASE = 'https://fakestoreapi.com'

app.use(cors())
app.use(express.json())

// Products endpoints
app.get('/products', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${FAKESTORE_BASE}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

app.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const response = await fetch(`${FAKESTORE_BASE}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    const text = await response.text()
    if (!text) throw new Error('Empty response')
    const data = JSON.parse(text)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

app.get('/products/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const response = await fetch(`${FAKESTORE_BASE}/products/category/${category}`)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch by category' })
  }
})

app.get('/categories', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${FAKESTORE_BASE}/products/categories`)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Middleware API running on http://localhost:${PORT}`)
})
```

Isi `package.json`:
```json
{
  "name": "api-middleware",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.0.0"
  }
}
```

Setelah membuat middleware, **UPDATE semua fetch URL** di kedua project:

```
SEBELUM: https://fakestoreapi.com/products
SESUDAH: http://localhost:4000/products

SEBELUM: https://fakestoreapi.com/products/${id}
SESUDAH: http://localhost:4000/products/${id}
```

---

### TUGAS 3 — SAMAKAN ESLINT CONFIG

Buat file `.eslintrc.json` yang **IDENTIK PERSIS** di kedua project:

```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": { "jsx": true },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "no-console": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": { "version": "detect" }
  }
}
```

Install ESLint packages di kedua project:
```bash
# Di react-ecommerce
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks

# Di nextjs-ecommerce  
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks
```

---

### TUGAS 4 — SAMAKAN STRUKTUR KOMPONEN

Pastikan komponen berikut ada dan identik secara logika di KEDUA project:

| Komponen | React | Next.js | Catatan |
|---|---|---|---|
| Navbar | src/components/Navbar.tsx | components/Navbar.tsx | Link component berbeda |
| ProductCard | src/components/ProductCard.tsx | components/ProductCard.tsx | Link component berbeda |
| Home | src/pages/Home.tsx | app/page.tsx | Fetching pattern berbeda |
| ProductDetail | src/pages/ProductDetail.tsx | app/product/[id]/page.tsx | Fetching pattern berbeda |
| Cart | src/pages/Cart.tsx | app/cart/page.tsx | Identik |
| Types | src/types/product.ts | types/product.ts | HARUS identik |

**PENTING:** Yang boleh berbeda HANYA:
- Import statement (Link dari react-router-dom vs next/link)
- Data fetching pattern (useEffect vs async server component)
- File routing structure

Yang HARUS sama:
- Interface/types
- JSX structure dan styling
- Business logic
- Semua inline styles (warna, spacing, borderRadius)

---

### TUGAS 5 — TAMBAHKAN sonar-project.properties

Buat file `sonar-project.properties` di root folder masing-masing project.

**`react-ecommerce/sonar-project.properties`:**
```properties
sonar.projectKey=react-ecommerce
sonar.projectName=React E-Commerce CSR
sonar.projectVersion=1.0
sonar.sources=src
sonar.sourceEncoding=UTF-8
sonar.javascript.file.suffixes=.js,.jsx
sonar.typescript.file.suffixes=.ts,.tsx
sonar.exclusions=node_modules/**,dist/**,**/*.test.ts,**/*.spec.ts
```

**`nextjs-ecommerce/sonar-project.properties`:**
```properties
sonar.projectKey=nextjs-ecommerce
sonar.projectName=Next.js E-Commerce SSR/SSG
sonar.projectVersion=1.0
sonar.sources=app,components,types
sonar.sourceEncoding=UTF-8
sonar.javascript.file.suffixes=.js,.jsx
sonar.typescript.file.suffixes=.ts,.tsx
sonar.exclusions=node_modules/**,.next/**,**/*.test.ts,**/*.spec.ts
```

---

### TUGAS 6 — VERCEL DEPLOYMENT (Production Environment)

**Ya, Vercel adalah pilihan yang tepat untuk production.** Ini menjawab keresahan dosen soal localhost.

Buat file konfigurasi deployment untuk keduanya:

**`react-ecommerce/vercel.json`:**
```json
{
  "name": "react-ecommerce-csr",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**`nextjs-ecommerce/vercel.json`:**
```json
{
  "name": "nextjs-ecommerce-ssr",
  "framework": "nextjs"
}
```

Update semua fetch URL agar bisa dikonfigurasi via environment variable:

**`react-ecommerce/.env`:**
```
VITE_API_URL=http://localhost:4000
```

**`nextjs-ecommerce/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000
```

Update fetch di React:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
fetch(`${API_URL}/products`)
```

Update fetch di Next.js:
```typescript
const API_URL = process.env.API_URL || 'http://localhost:4000'
fetch(`${API_URL}/products`, { cache: 'force-cache' })
```

---

### TUGAS 7 — UPDATE README

Update `README.md` di root repository dengan panduan lengkap:

```markdown
# mark0 — Skripsi Research Project

## Cara Menjalankan (Development)

### 1. Jalankan Middleware dulu
cd api-middleware
pnpm install
pnpm dev
# Berjalan di http://localhost:4000

### 2. Jalankan React
cd react-ecommerce
pnpm install
pnpm dev
# Berjalan di http://localhost:5173

### 3. Jalankan Next.js
cd nextjs-ecommerce
pnpm install
pnpm dev
# Berjalan di http://localhost:3000

## Arsitektur
Browser → React (CSR) ──────┐
                             ├──→ Middleware (localhost:4000) ──→ FakeStoreAPI
Browser → Next.js (SSR/SSG) ─┘
```

---

## URUTAN PENGERJAAN

Kerjakan dalam urutan berikut — JANGAN loncat:

```
1. Analisis kode dulu (TUGAS 1)
2. Buat middleware (TUGAS 2) + update semua fetch URL
3. Samakan ESLint config (TUGAS 3)
4. Samakan komponen (TUGAS 4)
5. Tambahkan sonar-project.properties (TUGAS 5)
6. Setup Vercel config + env variables (TUGAS 6)
7. Update README (TUGAS 7)
8. Laporkan semua perubahan yang dilakukan
```

---

## OUTPUT YANG DIHARAPKAN

Setelah semua tugas selesai, berikan laporan dalam format:

```
=== LAPORAN PERUBAHAN ===

TUGAS 1 - ANALISIS:
[daftar temuan]

TUGAS 2 - MIDDLEWARE:
[file yang dibuat/diubah]

TUGAS 3 - ESLINT:
[file yang dibuat/diubah]

TUGAS 4 - KOMPONEN:
[perbedaan yang ditemukan dan diperbaiki]

TUGAS 5 - SONARQUBE:
[file yang dibuat]

TUGAS 6 - VERCEL:
[file yang dibuat, URL environment variable yang perlu diisi]

TUGAS 7 - README:
[selesai/tidak]

=== KERESAHAN DOSEN YANG SUDAH TERJAWAB ===
1. Apple-to-apple: [status]
2. Objektivitas maintainability: [status]
3. Pengukuran UI rendering: [status]
4. Environment produksi: [status]

=== YANG MASIH PERLU DILAKUKAN MANUAL ===
[daftar hal yang perlu dilakukan developer secara manual]
```

---

## CATATAN PENTING UNTUK AGENT

- Jangan ubah logika data fetching yang sudah ada (useEffect untuk React, async server component untuk Next.js)
- Jangan tambahkan library baru selain yang disebutkan di atas
- Jangan ubah tampilan UI — styling harus tetap identik
- Jangan hapus file yang sudah ada, hanya tambah atau ubah
- Middleware harus berjalan di port 4000 agar tidak bentrok dengan React (5173) dan Next.js (3000)
- Semua perubahan URL harus menggunakan environment variable, bukan hardcode
