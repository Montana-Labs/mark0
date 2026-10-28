import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://mark0-middleware.onrender.com"
    : "http://localhost:4000");

/**
 * Tier beban media ditentukan saat BUILD lewat env var, bukan lewat
 * query param saat runtime.
 *
 * Alasannya: pada Next.js halaman SSG dibekukan menjadi HTML pada tahap
 * build sehingga query param tidak berpengaruh di sana. Agar CSR, SSR,
 * dan SSG mendapat perlakuan yang simetris, ketiganya sama-sama membaca
 * tier dari env var saat build.
 *
 * Konsekuensi: satu build per tier (lihat LANGKAH_UPGRADE.md §7).
 */
const MEDIA_TIER = import.meta.env.VITE_MEDIA_TIER || "light";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?media=${MEDIA_TIER}`);

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

  return <ProductGrid products={products} />;
}
