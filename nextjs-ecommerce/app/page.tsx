import Link from "next/link";
import { MEDIA_TIER } from "@/lib/products";

/**
 * Halaman indeks.
 *
 * Katalog produk sengaja TIDAK dirender di sini, melainkan di dua route
 * terpisah yang isinya identik: /ssg dan /ssr. Pemisahan ini diperlukan
 * agar SSG dan SSR dapat diukur pada halaman yang sama persis, sehingga
 * perbedaan hasil pengukuran murni berasal dari strategi rendering.
 */
const linkStyle = {
  display: "block",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
  textDecoration: "none",
  color: "inherit",
  backgroundColor: "#ffffff",
};

export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
        Testbed Strategi Rendering
      </h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
        Tier beban media aktif: <strong>{MEDIA_TIER}</strong>
      </p>

      <Link href="/ssg" style={linkStyle}>
        <strong style={{ fontSize: "16px" }}>/ssg</strong>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
          Static Site Generation — HTML dibekukan pada tahap build
        </p>
      </Link>

      <Link href="/ssr" style={linkStyle}>
        <strong style={{ fontSize: "16px" }}>/ssr</strong>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
          Server-Side Rendering — dirender ulang di setiap permintaan
        </p>
      </Link>
    </div>
  );
}
