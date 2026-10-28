// ============================================================
// Express app — SATU sumber kebenaran untuk dev maupun produksi.
//
// File ini TIDAK memanggil app.listen(). Bootstrap-nya dipisah:
//   - src/index.ts  -> menjalankan server lokal (pnpm dev / pnpm start)
//   - api/index.ts  -> entry serverless function di Vercel
//
// Sebelumnya api/index.ts adalah salinan terpisah yang sudah basi,
// sehingga perilaku produksi berbeda dari perilaku lokal. Itu merusak
// premis "lingkungan pengujian terkontrol" dan sudah diperbaiki.
// ============================================================

import path from "path";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import fallbackProducts from "./data/products.json";

const app: Express = express();
const FAKESTORE_BASE = "https://fakestoreapi.com";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const SNAPSHOT_PRODUCTS = fallbackProducts as Product[];
const SNAPSHOT_CATEGORIES = [...new Set(SNAPSHOT_PRODUCTS.map((product) => product.category))];

// ============================================================
// Variasi Beban Media
// Variabel utama penelitian. Gambar produk di-host sendiri dalam
// tiga tingkat beban sehingga ukurannya terkontrol penuh, bukan
// mengikuti ukuran acak dari sumber pihak ketiga.
//
// light  :  50-150 KB
// medium : 200-800 KB
// heavy  : 1-3 MB
//
// Tier dipilih lewat query ?media=<tier>. Aplikasi klien membaca
// tier dari env var saat build (MEDIA_TIER / VITE_MEDIA_TIER) agar
// CSR, SSR, dan SSG mendapat perlakuan yang simetris.
// ============================================================
const MEDIA_TIERS = ["light", "medium", "heavy"] as const;
type MediaTier = (typeof MEDIA_TIERS)[number];
const DEFAULT_MEDIA_TIER: MediaTier = "light";

function resolveTier(raw: unknown): MediaTier {
  return MEDIA_TIERS.includes(raw as MediaTier)
    ? (raw as MediaTier)
    : DEFAULT_MEDIA_TIER;
}

function mediaBaseUrl(req: Request): string {
  return process.env.PUBLIC_BASE_URL ?? `${req.protocol}://${req.get("host")}`;
}

function mediaUrl(productId: number, tier: MediaTier, base: string): string {
  return `${base}/media/${tier}/img-${String(productId).padStart(2, "0")}.jpg`;
}

function applyTier(data: unknown, tier: MediaTier, base: string): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => applyTier(item, tier, base));
  }

  if (data && typeof data === "object" && "id" in data && "image" in data) {
    const product = data as Product;
    return { ...product, image: mediaUrl(product.id, tier, base) };
  }

  return data;
}

// ============================================================
// In-Memory Cache
// Menjamin data konsisten di setiap request (menjawab keresahan
// dosen tentang kontrol database state). Setelah fetch pertama
// dari FakeStoreAPI, data disimpan di memory. Request berikutnya
// tidak bergantung pada kondisi server FakeStoreAPI.
// ============================================================
const cache = new Map<string, { data: unknown; cachedAt: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 jam

function getSnapshotData(url: string): { matched: boolean; data: unknown } {
  if (url === `${FAKESTORE_BASE}/products`) {
    return { matched: true, data: SNAPSHOT_PRODUCTS };
  }

  if (url === `${FAKESTORE_BASE}/products/categories`) {
    return { matched: true, data: SNAPSHOT_CATEGORIES };
  }

  const productIdMatch = url.match(/\/products\/(\d+)$/);
  if (productIdMatch) {
    const productId = Number(productIdMatch[1]);
    const product = SNAPSHOT_PRODUCTS.find((item) => item.id === productId) ?? null;
    return { matched: true, data: product };
  }

  const categoryMatch = url.match(/\/products\/category\/(.+)$/);
  if (categoryMatch) {
    const category = decodeURIComponent(categoryMatch[1]);
    const products = SNAPSHOT_PRODUCTS.filter((item) => item.category === category);
    return { matched: true, data: products };
  }

  return { matched: false, data: null };
}

async function fetchWithCache(url: string): Promise<unknown> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now - cached.cachedAt < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "mark0-middleware/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${url} (status: ${response.status})`);
    }

    const data = (await response.json()) as unknown;
    cache.set(url, { data, cachedAt: now });
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const snapshot = getSnapshotData(url);

    if (snapshot.matched) {
      console.warn(`Using snapshot fallback for ${url}: ${message}`);
      cache.set(url, { data: snapshot.data, cachedAt: now });
      return snapshot.data;
    }

    throw error;
  }
}

app.use(cors());
app.use(express.json());

// Aset media di-host sendiri supaya ukuran byte terkontrol penuh
app.use(express.static(path.join(__dirname, "..", "public"), {
  maxAge: "1h",
}));

// Products endpoints
app.get("/products", async (_req: Request, res: Response) => {
  try {
    const data = await fetchWithCache(`${FAKESTORE_BASE}/products`);
    const tier = resolveTier(_req.query.media);
    res.json(applyTier(data, tier, mediaBaseUrl(_req)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch products:", message);
    res.status(500).json({ error: "Failed to fetch products", detail: message });
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await fetchWithCache(`${FAKESTORE_BASE}/products/${id}`);

    if (!data || typeof data !== "object" || !("id" in data)) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const tier = resolveTier(req.query.media);
    res.json(applyTier(data, tier, mediaBaseUrl(req)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch product ${req.params.id}:`, message);
    res.status(500).json({ error: "Failed to fetch product", detail: message });
  }
});

app.get("/products/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const data = await fetchWithCache(
      `${FAKESTORE_BASE}/products/category/${category}`,
    );
    const tier = resolveTier(req.query.media);
    res.json(applyTier(data, tier, mediaBaseUrl(req)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch category ${req.params.category}:`, message);
    res.status(500).json({ error: "Failed to fetch by category", detail: message });
  }
});

app.get("/categories", async (_req: Request, res: Response) => {
  try {
    const data = await fetchWithCache(`${FAKESTORE_BASE}/products/categories`);
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch categories:", message);
    res.status(500).json({ error: "Failed to fetch categories", detail: message });
  }
});

// Cache management endpoints
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cacheSize: cache.size,
    snapshotProducts: SNAPSHOT_PRODUCTS.length,
    mediaTiers: MEDIA_TIERS,
    defaultMediaTier: DEFAULT_MEDIA_TIER,
  });
});

app.post("/cache/clear", (_req: Request, res: Response) => {
  cache.clear();
  res.json({ message: "Cache cleared", timestamp: new Date().toISOString() });
});

app.get("/cache/warmup", async (_req: Request, res: Response) => {
  try {
    await fetchWithCache(`${FAKESTORE_BASE}/products`);
    await fetchWithCache(`${FAKESTORE_BASE}/products/categories`);
    for (let id = 1; id <= 20; id++) {
      await fetchWithCache(`${FAKESTORE_BASE}/products/${id}`);
    }
    res.json({
      message: "Cache warmed up",
      cacheSize: cache.size,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to warm up cache:", message);
    res.status(500).json({ error: "Failed to warm up cache", detail: message });
  }
});

export { CACHE_TTL };
export default app;
