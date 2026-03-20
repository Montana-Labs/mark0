import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ShopNext - SSR/SSG",
  description: "E-commerce built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#f9fafb" }}>
        <Navbar />
        <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
