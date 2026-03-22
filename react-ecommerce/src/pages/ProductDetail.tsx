import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!id) {
        if (isMounted) {
          setError("Product ID is invalid");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`${API_URL}/products/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data: Product = await res.json();

        if (isMounted) {
          setProduct(data);
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

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#6b7280" }}>
        Product not found
      </div>
    );
  }

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
        {"< Back to products"}
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
          width={280}
          height={280}
          loading="eager"
          decoding="async"
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
          type="button"
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
