interface Props {
  src: string;
}

/**
 * Banner video produk unggulan, ditampilkan sekali di atas katalog.
 *
 * SENGAJA dipisah dari ProductCard: logika eager/lazy pada gambar kartu
 * produk sudah terverifikasi (lihat P0-2) dan tidak boleh terganggu oleh
 * penambahan video. Dengan desain satu video per halaman -- bukan per
 * kartu -- beban video tetap terukur (preload="auto" membuat byte-nya
 * benar-benar terunduh) sementara kuota bandwidth per pengukuran tetap
 * terkendali: tier heavy menambah ~1 video, bukan 20.
 *
 * autoPlay+muted+loop dipakai karena itu satu-satunya cara browser modern
 * mengizinkan video memutar otomatis tanpa interaksi pengguna, dan ini
 * pola umum untuk banner video produk di aplikasi e-commerce.
 *
 * width/height pada elemen menjaga ruang terpesan sebelum video termuat,
 * sama seperti alasan width/height pada <img> di ProductCard (lihat 4.2.2
 * CLS pada laporan hasil).
 */
export default function VideoBanner({ src }: Props) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      width={1280}
      height={720}
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: "16 / 9",
        borderRadius: "12px",
        marginBottom: "24px",
        backgroundColor: "#e5e7eb",
        display: "block",
      }}
    />
  );
}
