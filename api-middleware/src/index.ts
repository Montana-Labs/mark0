import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 4000;
const FAKESTORE_BASE = "https://fakestoreapi.com";

app.use(cors());
app.use(express.json());

// Products endpoints
app.get("/products", async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${FAKESTORE_BASE}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${FAKESTORE_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    const text = await response.text();
    if (!text) throw new Error("Empty response");
    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.get("/products/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const response = await fetch(
      `${FAKESTORE_BASE}/products/category/${category}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch by category" });
  }
});

app.get("/categories", async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${FAKESTORE_BASE}/products/categories`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Middleware API running on http://localhost:${PORT}`);
});
