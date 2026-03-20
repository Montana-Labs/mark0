import { Link } from "react-router-dom";
import type { Product } from "../types/product.ts";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
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
          {product.title.length > 50
            ? product.title.substring(0, 50) + "..."
            : product.title}
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
