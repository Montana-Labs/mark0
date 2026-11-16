# Kapasitas jaringan Mac (klien) - Moona (server)

Pengukuran dengan iperf 3.22 (Mac: Homebrew; Moona: build Windows pihak ketiga ar51an/iperf3-win-builds).
Klien = Mac M1 (k6), server = laptop Windows "Moona" (Pentium Silver N6000, 7,75 GB RAM), lewat Wi-Fi.

## Pengukuran 1: SEBELUM pindah ke 5 GHz (dicatat 2026-11-16T17:00Z)

Kondisi: kedua mesin di Wi-Fi 2,4 GHz (Mac: 802.11n, channel 11, 20 MHz; Moona: 802.11n,
LinkSpeed 130 Mbps, berfluktuasi 58-180 Mbps selama sesi). Moona tercolok charger.

| Arah | Durasi | Rata-rata (receiver) |
|---|---|---|
| Mac -> Moona | 20 d | 27,2 Mbps |
| Moona -> Mac (-R, arah respons yang dipakai k6) | 20 d | 29,7 Mbps |

Pembanding tanpa iperf3: unduh HTTP vid-09.mp4 (21,2 MB) dari middleware Moona = 18,6-27,5 Mbps.

## Arti untuk desain pengujian k6

Perkiraan kebutuhan bandwidth dari data pengujian Vercel (k6-valid, 100 VU, ~80 req/s):

| Kondisi | Ukuran respons rata-rata | Kebutuhan di 100 VU | Dibanding batas ~30 Mbps |
|---|---|---|---|
| CSR-React | ~0,7 KB | ~0,4 Mbps | aman |
| CSR-Next | ~8 KB | ~5 Mbps | aman di 100 VU; mendekati batas di 500 VU (perkiraan ~26 Mbps) |
| SSG-Next | ~49 KB | ~31 Mbps | sudah di batas pada 100 VU |
| SSR-Next | ~49 KB | ~31 Mbps | sudah di batas pada 100 VU |

Kesimpulan sementara: pada jaringan 2,4 GHz ini, hasil SSG dan SSR di 100 VU ke atas
kemungkinan mengukur kapasitas Wi-Fi, bukan kapasitas server. Perkiraan memakai asumsi
server sanggup melayani semua request dan ukuran respons sama dengan data Vercel.

## Pengukuran 2: SESUDAH pindah ke 5 GHz / kabel

(belum dilakukan)
