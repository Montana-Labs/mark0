import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://mark0-middleware.onrender.com"
    : "http://localhost:4000");

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await res.json();

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#6b7280" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#ef4444" }}>
        Error: {error}
      </div>
    );
  }

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
}
