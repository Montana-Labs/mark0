import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

/**
 * Jumlah kartu pertama yang dimuat eager (bukan lazy).
 *
 * Kandidat Largest Contentful Paint berada di baris pertama grid.
 * Nilai ini WAJIB sama di React dan Next.js karena merupakan
 * variabel terkontrol, bukan optimasi sepihak pada salah satu sisi.
 */
export const EAGER_CARDS = 4;

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
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
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < EAGER_CARDS}
          />
        ))}
      </div>
    </div>
  );
}
