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

## Pengukuran 2: SESUDAH pindah ke 5 GHz (dicatat 2026-11-16T17:22Z)

Kondisi: Mac dan Moona di SSID 5 GHz (Mac: 802.11ac, channel 149, 80 MHz, transmit rate 390-650 Mbps;
Moona: 802.11ac, LinkSpeed berfluktuasi 87-173 Mbps selama sesi). Profil jaringan Moona diubah dari
Public ke Private agar aturan firewall berlaku. Moona tercolok charger.

| Arah | Durasi | Hasil (receiver) |
|---|---|---|
| Moona -> Mac (-R, arah respons yang dipakai k6) | 20 d | 66,8 Mbps |
| Moona -> Mac (-R) | 10 d | 47-88 Mbps per detik, rata-rata ~65 Mbps |
| Moona -> Mac (-R, 4 aliran paralel) | 10 d | 63,1 Mbps |
| Mac -> Moona | 20 d | 4,2 Mbps |
| Mac -> Moona (ulangan) | 10 d | 4,4 Mbps (stabil ~4,2 Mbps per detik, 0 retransmisi) |
| Mac -> Moona (4 aliran paralel) | 10 d | 4,4 Mbps |

Perbandingan dengan 2,4 GHz (Pengukuran 1): arah respons naik dari ~30 Mbps menjadi ~65 Mbps (sekitar 2 kali lipat).

Catatan:
- Pembatas utama adalah sambungan Wi-Fi Moona (LinkSpeed 87-173 Mbps), bukan Mac (650 Mbps).
- Arah Mac -> Moona hanya ~4 Mbps dan stabil (bukan gangguan sesaat); penyebabnya belum diketahui.
  Untuk k6 arah ini hanya membawa permintaan kecil (kebutuhan di 1000 VU <3 Mbps), jadi tidak
  menjadi pembatas, tetapi anomali ini perlu dicatat.

## Perbandingan kebutuhan dengan kapasitas arah respons (~65 Mbps)

| Kondisi | 100 VU | 500 VU | 1000 VU |
|---|---|---|---|
| CSR-React (~0,7 KB) | ~0,4 Mbps, aman | ~2 Mbps, aman | ~4 Mbps, aman |
| CSR-Next (~8 KB) | ~5 Mbps, aman | ~26 Mbps, aman | ~52 Mbps, mendekati batas |
| SSG / SSR (~49 KB) | ~31 Mbps, aman (kapasitas ~2 kali) | ~155 Mbps, melebihi batas | ~310 Mbps, melebihi batas |

(Perkiraan linear dari data Vercel 100 VU, dengan asumsi server mampu melayani semua request. Jika CPU
Moona jenuh lebih dulu, trafik nyata lebih rendah.)

Kesimpulan sementara: 100 VU layak untuk keempat kondisi pada jaringan ini. SSG dan SSR pada 500 dan
1000 VU akan dibatasi jaringan; untuk membuktikan batas server sebenarnya perlu sambungan kabel
(adaptor USB-C ke Ethernet gigabit) pada Moona.
