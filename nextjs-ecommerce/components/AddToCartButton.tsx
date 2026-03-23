"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { addToCart } from "@/utils/cart";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      style={{
        marginTop: "28px",
        width: "100%",
        backgroundColor: added ? "#16a34a" : "#2563eb",
        color: "white",
        padding: "14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
