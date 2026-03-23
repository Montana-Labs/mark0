import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCartCount } from "../utils/cart";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handleUpdate = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: 700,
          textDecoration: "none",
          color: "#111827",
          fontSize: "20px",
        }}
      >
        mark0
      </Link>
      <div style={{ marginLeft: "auto", display: "flex", gap: "24px" }}>
        <Link
          to="/"
          style={{ textDecoration: "none", color: "#374151", fontWeight: 500 }}
        >
          Home
        </Link>
        <Link
          to="/cart"
          style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Cart
          {cartCount > 0 && (
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "10px",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
