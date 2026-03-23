import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "mark0 - SSR/SSG",
  description: "E-commerce comparison app with SSR and SSG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          color: "#111827",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Navbar />
        <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
