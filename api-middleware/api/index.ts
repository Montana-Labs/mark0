import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const FAKESTORE_BASE = "https://fakestoreapi.com";

const cache = new Map<string, { data: unknown; cachedAt: number }>();
const CACHE_TTL = 1000 * 60 * 60;

async function fetchWithCache(url: string): Promise<unknown> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now - cached.cachedAt < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
  const data = await response.json();
  cache.set(url, { data, cachedAt: now });
  return data;
}

app.use(cors());
app.use(express.json());

app.get("/products", async (_req: Request, res: Response) => {
  try {
    const data = await fetchWithCache(`${FAKESTORE_BASE}/products`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await fetchWithCache(`${FAKESTORE_BASE}/products/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.get("/products/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const data = await fetchWithCache(
      `${FAKESTORE_BASE}/products/category/${category}`,
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch by category" });
  }
});

app.get("/categories", async (_req: Request, res: Response) => {
  try {
    const data = await fetchWithCache(`${FAKESTORE_BASE}/products/categories`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cacheSize: cache.size,
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
    res.status(500).json({ error: "Failed to warm up cache" });
  }
});

export default app;
