import type { Product } from "@/types/product";

const DEFAULT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://mark0-middleware.onrender.com"
    : "http://localhost:4000";

/**
 * Tier beban media ditentukan saat BUILD lewat env var, bukan lewat
 * query param saat runtime.
 *
 * Alasannya: halaman SSG dibekukan menjadi HTML pada tahap build,
 * sehingga query param tidak akan berpengaruh sama sekali di sana.
 * Dengan env var, CSR, SSR, dan SSG mendapat perlakuan yang simetris.
 *
 * Konsekuensi: satu build per tier (lihat LANGKAH_UPGRADE.md §7).
 */
export const MEDIA_TIER = process.env.MEDIA_TIER ?? "light";

function apiUrl(): string {
  return (
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
  );
}

export async function getProducts(cache: RequestCache): Promise<Product[]> {
  const res = await fetch(`${apiUrl()}/products?media=${MEDIA_TIER}`, {
    cache,
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
