import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

/**
 * Static Site Generation.
 *
 * HTML dirender sekali pada tahap build lalu disajikan sebagai konten
 * statis. Halaman ini HARUS identik dengan /ssr kecuali pada strategi
 * rendering-nya, agar perbedaan hasil pengukuran murni berasal dari
 * strategi rendering dan bukan dari perbedaan isi halaman.
 */
export const dynamic = "force-static";

export default async function SsgCatalog() {
  try {
    const products = await getProducts("force-cache");

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
