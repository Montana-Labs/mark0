"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, removeFromCart, updateQuantity } from "@/utils/cart";
import type { CartItem } from "@/utils/cart";

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
    const handleUpdate = () => setCart(getCart());
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
          Your Cart
        </h1>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "32px",
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "16px" }}>
            Your cart is empty
          </p>
          <Link
            href="/"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
        Your Cart
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {cart.map((item) => (
          <div
            key={item.product.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
              backgroundColor: "#ffffff",
            }}
          >
            <img
              src={item.product.image}
              alt={item.product.title}
              width={80}
              height={80}
              style={{ height: "80px", width: "80px", objectFit: "contain" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "14px", lineHeight: "1.4" }}>
                {item.product.title.length > 60
                  ? `${item.product.title.slice(0, 60)}...`
                  : item.product.title}
              </p>
              <p style={{ color: "#2563eb", fontWeight: 700, marginTop: "4px" }}>
                ${item.product.price}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                -
              </button>
              <span style={{ fontWeight: 600, minWidth: "20px", textAlign: "center" }}>
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeFromCart(item.product.id)}
              style={{
                color: "#ef4444",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "24px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: 700 }}>Total</span>
        <span style={{ fontSize: "24px", fontWeight: 700, color: "#2563eb" }}>
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
