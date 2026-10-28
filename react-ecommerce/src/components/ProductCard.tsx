import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface Props {
  product: Product;
  /**
   * Kartu yang berada di atas lipatan layar (above the fold).
   * Gambarnya dimuat eager + prioritas tinggi karena menjadi kandidat
   * Largest Contentful Paint. Kalau semua gambar dibiarkan lazy, gambar
   * di bawah lipatan tidak pernah diunduh saat pengujian, sehingga
   * variasi beban media tidak terukur.
   */
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const title =
    product.title.length > 50
      ? `${product.title.slice(0, 50)}...`
      : product.title;

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          cursor: "pointer",
          backgroundColor: "#ffffff",
          height: "100%",
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          width={200}
          height={160}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={{ height: "160px", objectFit: "contain", width: "100%" }}
        />
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 600,
            marginTop: "12px",
            lineHeight: "1.4",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: "#2563eb",
            fontWeight: 700,
            marginTop: "8px",
            fontSize: "16px",
          }}
        >
          ${product.price}
        </p>
        <p
          style={{
            color: "#6b7280",
            fontSize: "12px",
            marginTop: "4px",
            textTransform: "capitalize",
          }}
        >
          {product.category}
        </p>
      </div>
    </Link>
  );
}
