import Link from "next/link";
import type { Product } from "@/types/product";

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const text = await res.text();

  if (!text) {
    throw new Error("Empty response from API");
  }

  return JSON.parse(text) as Product;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const product = await getProduct(id);

    if (!product || typeof product.id !== "number") {
      throw new Error("Product not found");
    }

    return (
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Link
          href="/"
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#ef4444" }}>
        Error: {message}
      </div>
    );
  }
}
