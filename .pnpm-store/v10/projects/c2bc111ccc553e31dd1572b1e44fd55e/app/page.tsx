import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const text = await res.text();

  if (!text) {
    throw new Error("Empty response from API");
  }

  return JSON.parse(text) as Product[];
}

export default async function Home() {
  try {
    const products = await getProducts();

    return (
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
          All Products
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#ef4444" }}>
        Error: {message}
      </div>
    );
  }
}
