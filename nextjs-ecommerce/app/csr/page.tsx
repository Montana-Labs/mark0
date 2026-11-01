import CsrShell from "@/components/CsrShell";

/**
 * Client-Side Rendering pada Next.js.
 *
 * Halaman ini merender ProductGrid yang SAMA dengan /ssg dan /ssr.
 * Yang berbeda hanya strategi rendering-nya: di sini konten dirakit di
 * browser, bukan di server maupun pada tahap build.
 */
export default function CsrCatalogPage() {
  return <CsrShell />;
}
