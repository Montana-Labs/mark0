import Link from "next/link";

export default function Navbar() {
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
        href="/"
        style={{
          fontWeight: 700,
          textDecoration: "none",
          color: "#111827",
          fontSize: "20px",
        }}
      >
        ShopNext
      </Link>
      <div style={{ marginLeft: "auto", display: "flex", gap: "24px" }}>
        <Link
          href="/"
          style={{ textDecoration: "none", color: "#374151", fontWeight: 500 }}
        >
          Home
        </Link>
        <Link
          href="/cart"
          style={{ textDecoration: "none", color: "#374151", fontWeight: 500 }}
        >
          Cart
        </Link>
      </div>
    </nav>
  );
}
