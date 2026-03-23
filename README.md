# mark0 — Skripsi Research Project

**Evaluasi Code Maintainability dan Core Web Vitals Next.js dan React Berdasarkan Strategi Rendering CSR, SSR, dan SSG pada Aplikasi E-Commerce**

Repository: https://github.com/Montana-Labs/mark0

---

## 📋 Project Overview

Penelitian ini membandingkan dua framework berbeda dalam mengembangkan aplikasi e-commerce yang identik:

| Aspek      | React - CSR                 | Next.js - SSR/SSG                                          |
| ---------- | --------------------------- | ---------------------------------------------------------- |
| Framework  | React 19.2 + Vite           | Next.js 15 + App Router                                    |
| Rendering  | Client-Side Rendering (CSR) | Server-Side Rendering (SSR) + Static Site Generation (SSG) |
| Routing    | React Router v7             | Next.js Built-in Router                                    |
| Styling    | Inline Styles               | Inline Styles                                              |
| Build Tool | Vite                        | Next.js Built-in                                           |

---

## 🚀 Cara Menjalankan (Development)

### Prasyarat

- Node.js >= 18.x
- pnpm (recommended) atau npm

### Step 1: Clone Repository

```bash
git clone https://github.com/Montana-Labs/mark0.git
cd mark0
```

### Step 2: Setup Environment Variables

Salin file `.env.example` menjadi file `.env` di masing-masing project:

```bash
# React
cp react-ecommerce/.env.example react-ecommerce/.env

# Next.js
cp nextjs-ecommerce/.env.example nextjs-ecommerce/.env.local
```

### Step 3: Install Dependencies

```bash
# API Middleware
cd api-middleware
pnpm install

# React (di terminal baru)
cd react-ecommerce
pnpm install

# Next.js (di terminal baru)
cd nextjs-ecommerce
pnpm install
```

### Step 4: Jalankan API Middleware Terlebih Dahulu

Middleware API **harus jalan duluan** karena kedua aplikasi fetch data dari sini.

```bash
cd api-middleware
pnpm dev
```

Output yang diharapkan:

```
Middleware API running on http://localhost:4000
```

Verifikasi: buka http://localhost:4000/health di browser, harus muncul `{"status":"ok",...}`

### Step 5: Jalankan React (CSR) di Terminal Baru

```bash
cd react-ecommerce
pnpm dev
```

Akses di: http://localhost:5173

### Step 6: Jalankan Next.js (SSR/SSG) di Terminal Baru

```bash
cd nextjs-ecommerce
pnpm dev
```

Akses di: http://localhost:3000

---

## 📐 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Client                        │
│  [React App (CSR)]          [Next.js App (SSR/SSG)]         │
│   http://localhost:5173       http://localhost:3000         │
└─────────────────┬─────────────────────────────────┬─────────┘
                  │                                 │
                  └────────────┬────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  API Middleware     │
                    │  Port: 4000         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼─────────────────┐
                    │   FakeStoreAPI             │
                    │   https://fakestoreapi.com │
                    └────────────────────────────┘
```

**Keuntungan Arsitektur Ini:**

- ✅ Sumber data identik untuk kedua aplikasi (apple-to-apple comparison)
- ✅ Beban server yang sama ingin diukur
- ✅ Middleware dapat dikonfigurasi untuk production environment
- ✅ Mudah untuk monitoring dan caching

---

## 🔧 Struktur Project

```
mark0/
├── api-middleware/              # Shared API layer
│   ├── src/
│   │   └── index.ts            # Express server (port 4000)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── react-ecommerce/            # React + Vite (CSR)
│   ├── src/
│   │   ├── components/         # Reusable components (Navbar, ProductCard)
│   │   ├── pages/              # Page components (Home, ProductDetail, Cart)
│   │   ├── types/              # TypeScript types (Product interface)
│   │   ├── App.tsx             # Root component + routing
│   │   └── main.tsx            # Entry point + CSS reset
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .eslintrc.json          # ESLint config (identik dengan Next.js)
│   ├── sonar-project.properties
│   ├── vercel.json             # Vercel deployment config
│   ├── .env.example            # Template environment variables
│   └── README.md
│
├── nextjs-ecommerce/           # Next.js 15 (SSR/SSG)
│   ├── app/                    # App Router
│   │   ├── page.tsx            # Home page (SSG - cache: force-cache)
│   │   ├── product/[id]/       # Product detail (SSR - cache: no-store)
│   │   ├── cart/               # Cart page
│   │   ├── layout.tsx          # Root layout + Navbar
│   │   ├── loading.tsx         # Loading fallback
│   │   └── globals.css         # CSS reset
│   ├── components/             # Reusable components (Navbar, ProductCard)
│   ├── types/                  # TypeScript types (Product interface)
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── .eslintrc.json          # ESLint config (identik dengan React)
│   ├── sonar-project.properties
│   ├── vercel.json             # Vercel deployment config
│   ├── .env.example            # Template environment variables
│   └── README.md
│
├── .gitignore                  # Root gitignore
├── AGENT_PROMPT.md             # Instruksi lengkap penelitian
└── README.md                   # File ini
```

---

## 📊 Pengukuran & Metrik

### SonarQube Code Quality Analysis

Jalankan analisis kualitas kode dengan SonarQube:

```bash
# Pastikan SonarQube berjalan di http://localhost:9000

# React
cd react-ecommerce
sonar-scanner \
  -Dsonar.projectKey=react-ecommerce \
  -Dsonar.host.url=http://localhost:9000

# Next.js
cd nextjs-ecommerce
sonar-scanner \
  -Dsonar.projectKey=nextjs-ecommerce \
  -Dsonar.host.url=http://localhost:9000
```

### Lighthouse Performance Analysis

Kedua project sudah memiliki laporan Lighthouse:

- `react-ecommerce/lighthouse-react.json`
- `nextjs-ecommerce/lighthouse-nextjs.json`

Jalankan ulang:

```bash
# Install lighthouse
pnpm add -g lighthouse

# React (pastikan running di http://localhost:5173)
lighthouse http://localhost:5173 --output-path=react-ecommerce/lighthouse-react.json

# Next.js (pastikan running di http://localhost:3000)
lighthouse http://localhost:3000 --output-path=nextjs-ecommerce/lighthouse-nextjs.json
```

---

## 🔐 Environment Variables

File `.env` tidak di-push ke repository. Gunakan `.env.example` sebagai template.

### React (`react-ecommerce/.env`)

```env
VITE_API_URL=http://localhost:4000
```

### Next.js (`nextjs-ecommerce/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000
```

### Production (Vercel)

Set environment variables di Vercel dashboard:

```env
# React
VITE_API_URL=https://your-middleware-url.com

# Next.js
NEXT_PUBLIC_API_URL=https://your-middleware-url.com
API_URL=https://your-middleware-url.com
```

---

## 🛠 Development Workflow

### ESLint & Code Quality

Kedua project menggunakan `.eslintrc.json` yang identik:

```bash
# React
cd react-ecommerce
pnpm lint

# Next.js
cd nextjs-ecommerce
pnpm lint
```

### Build untuk Production

```bash
# React
cd react-ecommerce
pnpm build
pnpm preview

# Next.js
cd nextjs-ecommerce
pnpm build
pnpm start
```

---

## 📈 Vercel Deployment

Kedua aplikasi dapat di-deploy ke Vercel dengan konfigurasi `vercel.json` yang sudah tersedia.

### Deploy React ke Vercel

```bash
cd react-ecommerce
pnpm add -g vercel
vercel
```

### Deploy Next.js ke Vercel

```bash
cd nextjs-ecommerce
vercel
```

---

## 🔍 Perbedaan Rendering Pattern

### React (Client-Side Rendering)

```typescript
// react-ecommerce/src/pages/Home.tsx
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return <div>{products.map(...)}</div>;
}
```

**Karakteristik:**

- Data fetching terjadi di **client browser**
- Initial HTML kosong, diisi setelah JavaScript dijalankan
- Interaktif cepat setelah critical JavaScript diload
- Core Web Vitals: LCP lebih tinggi

### Next.js (Server-Side + Static)

```typescript
// nextjs-ecommerce/app/page.tsx
async function getProducts(): Promise<Product[]> {
  const API_URL = process.env.API_URL || "http://localhost:4000";
  const res = await fetch(`${API_URL}/products`, {
    cache: "force-cache", // SSG: static cache
  });
  return res.json();
}

export default async function Home() {
  const products = await getProducts();
  return <div>{products.map(...)}</div>;
}
```

**Karakteristik:**

- Home page: Static Site Generation (SSG) - cache: "force-cache"
- Product Detail: Server-Side Rendering (SSR) - cache: "no-store"
- HTML sudah siap dengan data saat di-serve
- First Contentful Paint (FCP) lebih cepat
- Core Web Vitals: LCP lebih rendah

---

## 📋 Checklist Research

- [x] Setup identik di kedua project
- [x] Shared API middleware
- [x] ESLint config identik
- [x] Environment variables configured
- [x] Vercel deployment ready
- [ ] Run SonarQube analysis
- [ ] Run Lighthouse analysis
- [ ] Document findings
- [ ] Compare metrics

---

## 📚 Referensi

- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [FakeStoreAPI](https://fakestoreapi.com)
- [Web Vitals](https://web.dev/vitals/)
- [SonarQube](https://www.sonarqube.org/)

---

## 📝 License

Skripsi - Universitas

---

**Last Updated:** March 23, 2026

Untuk pertanyaan atau issue, silakan buat issue di GitHub repository.
