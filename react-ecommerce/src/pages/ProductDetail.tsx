import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../types/product";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#6b7280" }}>
        Loading...
      </div>
    );

  if (!product) return <div>Product not found</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        ← Back to products
      </Link>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "32px",
          backgroundColor: "#ffffff",
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{ height: "280px", objectFit: "contain", width: "100%" }}
        />
        <p
          style={{
            color: "#6b7280",
            fontSize: "13px",
            textTransform: "capitalize",
            marginTop: "16px",
          }}
        >
          {product.category}
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginTop: "8px",
            lineHeight: "1.4",
          }}
        >
          {product.title}
        </h1>
        <p
          style={{
            color: "#2563eb",
            fontSize: "24px",
            fontWeight: 700,
            marginTop: "12px",
          }}
        >
          ${product.price}
        </p>
        <p
          style={{
            color: "#6b7280",
            marginTop: "16px",
            lineHeight: "1.7",
            fontSize: "15px",
          }}
        >
          {product.description}
        </p>
        <button
          style={{
            marginTop: "28px",
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
