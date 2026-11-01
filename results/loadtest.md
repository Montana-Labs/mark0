# Hasil Load Testing (RQ3)

Tier beban media: **light** · Profil: **smoke**

> k6 hanya mengunduh dokumen HTML, tidak mengunduh gambar. Pengujian
> ini mengukur biaya generasi dokumen di sisi server, bukan pengaruh
> beban media — yang diukur terpisah melalui Lighthouse.

| Strategi | Total req | Throughput | Rata-rata | Median | p95 | Maks | Error rate | SLA breach |
|---|---|---|---|---|---|---|---|---|
| CSR-React | 527 | 15 req/s | 47 ms | 43 ms | 62 ms | 283 ms | 0.00% | 0.00% |
| CSR-Next | 525 | 15 req/s | 53 ms | 46 ms | 84 ms | 251 ms | 0.00% | 0.00% |
| SSG-Next | 516 | 15 req/s | 77 ms | 71 ms | 108 ms | 265 ms | 0.00% | 0.00% |
| SSR-Next | 486 | 14 req/s | 137 ms | 112 ms | 209 ms | 1923 ms | 0.00% | 0.00% |

**Error rate** = persentase respons berstatus bukan 200.  
**SLA breach** = persentase respons yang melebihi 3 detik.  
Keduanya sengaja dipisah: respons lambat bukan berarti server gagal.
