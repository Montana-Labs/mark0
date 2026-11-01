"use client";

import dynamic from "next/dynamic";

/**
 * Pembungkus yang mematikan rendering di sisi server.
 *
 * ssr: false membuat komponen katalog TIDAK ikut di-prerender, sehingga
 * HTML yang dikirim server berisi shell kosong dan seluruh konten dirakit
 * oleh JavaScript di browser — perilaku Client-Side Rendering yang sama
 * dengan aplikasi React + Vite.
 *
 * next/dynamic dengan ssr: false hanya boleh dipanggil dari Client
 * Component, karena itu file ini ada dan ditandai "use client".
 */
const CsrCatalog = dynamic(() => import("@/components/CsrCatalog"), {
  ssr: false,
  loading: () => null,
});

export default function CsrShell() {
  return <CsrCatalog />;
}
