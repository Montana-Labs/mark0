# Hasil Analisis Statistik — mark0

Sumber: `results/metrics.csv` (180 run)
Taraf signifikansi: alpha = 0.05

## 1. Statistik Deskriptif

### LCP (ms)  _(Core Web Vitals)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 9912.51 | 265.68 | 9791.18 | 10864.74 | 9841.14 |
| CSR-React | medium | 15 | 28346.16 | 643.26 | 27537.62 | 29482.90 | 27960.92 |
| CSR-React | heavy | 15 | 55393.72 | 1180.82 | 51482.49 | 57155.99 | 55607.33 |
| CSR-Next | light | 15 | 11250.57 | 396.21 | 10994.61 | 12478.18 | 11041.33 |
| CSR-Next | medium | 15 | 29464.86 | 643.62 | 29027.38 | 31362.25 | 29207.12 |
| CSR-Next | heavy | 15 | 56946.94 | 233.57 | 56707.87 | 57605.43 | 56922.65 |
| SSG-Next | light | 15 | 8891.95 | 95.11 | 8845.44 | 9231.35 | 8869.27 |
| SSG-Next | medium | 15 | 26611.84 | 75.75 | 26501.77 | 26840.19 | 26612.87 |
| SSG-Next | heavy | 15 | 43581.93 | 72.41 | 43499.22 | 43691.36 | 43544.26 |
| SSR-Next | light | 15 | 8961.36 | 206.09 | 8847.12 | 9445.38 | 8869.06 |
| SSR-Next | medium | 15 | 25908.65 | 2750.44 | 15997.98 | 26985.00 | 26614.82 |
| SSR-Next | heavy | 15 | 42806.38 | 2786.13 | 32743.69 | 43872.10 | 43508.56 |

### CLS  _(Core Web Vitals)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-Next | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-Next | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-Next | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSR-Next | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSR-Next | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSR-Next | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

### FCP (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 1818.16 | 23.84 | 1793.42 | 1896.45 | 1814.34 |
| CSR-React | medium | 15 | 1824.69 | 36.45 | 1796.10 | 1948.39 | 1817.31 |
| CSR-React | heavy | 15 | 1808.56 | 17.95 | 1757.18 | 1837.71 | 1808.30 |
| CSR-Next | light | 15 | 1336.78 | 29.57 | 1302.63 | 1435.84 | 1334.34 |
| CSR-Next | medium | 15 | 1441.88 | 341.44 | 1318.26 | 2618.53 | 1330.46 |
| CSR-Next | heavy | 15 | 1349.78 | 50.53 | 1305.24 | 1477.17 | 1332.09 |
| SSG-Next | light | 15 | 1289.87 | 16.47 | 1273.64 | 1333.47 | 1285.33 |
| SSG-Next | medium | 15 | 1311.66 | 18.60 | 1271.83 | 1337.16 | 1312.06 |
| SSG-Next | heavy | 15 | 1328.80 | 35.15 | 1290.52 | 1421.12 | 1316.89 |
| SSR-Next | light | 15 | 1329.86 | 95.82 | 1272.72 | 1590.38 | 1299.99 |
| SSR-Next | medium | 15 | 1329.80 | 73.10 | 1277.19 | 1510.23 | 1309.40 |
| SSR-Next | heavy | 15 | 1355.50 | 96.23 | 1301.38 | 1603.63 | 1317.75 |

### TBT (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | medium | 15 | 4.99 | 19.34 | 0.00 | 74.92 | 0.00 |
| CSR-React | heavy | 15 | 137.24 | 286.18 | 0.00 | 830.83 | 4.29 |
| CSR-Next | light | 15 | 83.33 | 2.19 | 77.66 | 86.48 | 83.62 |
| CSR-Next | medium | 15 | 82.64 | 2.35 | 77.63 | 87.01 | 82.83 |
| CSR-Next | heavy | 15 | 83.27 | 7.81 | 77.29 | 109.60 | 80.99 |
| SSG-Next | light | 15 | 32.35 | 3.41 | 29.71 | 43.93 | 31.43 |
| SSG-Next | medium | 15 | 69.56 | 22.34 | 29.32 | 85.54 | 80.85 |
| SSG-Next | heavy | 15 | 83.68 | 32.58 | 34.08 | 169.36 | 84.68 |
| SSR-Next | light | 15 | 34.66 | 3.97 | 30.57 | 40.38 | 32.21 |
| SSR-Next | medium | 15 | 57.72 | 25.58 | 29.62 | 82.72 | 79.43 |
| SSR-Next | heavy | 15 | 82.85 | 3.33 | 78.85 | 89.78 | 81.71 |

### Speed Index (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 7271.00 | 253.36 | 7168.00 | 8180.00 | 7203.00 |
| CSR-React | medium | 15 | 18972.93 | 625.72 | 18211.00 | 20095.00 | 18584.00 |
| CSR-React | heavy | 15 | 38346.00 | 746.52 | 36412.00 | 40026.00 | 38438.00 |
| CSR-Next | light | 15 | 8534.33 | 383.38 | 8278.00 | 9722.00 | 8334.00 |
| CSR-Next | medium | 15 | 20026.93 | 629.03 | 19583.00 | 21891.00 | 19773.00 |
| CSR-Next | heavy | 15 | 39727.60 | 192.44 | 39377.00 | 40093.00 | 39755.00 |
| SSG-Next | light | 15 | 6177.60 | 89.82 | 6130.00 | 6498.00 | 6155.00 |
| SSG-Next | medium | 15 | 17242.20 | 67.90 | 17170.00 | 17450.00 | 17236.00 |
| SSG-Next | heavy | 15 | 5537.53 | 50.18 | 5430.00 | 5650.00 | 5535.00 |
| SSR-Next | light | 15 | 6244.40 | 196.76 | 6141.00 | 6757.00 | 6158.00 |
| SSR-Next | medium | 15 | 16876.93 | 1444.71 | 11686.00 | 17565.00 | 17215.00 |
| SSR-Next | heavy | 15 | 6809.33 | 4944.11 | 5459.00 | 24679.00 | 5520.00 |

### TTI (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 1818.16 | 23.84 | 1793.42 | 1896.45 | 1814.34 |
| CSR-React | medium | 15 | 1993.24 | 687.12 | 1796.10 | 4476.61 | 1817.31 |
| CSR-React | heavy | 15 | 23690.54 | 22464.80 | 1757.18 | 50632.88 | 19681.51 |
| CSR-Next | light | 15 | 2218.92 | 28.75 | 2190.32 | 2316.99 | 2216.01 |
| CSR-Next | medium | 15 | 2509.79 | 1049.52 | 2199.01 | 6284.54 | 2212.75 |
| CSR-Next | heavy | 15 | 12025.07 | 19948.79 | 2191.75 | 50893.57 | 2217.38 |
| SSG-Next | light | 15 | 3532.03 | 394.84 | 2107.61 | 3690.34 | 3625.73 |
| SSG-Next | medium | 15 | 3486.53 | 526.67 | 2186.59 | 3732.89 | 3689.22 |
| SSG-Next | heavy | 15 | 19993.79 | 20728.58 | 3596.86 | 68001.65 | 3839.73 |
| SSR-Next | light | 15 | 3455.37 | 494.45 | 2115.42 | 3878.12 | 3614.95 |
| SSR-Next | medium | 15 | 3494.76 | 562.11 | 2118.17 | 4097.27 | 3662.19 |
| SSR-Next | heavy | 15 | 7991.82 | 11781.31 | 2756.46 | 40816.76 | 3664.74 |

### Performance Score  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 66.93 | 0.26 | 66.00 | 67.00 | 67.00 |
| CSR-React | medium | 15 | 63.93 | 0.26 | 63.00 | 64.00 | 64.00 |
| CSR-React | heavy | 15 | 61.00 | 6.82 | 44.00 | 64.00 | 64.00 |
| CSR-Next | light | 15 | 66.00 | 0.00 | 66.00 | 66.00 | 66.00 |
| CSR-Next | medium | 15 | 64.67 | 1.05 | 61.00 | 65.00 | 65.00 |
| CSR-Next | heavy | 15 | 64.73 | 0.46 | 64.00 | 65.00 | 65.00 |
| SSG-Next | light | 15 | 69.00 | 0.00 | 69.00 | 69.00 | 69.00 |
| SSG-Next | medium | 15 | 65.00 | 0.00 | 65.00 | 65.00 | 65.00 |
| SSG-Next | heavy | 15 | 69.80 | 0.56 | 68.00 | 70.00 | 70.00 |
| SSR-Next | light | 15 | 68.93 | 0.26 | 68.00 | 69.00 | 69.00 |
| SSR-Next | medium | 15 | 65.00 | 0.00 | 65.00 | 65.00 | 65.00 |
| SSR-Next | heavy | 15 | 69.53 | 1.55 | 64.00 | 70.00 | 70.00 |

## 2. RQ1 — Pengaruh Strategi Rendering (CSR-React vs SSG vs SSR)

Analisis utama, mengikuti Batasan Masalah #1: CSR diwakili React,
SSR dan SSG diwakili Next.js. Diuji terpisah pada setiap tier beban
media agar faktor media tidak mencemari perbandingan antar strategi.

### LCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.5953      homogen
    Kruskal-Wallis: H=29.418, df=2, p=4.093e-07, epsilon-kuadrat=0.653
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.7089  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0196       tidak normal
      Shapiro-Wilk SSG-Next p=0.0026       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4136      homogen
    Kruskal-Wallis: H=29.357, df=2, p=4.218e-07, epsilon-kuadrat=0.651
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.901  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0115       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.5024      homogen
    Kruskal-Wallis: H=31.993, df=2, p=1.129e-07, epsilon-kuadrat=0.714
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.01614  signifikan

### CLS
  tier light:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  tier medium:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  tier heavy:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.

### FCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0002       tidak normal
      Shapiro-Wilk SSG-Next p=0.0220       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.1644      homogen
    Kruskal-Wallis: H=30.164, df=2, p=2.818e-07, epsilon-kuadrat=0.671
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.1844  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.3661       normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.3391      homogen
    Kruskal-Wallis: H=29.673, df=2, p=3.603e-07, epsilon-kuadrat=0.659
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.4068  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0249       tidak normal
      Shapiro-Wilk SSG-Next p=0.0028       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.2079      homogen
    Kruskal-Wallis: H=29.393, df=2, p=4.143e-07, epsilon-kuadrat=0.652
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.383e-06  signifikan
      CSR-React vs SSR-Next p=3.383e-06  signifikan
      SSG-Next vs SSR-Next p=0.7716  tidak signifikan

### TBT (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React n/a            konstan
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0017       tidak normal
      Levene              p=0.0098      tidak homogen
    Kruskal-Wallis: H=31.724, df=2, p=1.292e-07, epsilon-kuadrat=0.708
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=6.866e-07  signifikan
      CSR-React vs SSR-Next p=6.866e-07  signifikan
      SSG-Next vs SSR-Next p=0.1057  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0001       tidak normal
      Shapiro-Wilk SSR-Next p=0.0001       tidak normal
      Levene              p=0.0800      homogen
    Kruskal-Wallis: H=29.055, df=2, p=4.907e-07, epsilon-kuadrat=0.644
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=2.299e-06  signifikan
      CSR-React vs SSR-Next p=4.35e-06  signifikan
      SSG-Next vs SSR-Next p=0.068  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0301       tidak normal
      Shapiro-Wilk SSR-Next p=0.0071       tidak normal
      Levene              p=0.0627      homogen
    Kruskal-Wallis: H=6.762, df=2, p=0.03401, epsilon-kuadrat=0.113
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=0.02696  tidak signifikan
      CSR-React vs SSR-Next p=0.02997  tidak signifikan
      SSG-Next vs SSR-Next p=0.5069  tidak signifikan

### Speed Index (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.6150      homogen
    Kruskal-Wallis: H=29.574, df=2, p=3.785e-07, epsilon-kuadrat=0.657
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.375e-06  signifikan
      CSR-React vs SSR-Next p=3.383e-06  signifikan
      SSG-Next vs SSR-Next p=0.5065  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0152       tidak normal
      Shapiro-Wilk SSG-Next p=0.0018       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.2878      homogen
    Kruskal-Wallis: H=29.586, df=2, p=3.762e-07, epsilon-kuadrat=0.657
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.383e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.4807  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0259       tidak normal
      Shapiro-Wilk SSG-Next p=0.3666       normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4624      homogen
    Kruskal-Wallis: H=29.633, df=2, p=3.676e-07, epsilon-kuadrat=0.658
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.383e-06  signifikan
      CSR-React vs SSR-Next p=3.383e-06  signifikan
      SSG-Next vs SSR-Next p=0.4427  tidak signifikan

### TTI (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0002       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.3303      homogen
    Kruskal-Wallis: H=29.932, df=2, p=3.164e-07, epsilon-kuadrat=0.665
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.2628  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.9354      homogen
    Kruskal-Wallis: H=22.470, df=2, p=1.32e-05, epsilon-kuadrat=0.487
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=5.737e-05  signifikan
      CSR-React vs SSR-Next p=5.737e-05  signifikan
      SSG-Next vs SSR-Next p=0.3401  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0007       tidak normal
      Shapiro-Wilk SSG-Next p=0.0025       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.0110      tidak homogen
    Kruskal-Wallis: H=3.739, df=2, p=0.1542, epsilon-kuadrat=0.041
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar strategi rendering.

### Performance Score
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next n/a            konstan
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.6101      homogen
    Kruskal-Wallis: H=41.834, df=2, p=8.239e-10, epsilon-kuadrat=0.948
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=1.294e-07  signifikan
      CSR-React vs SSR-Next p=1.973e-07  signifikan
      SSG-Next vs SSR-Next p=0.3506  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next n/a            konstan
      Shapiro-Wilk SSR-Next n/a            konstan
      Levene              p=0.3765      homogen
    Kruskal-Wallis: H=43.548, df=2, p=3.496e-10, epsilon-kuadrat=0.989
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=1.294e-07  signifikan
      CSR-React vs SSR-Next p=1.294e-07  signifikan
      SSG-Next vs SSR-Next p=nan  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.1257      homogen
    Kruskal-Wallis: H=35.437, df=2, p=2.018e-08, epsilon-kuadrat=0.796
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=6.348e-07  signifikan
      CSR-React vs SSR-Next p=1.786e-06  signifikan
      SSG-Next vs SSR-Next p=1  tidak signifikan

## 3. RQ2 — Pengaruh Variasi Beban Media (light vs medium vs heavy)

Diuji terpisah pada setiap strategi rendering.

### LCP (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0196       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.1646      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi CSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0001       tidak normal
      Shapiro-Wilk medium   p=0.0003       tidak normal
      Shapiro-Wilk heavy    p=0.0132       tidak normal
      Levene              p=0.2947      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0026       tidak normal
      Shapiro-Wilk heavy    p=0.0115       tidak normal
      Levene              p=0.6436      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.6152      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan

### CLS
  strategi CSR-React:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  strategi CSR-Next:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  strategi SSG-Next:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  strategi SSR-Next:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.

### FCP (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0002       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0249       tidak normal
      Levene              p=0.7893      homogen
    Kruskal-Wallis: H=2.127, df=2, p=0.3452, epsilon-kuadrat=0.003
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi CSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0001       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0002       tidak normal
      Levene              p=0.3050      homogen
    Kruskal-Wallis: H=0.010, df=2, p=0.995, epsilon-kuadrat=-0.047
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0220       tidak normal
      Shapiro-Wilk medium   p=0.3661       normal
      Shapiro-Wilk heavy    p=0.0028       tidak normal
      Levene              p=0.3584      homogen
    Kruskal-Wallis: H=16.891, df=2, p=0.0002148, epsilon-kuadrat=0.355
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.004795  signifikan
      light    vs heavy    p=8.134e-05  signifikan
      medium   vs heavy    p=0.2628  tidak signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.9243      homogen
    Kruskal-Wallis: H=9.804, df=2, p=0.007431, epsilon-kuadrat=0.186
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.2455  tidak signifikan
      light    vs heavy    p=0.00323  signifikan
      medium   vs heavy    p=0.03809  tidak signifikan

### TBT (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    n/a            konstan
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.0448      tidak homogen
    Kruskal-Wallis: H=15.231, df=2, p=0.0004928, epsilon-kuadrat=0.315
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.3506  tidak signifikan
      light    vs heavy    p=0.001523  signifikan
      medium   vs heavy    p=0.00781  signifikan
  strategi CSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0888       normal
      Shapiro-Wilk medium   p=0.9823       normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.2280      homogen
    Kruskal-Wallis: H=3.633, df=2, p=0.1626, epsilon-kuadrat=0.039
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0001       tidak normal
      Shapiro-Wilk heavy    p=0.0301       tidak normal
      Levene              p=0.0331      tidak homogen
    Kruskal-Wallis: H=24.599, df=2, p=4.554e-06, epsilon-kuadrat=0.538
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.0004937  signifikan
      light    vs heavy    p=5.053e-06  signifikan
      medium   vs heavy    p=0.068  tidak signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0017       tidak normal
      Shapiro-Wilk medium   p=0.0001       tidak normal
      Shapiro-Wilk heavy    p=0.0071       tidak normal
      Levene              p=0.0002      tidak homogen
    Kruskal-Wallis: H=24.135, df=2, p=5.743e-06, epsilon-kuadrat=0.527
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.1913  tidak signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=0.0004937  signifikan

### Speed Index (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0152       tidak normal
      Shapiro-Wilk heavy    p=0.0259       tidak normal
      Levene              p=0.0514      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi CSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0002       tidak normal
      Shapiro-Wilk medium   p=0.0003       tidak normal
      Shapiro-Wilk heavy    p=0.9856       normal
      Levene              p=0.2689      homogen
    Kruskal-Wallis: H=39.141, df=2, p=3.167e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.358e-06  signifikan
      light    vs heavy    p=3.358e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0018       tidak normal
      Shapiro-Wilk heavy    p=0.3666       normal
      Levene              p=0.9513      homogen
    Kruskal-Wallis: H=39.141, df=2, p=3.167e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.366e-06  signifikan
      light    vs heavy    p=3.366e-06  signifikan
      medium   vs heavy    p=3.375e-06  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.5157      homogen
    Kruskal-Wallis: H=31.830, df=2, p=1.225e-07, epsilon-kuadrat=0.710
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.383e-06  signifikan
      light    vs heavy    p=5.715e-05  signifikan
      medium   vs heavy    p=5.726e-05  signifikan

### TTI (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0002       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0007       tidak normal
      Levene              p=0.0000      tidak homogen
    Kruskal-Wallis: H=4.453, df=2, p=0.1079, epsilon-kuadrat=0.058
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi CSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.0389      tidak homogen
    Kruskal-Wallis: H=1.304, df=2, p=0.521, epsilon-kuadrat=-0.017
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0025       tidak normal
      Levene              p=0.0005      tidak homogen
    Kruskal-Wallis: H=16.822, df=2, p=0.0002224, epsilon-kuadrat=0.353
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.01614  signifikan
      light    vs heavy    p=0.0003079  signifikan
      medium   vs heavy    p=0.0114  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.1447      homogen
    Kruskal-Wallis: H=6.579, df=2, p=0.03727, epsilon-kuadrat=0.109
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.068  tidak signifikan
      light    vs heavy    p=0.0144  signifikan
      medium   vs heavy    p=0.6187  tidak signifikan

### Performance Score
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.0746      homogen
    Kruskal-Wallis: H=37.303, df=2, p=7.94e-09, epsilon-kuadrat=0.841
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=1.973e-07  signifikan
      light    vs heavy    p=4.673e-07  signifikan
      medium   vs heavy    p=0.1332  tidak signifikan
  strategi CSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    n/a            konstan
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.3512      homogen
    Kruskal-Wallis: H=36.381, df=2, p=1.259e-08, epsilon-kuadrat=0.819
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=1.868e-07  signifikan
      light    vs heavy    p=3.106e-07  signifikan
      medium   vs heavy    p=0.4561  tidak signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    n/a            konstan
      Shapiro-Wilk medium   n/a            konstan
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.1609      homogen
    Kruskal-Wallis: H=39.816, df=2, p=2.26e-09, epsilon-kuadrat=0.900
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=8.266e-08  signifikan
      light    vs heavy    p=2.268e-05  signifikan
      medium   vs heavy    p=1.868e-07  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   n/a            konstan
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.3240      homogen
    Kruskal-Wallis: H=34.237, df=2, p=3.677e-08, epsilon-kuadrat=0.768
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=1.294e-07  signifikan
      light    vs heavy    p=2.811e-05  signifikan
      medium   vs heavy    p=6.362e-06  signifikan

## 4. Analisis Pelengkap — Efek Strategi Murni (semua Next.js)

Membandingkan CSR, SSG, dan SSR yang ketiganya berjalan di atas
Next.js. Karena framework-nya sama, selisih yang muncul murni
berasal dari strategi rendering — bebas dari pengaruh framework.

### LCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0001       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.0962      homogen
    Kruskal-Wallis: H=29.418, df=2, p=4.093e-07, epsilon-kuadrat=0.653
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.392e-06  signifikan
      CSR-Next vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.7089  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0003       tidak normal
      Shapiro-Wilk SSG-Next p=0.0026       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4174      homogen
    Kruskal-Wallis: H=29.357, df=2, p=4.218e-07, epsilon-kuadrat=0.651
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.392e-06  signifikan
      CSR-Next vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.901  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0132       tidak normal
      Shapiro-Wilk SSG-Next p=0.0115       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4104      homogen
    Kruskal-Wallis: H=31.993, df=2, p=1.129e-07, epsilon-kuadrat=0.714
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.392e-06  signifikan
      CSR-Next vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.01614  signifikan

### CLS
  tier light:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  tier medium:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  tier heavy:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.

### FCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0001       tidak normal
      Shapiro-Wilk SSG-Next p=0.0220       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.1860      homogen
    Kruskal-Wallis: H=20.592, df=2, p=3.377e-05, epsilon-kuadrat=0.443
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=1.935e-05  signifikan
      CSR-Next vs SSR-Next p=0.001404  signifikan
      SSG-Next vs SSR-Next p=0.1844  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.3661       normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.3304      homogen
    Kruskal-Wallis: H=15.623, df=2, p=0.0004051, epsilon-kuadrat=0.324
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=0.001215  signifikan
      CSR-Next vs SSR-Next p=0.000576  signifikan
      SSG-Next vs SSR-Next p=0.4068  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0002       tidak normal
      Shapiro-Wilk SSG-Next p=0.0028       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4972      homogen
    Kruskal-Wallis: H=3.787, df=2, p=0.1505, epsilon-kuadrat=0.043
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar strategi rendering.

### TBT (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0888       normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0017       tidak normal
      Levene              p=0.2309      homogen
    Kruskal-Wallis: H=30.554, df=2, p=2.319e-07, epsilon-kuadrat=0.680
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.392e-06  signifikan
      CSR-Next vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.1057  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.9823       normal
      Shapiro-Wilk SSG-Next p=0.0001       tidak normal
      Shapiro-Wilk SSR-Next p=0.0001       tidak normal
      Levene              p=0.0103      tidak homogen
    Kruskal-Wallis: H=12.885, df=2, p=0.001592, epsilon-kuadrat=0.259
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=0.1149  tidak signifikan
      CSR-Next vs SSR-Next p=0.0003079  signifikan
      SSG-Next vs SSR-Next p=0.068  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0301       tidak normal
      Shapiro-Wilk SSR-Next p=0.0071       tidak normal
      Levene              p=0.0035      tidak homogen
    Kruskal-Wallis: H=1.555, df=2, p=0.4594, epsilon-kuadrat=-0.011
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar strategi rendering.

### Speed Index (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0002       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.0887      homogen
    Kruskal-Wallis: H=29.582, df=2, p=3.771e-07, epsilon-kuadrat=0.657
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.341e-06  signifikan
      CSR-Next vs SSR-Next p=3.35e-06  signifikan
      SSG-Next vs SSR-Next p=0.5065  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0003       tidak normal
      Shapiro-Wilk SSG-Next p=0.0018       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.3792      homogen
    Kruskal-Wallis: H=29.586, df=2, p=3.762e-07, epsilon-kuadrat=0.657
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.383e-06  signifikan
      CSR-Next vs SSR-Next p=3.392e-06  signifikan
      SSG-Next vs SSR-Next p=0.4807  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.9856       normal
      Shapiro-Wilk SSG-Next p=0.3666       normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4003      homogen
    Kruskal-Wallis: H=29.633, df=2, p=3.676e-07, epsilon-kuadrat=0.658
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=3.383e-06  signifikan
      CSR-Next vs SSR-Next p=3.383e-06  signifikan
      SSG-Next vs SSR-Next p=0.4427  tidak signifikan

### TTI (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.3322      homogen
    Kruskal-Wallis: H=22.628, df=2, p=1.22e-05, epsilon-kuadrat=0.491
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=5.737e-05  signifikan
      CSR-Next vs SSR-Next p=5.737e-05  signifikan
      SSG-Next vs SSR-Next p=0.2628  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.9571      homogen
    Kruskal-Wallis: H=11.627, df=2, p=0.002986, epsilon-kuadrat=0.229
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=0.00421  signifikan
      CSR-Next vs SSR-Next p=0.00421  signifikan
      SSG-Next vs SSR-Next p=0.3401  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0025       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.2081      homogen
    Kruskal-Wallis: H=11.457, df=2, p=0.003251, epsilon-kuadrat=0.225
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=0.01012  signifikan
      CSR-Next vs SSR-Next p=0.0251  tidak signifikan
      SSG-Next vs SSR-Next p=0.008972  signifikan

### Performance Score
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-Next n/a            konstan
      Shapiro-Wilk SSG-Next n/a            konstan
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.3765      homogen
    Kruskal-Wallis: H=42.250, df=2, p=6.692e-10, epsilon-kuadrat=0.958
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=8.266e-08  signifikan
      CSR-Next vs SSR-Next p=1.294e-07  signifikan
      SSG-Next vs SSR-Next p=0.3506  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next n/a            konstan
      Shapiro-Wilk SSR-Next n/a            konstan
      Levene              p=0.2301      homogen
    Kruskal-Wallis: H=4.091, df=2, p=0.1293, epsilon-kuadrat=0.050
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar strategi rendering.
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.7457      homogen
    Kruskal-Wallis: H=32.968, df=2, p=6.934e-08, epsilon-kuadrat=0.737
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-Next vs SSG-Next p=6.142e-07  signifikan
      CSR-Next vs SSR-Next p=1.017e-05  signifikan
      SSG-Next vs SSR-Next p=1  tidak signifikan

## 5. Analisis Pelengkap — Efek Framework Murni (CSR saja)

Membandingkan CSR pada React dengan CSR pada Next.js. Karena
strateginya sama, selisih yang muncul murni berasal dari
framework. Inilah yang memisahkan dua pengaruh yang pada desain
awal tidak dapat diatribusikan.

### LCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0001       tidak normal
      Levene              p=0.2362      homogen
    Kruskal-Wallis: H=21.774, df=1, p=3.067e-06, epsilon-kuadrat=0.742
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=3.392e-06  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0196       tidak normal
      Shapiro-Wilk CSR-Next p=0.0003       tidak normal
      Levene              p=0.5620      homogen
    Kruskal-Wallis: H=12.873, df=1, p=0.0003334, epsilon-kuadrat=0.424
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=0.0003609  signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0132       tidak normal
      Levene              p=0.1723      homogen
    Kruskal-Wallis: H=17.033, df=1, p=3.674e-05, epsilon-kuadrat=0.573
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=4.02e-05  signifikan

### CLS
  tier light:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  tier medium:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  tier heavy:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.

### FCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0002       tidak normal
      Shapiro-Wilk CSR-Next p=0.0001       tidak normal
      Levene              p=0.8479      homogen
    Kruskal-Wallis: H=21.774, df=1, p=3.067e-06, epsilon-kuadrat=0.742
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=3.392e-06  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.2591      homogen
    Kruskal-Wallis: H=16.355, df=1, p=5.252e-05, epsilon-kuadrat=0.548
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=5.737e-05  signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0249       tidak normal
      Shapiro-Wilk CSR-Next p=0.0002       tidak normal
      Levene              p=0.1909      homogen
    Kruskal-Wallis: H=21.779, df=1, p=3.059e-06, epsilon-kuadrat=0.742
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=3.383e-06  signifikan

### TBT (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React n/a            konstan
      Shapiro-Wilk CSR-Next p=0.0888       normal
      Levene              p=0.0026      tidak homogen
    Kruskal-Wallis: H=24.873, df=1, p=6.124e-07, epsilon-kuadrat=0.853
      (dipakai karena homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=6.866e-07  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.9823       normal
      Levene              p=0.5215      homogen
    Kruskal-Wallis: H=24.226, df=1, p=8.565e-07, epsilon-kuadrat=0.830
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=9.576e-07  signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.0806      homogen
    Kruskal-Wallis: H=4.802, df=1, p=0.02843, epsilon-kuadrat=0.136
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=0.02997  signifikan

### Speed Index (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0002       tidak normal
      Levene              p=0.2137      homogen
    Kruskal-Wallis: H=21.794, df=1, p=3.036e-06, epsilon-kuadrat=0.743
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=3.358e-06  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0152       tidak normal
      Shapiro-Wilk CSR-Next p=0.0003       tidak normal
      Levene              p=0.5688      homogen
    Kruskal-Wallis: H=12.284, df=1, p=0.0004568, epsilon-kuadrat=0.403
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=0.0004937  signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0259       tidak normal
      Shapiro-Wilk CSR-Next p=0.9856       normal
      Levene              p=0.0683      homogen
    Kruskal-Wallis: H=16.692, df=1, p=4.397e-05, epsilon-kuadrat=0.560
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=4.806e-05  signifikan

### TTI (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0002       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.9571      homogen
    Kruskal-Wallis: H=21.774, df=1, p=3.067e-06, epsilon-kuadrat=0.742
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=3.392e-06  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.7165      homogen
    Kruskal-Wallis: H=16.692, df=1, p=4.397e-05, epsilon-kuadrat=0.560
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=4.806e-05  signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0007       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.0597      homogen
    Kruskal-Wallis: H=0.413, df=1, p=0.5203, epsilon-kuadrat=-0.021
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar framework.

### Performance Score
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next n/a            konstan
      Levene              p=0.3259      homogen
    Kruskal-Wallis: H=25.375, df=1, p=4.72e-07, epsilon-kuadrat=0.871
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=5.348e-07  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.3462      homogen
    Kruskal-Wallis: H=17.737, df=1, p=2.537e-05, epsilon-kuadrat=0.598
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=2.811e-05  signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk CSR-Next p=0.0000       tidak normal
      Levene              p=0.1329      homogen
    Kruskal-Wallis: H=17.049, df=1, p=3.642e-05, epsilon-kuadrat=0.573
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/1=0.0500):
      CSR-React vs CSR-Next p=4.021e-05  signifikan
