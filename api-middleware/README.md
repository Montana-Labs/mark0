# API Middleware

Middleware API yang menjadi shared layer antara React dan Next.js aplikasi untuk mengakses FakeStoreAPI.

## Tujuan

- Memastikan kedua aplikasi mengakses data dari **sumber yang sama persis**
- Menyamakan beban server antara React (CSR) dan Next.js (SSR/SSG)
- Menjawab keresahan dosen tentang apple-to-apple comparison

## Endpoints

- `GET /products` - Dapatkan semua produk
- `GET /products/:id` - Dapatkan produk berdasarkan ID
- `GET /products/category/:category` - Dapatkan produk berdasarkan kategori
- `GET /categories` - Dapatkan semua kategori
- `GET /health` - Check status middleware

## Cara Menjalankan

```bash
# Install dependencies
pnpm install

# Development (dengan hot reload)
pnpm dev

# Build untuk production
pnpm build

# Jalankan production
pnpm start
```

Middleware akan berjalan di `http://localhost:4000`

## Catatan Penting

Middleware ini harus dijalankan **SEBELUM** React dan Next.js aplikasi, karena keduanya akan fetch data dari port 4000.
