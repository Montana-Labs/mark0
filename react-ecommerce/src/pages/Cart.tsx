export default function Cart() {
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
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Your cart is empty.
        </p>
      </div>
    </div>
  );
}
