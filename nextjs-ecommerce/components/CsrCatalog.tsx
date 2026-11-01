"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types/product";

/**
 * Katalog versi Client-Side Rendering di Next.js.
 *
 * Isi komponen ini SENGAJA dibuat identik dengan
 * react-ecommerce/src/pages/Home.tsx — pola useEffect + fetch, state
 * loading, state error, dan markup yang sama persis.
 *
 * Tujuannya memisahkan dua hal yang pada desain awal bercampur:
 *   - CSR React vs CSR Next.js  -> mengukur pengaruh FRAMEWORK
 *   - CSR Next vs SSG/SSR Next  -> mengukur pengaruh STRATEGI, satu framework
 *
 * Variabel lingkungan memakai awalan NEXT_PUBLIC_ karena nilainya harus
 * tersedia di sisi klien, setara dengan VITE_ pada aplikasi React. Nilainya
 * sama-sama dibekukan ke dalam bundle pada tahap build.
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://mark0-middleware.onrender.com"
    : "http://localhost:4000");

const MEDIA_TIER = process.env.NEXT_PUBLIC_MEDIA_TIER || "light";

export default function CsrCatalog() {
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
