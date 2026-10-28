import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

/**
 * Server-Side Rendering.
 *
 * HTML dirender ulang di server pada setiap permintaan. Halaman ini
 * HARUS identik dengan /ssg kecuali pada strategi rendering-nya, agar
 * perbedaan hasil pengukuran murni berasal dari strategi rendering dan
 * bukan dari perbedaan isi halaman.
 */
export const dynamic = "force-dynamic";

export default async function SsrCatalog() {
  try {
    const products = await getProducts("no-store");

    return <ProductGrid products={products} />;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#ef4444" }}>
        Error: {message}
      </div>
    );
  }
}
