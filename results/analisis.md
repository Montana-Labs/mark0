# Hasil Analisis Statistik — mark0

Sumber: `results/metrics.csv` (135 run)
Taraf signifikansi: alpha = 0.05

## 1. Statistik Deskriptif

### LCP (ms)  _(Core Web Vitals)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 2947.42 | 471.50 | 2664.48 | 4299.27 | 2763.24 |
| CSR-React | medium | 15 | 6106.05 | 1668.63 | 4716.11 | 10913.83 | 5826.07 |
| CSR-React | heavy | 15 | 16310.59 | 7579.67 | 12658.21 | 39118.28 | 12890.73 |
| SSG-Next | light | 15 | 4120.10 | 441.91 | 3184.90 | 4497.00 | 4354.95 |
| SSG-Next | medium | 15 | 9754.24 | 2669.08 | 4573.83 | 12276.79 | 9939.66 |
| SSG-Next | heavy | 15 | 25006.16 | 13777.87 | 12940.37 | 45237.06 | 23354.29 |
| SSR-Next | light | 15 | 3853.40 | 733.08 | 2567.09 | 4633.75 | 4343.23 |
| SSR-Next | medium | 15 | 7437.88 | 2904.34 | 4538.13 | 12370.56 | 7163.49 |
| SSR-Next | heavy | 15 | 25176.80 | 12525.89 | 12817.91 | 44718.79 | 23816.36 |

### CLS  _(Core Web Vitals)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSR-Next | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSR-Next | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSR-Next | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

### FCP (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 1268.87 | 54.05 | 1214.58 | 1387.26 | 1253.61 |
| CSR-React | medium | 15 | 1285.24 | 54.23 | 1220.87 | 1411.62 | 1295.11 |
| CSR-React | heavy | 15 | 1287.11 | 77.23 | 1202.96 | 1491.32 | 1264.74 |
| SSG-Next | light | 15 | 960.95 | 171.49 | 869.79 | 1561.51 | 924.54 |
| SSG-Next | medium | 15 | 980.30 | 182.83 | 815.88 | 1557.59 | 943.88 |
| SSG-Next | heavy | 15 | 848.49 | 39.98 | 799.88 | 970.76 | 844.32 |
| SSR-Next | light | 15 | 949.08 | 271.88 | 807.86 | 1720.87 | 841.87 |
| SSR-Next | medium | 15 | 908.69 | 190.16 | 813.45 | 1577.96 | 852.32 |
| SSR-Next | heavy | 15 | 892.87 | 186.80 | 808.97 | 1560.35 | 843.23 |

### TBT (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | medium | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| CSR-React | heavy | 15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| SSG-Next | light | 15 | 67.13 | 45.78 | 46.00 | 230.00 | 53.00 |
| SSG-Next | medium | 15 | 64.73 | 9.41 | 48.00 | 83.00 | 70.00 |
| SSG-Next | heavy | 15 | 57.93 | 16.38 | 30.00 | 99.00 | 51.00 |
| SSR-Next | light | 15 | 61.47 | 11.94 | 44.00 | 84.00 | 63.00 |
| SSR-Next | medium | 15 | 70.67 | 48.78 | 33.00 | 239.00 | 66.00 |
| SSR-Next | heavy | 15 | 76.60 | 52.93 | 46.00 | 260.00 | 69.00 |

### Speed Index (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 1600.82 | 182.02 | 1405.11 | 2203.05 | 1578.94 |
| CSR-React | medium | 15 | 2009.25 | 287.69 | 1634.64 | 2743.06 | 1940.83 |
| CSR-React | heavy | 15 | 4004.63 | 994.21 | 3014.01 | 6058.64 | 3459.15 |
| SSG-Next | light | 15 | 1240.61 | 468.09 | 881.28 | 2831.83 | 1200.49 |
| SSG-Next | medium | 15 | 1335.88 | 486.95 | 945.38 | 3025.19 | 1247.66 |
| SSG-Next | heavy | 15 | 2012.55 | 312.70 | 1692.40 | 2802.00 | 1891.23 |
| SSR-Next | light | 15 | 1751.59 | 1262.85 | 970.31 | 4393.91 | 1245.53 |
| SSR-Next | medium | 15 | 1538.06 | 507.42 | 1201.24 | 2861.85 | 1356.95 |
| SSR-Next | heavy | 15 | 2537.47 | 689.88 | 1767.06 | 3961.57 | 2253.00 |

### TTI (ms)  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 2947.57 | 471.89 | 2664.48 | 4301.19 | 2763.24 |
| CSR-React | medium | 15 | 6131.33 | 1685.97 | 4716.11 | 11008.07 | 5920.38 |
| CSR-React | heavy | 15 | 16442.54 | 7758.84 | 12658.21 | 39611.64 | 12890.73 |
| SSG-Next | light | 15 | 4120.10 | 441.91 | 3184.90 | 4497.00 | 4354.95 |
| SSG-Next | medium | 15 | 9754.24 | 2669.08 | 4573.83 | 12276.79 | 9939.66 |
| SSG-Next | heavy | 15 | 25006.16 | 13777.87 | 12940.37 | 45237.06 | 23354.29 |
| SSR-Next | light | 15 | 3853.40 | 733.08 | 2567.09 | 4633.75 | 4343.23 |
| SSR-Next | medium | 15 | 7437.88 | 2904.34 | 4538.13 | 12370.56 | 7163.49 |
| SSR-Next | heavy | 15 | 25176.80 | 12525.89 | 12817.91 | 44718.79 | 23816.36 |

### Performance Score  _(metrik Lighthouse pendukung)_

| Strategi | Tier | n | Mean | SD | Min | Max | Median |
|---|---|---|---|---|---|---|---|
| CSR-React | light | 15 | 94.53 | 3.20 | 85.00 | 96.00 | 96.00 |
| CSR-React | medium | 15 | 79.27 | 2.99 | 75.00 | 83.00 | 79.00 |
| CSR-React | heavy | 15 | 72.80 | 1.61 | 69.00 | 74.00 | 74.00 |
| SSG-Next | light | 15 | 86.47 | 3.40 | 80.00 | 93.00 | 85.00 |
| SSG-Next | medium | 15 | 76.20 | 3.00 | 74.00 | 84.00 | 75.00 |
| SSG-Next | heavy | 15 | 74.87 | 0.35 | 74.00 | 75.00 | 75.00 |
| SSR-Next | light | 15 | 87.80 | 5.48 | 81.00 | 97.00 | 85.00 |
| SSR-Next | medium | 15 | 78.07 | 4.11 | 71.00 | 84.00 | 76.00 |
| SSR-Next | heavy | 15 | 74.13 | 1.36 | 70.00 | 75.00 | 75.00 |

## 2. RQ1 — Pengaruh Strategi Rendering (CSR-React vs SSG vs SSR)

Analisis utama, mengikuti Batasan Masalah #1: CSR diwakili React,
SSR dan SSG diwakili Next.js. Diuji terpisah pada setiap tier beban
media agar faktor media tidak mencemari perbandingan antar strategi.

### LCP (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0020       tidak normal
      Shapiro-Wilk SSR-Next p=0.0030       tidak normal
      Levene              p=0.2361      homogen
    Kruskal-Wallis: H=19.284, df=2, p=6.493e-05, epsilon-kuadrat=0.412
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=2.798e-05  signifikan
      CSR-React vs SSR-Next p=0.002463  signifikan
      SSG-Next vs SSR-Next p=0.2134  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0017       tidak normal
      Shapiro-Wilk SSG-Next p=0.0113       tidak normal
      Shapiro-Wilk SSR-Next p=0.0081       tidak normal
      Levene              p=0.1867      homogen
    Kruskal-Wallis: H=9.023, df=2, p=0.01098, epsilon-kuadrat=0.167
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=0.002463  signifikan
      CSR-React vs SSR-Next p=0.3615  tidak signifikan
      SSG-Next vs SSR-Next p=0.0745  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0014       tidak normal
      Shapiro-Wilk SSR-Next p=0.0097       tidak normal
      Levene              p=0.0157      tidak homogen
    Kruskal-Wallis: H=10.565, df=2, p=0.005079, epsilon-kuadrat=0.204
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=0.00421  signifikan
      CSR-React vs SSR-Next p=0.007016  signifikan
      SSG-Next vs SSR-Next p=0.9669  tidak signifikan

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
      Shapiro-Wilk CSR-React p=0.0254       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4474      homogen
    Kruskal-Wallis: H=21.294, df=2, p=2.377e-05, epsilon-kuadrat=0.459
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=5.737e-05  signifikan
      CSR-React vs SSR-Next p=0.0006709  signifikan
      SSG-Next vs SSR-Next p=0.00794  signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0928       normal
      Shapiro-Wilk SSG-Next p=0.0008       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.4241      homogen
    Kruskal-Wallis: H=23.862, df=2, p=6.584e-06, epsilon-kuadrat=0.521
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=5.737e-05  signifikan
      CSR-React vs SSR-Next p=5.737e-05  signifikan
      SSG-Next vs SSR-Next p=0.04649  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0123       tidak normal
      Shapiro-Wilk SSG-Next p=0.0037       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.5235      homogen
    Kruskal-Wallis: H=25.763, df=2, p=2.545e-06, epsilon-kuadrat=0.566
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=5.737e-05  signifikan
      SSG-Next vs SSR-Next p=0.74  tidak signifikan

### TBT (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React n/a            konstan
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.4080       normal
      Levene              p=0.1509      homogen
    Kruskal-Wallis: H=30.938, df=2, p=1.913e-07, epsilon-kuadrat=0.689
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=6.799e-07  signifikan
      CSR-React vs SSR-Next p=6.844e-07  signifikan
      SSG-Next vs SSR-Next p=0.3395  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React n/a            konstan
      Shapiro-Wilk SSG-Next p=0.1282       normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.0484      tidak homogen
    Kruskal-Wallis: H=30.662, df=2, p=2.197e-07, epsilon-kuadrat=0.682
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=6.122e-07  signifikan
      CSR-React vs SSR-Next p=6.646e-07  signifikan
      SSG-Next vs SSR-Next p=0.7698  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React n/a            konstan
      Shapiro-Wilk SSG-Next p=0.1004       normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.0795      homogen
    Kruskal-Wallis: H=31.175, df=2, p=1.7e-07, epsilon-kuadrat=0.695
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=6.822e-07  signifikan
      CSR-React vs SSR-Next p=6.799e-07  signifikan
      SSG-Next vs SSR-Next p=0.2442  tidak signifikan

### Speed Index (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0002       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0000       tidak normal
      Levene              p=0.0773      homogen
    Kruskal-Wallis: H=16.891, df=2, p=0.0002148, epsilon-kuadrat=0.355
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=6.837e-05  signifikan
      CSR-React vs SSR-Next p=0.005452  signifikan
      SSG-Next vs SSR-Next p=0.2808  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.1675       normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0001       tidak normal
      Levene              p=0.8784      homogen
    Kruskal-Wallis: H=21.659, df=2, p=1.981e-05, epsilon-kuadrat=0.468
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=5.737e-05  signifikan
      CSR-React vs SSR-Next p=0.0006709  signifikan
      SSG-Next vs SSR-Next p=0.02793  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0273       tidak normal
      Shapiro-Wilk SSG-Next p=0.0107       tidak normal
      Shapiro-Wilk SSR-Next p=0.0110       tidak normal
      Levene              p=0.0384      tidak homogen
    Kruskal-Wallis: H=29.016, df=2, p=5.004e-07, epsilon-kuadrat=0.643
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=3.392e-06  signifikan
      CSR-React vs SSR-Next p=9.662e-05  signifikan
      SSG-Next vs SSR-Next p=0.00794  signifikan

### TTI (ms)
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0020       tidak normal
      Shapiro-Wilk SSR-Next p=0.0030       tidak normal
      Levene              p=0.2364      homogen
    Kruskal-Wallis: H=19.284, df=2, p=6.493e-05, epsilon-kuadrat=0.412
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=2.798e-05  signifikan
      CSR-React vs SSR-Next p=0.002463  signifikan
      SSG-Next vs SSR-Next p=0.2134  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0017       tidak normal
      Shapiro-Wilk SSG-Next p=0.0113       tidak normal
      Shapiro-Wilk SSR-Next p=0.0081       tidak normal
      Levene              p=0.1978      homogen
    Kruskal-Wallis: H=9.023, df=2, p=0.01098, epsilon-kuadrat=0.167
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=0.002463  signifikan
      CSR-React vs SSR-Next p=0.3615  tidak signifikan
      SSG-Next vs SSR-Next p=0.0745  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0014       tidak normal
      Shapiro-Wilk SSR-Next p=0.0097       tidak normal
      Levene              p=0.0191      tidak homogen
    Kruskal-Wallis: H=10.565, df=2, p=0.005079, epsilon-kuadrat=0.204
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=0.00421  signifikan
      CSR-React vs SSR-Next p=0.007016  signifikan
      SSG-Next vs SSR-Next p=0.9669  tidak signifikan

### Performance Score
  tier light:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0000       tidak normal
      Shapiro-Wilk SSG-Next p=0.0379       tidak normal
      Shapiro-Wilk SSR-Next p=0.0252       tidak normal
      Levene              p=0.1262      homogen
    Kruskal-Wallis: H=17.648, df=2, p=0.0001472, epsilon-kuadrat=0.373
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=2.615e-05  signifikan
      CSR-React vs SSR-Next p=0.003186  signifikan
      SSG-Next vs SSR-Next p=0.6524  tidak signifikan
  tier medium:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0226       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0292       tidak normal
      Levene              p=0.1244      homogen
    Kruskal-Wallis: H=8.817, df=2, p=0.01217, epsilon-kuadrat=0.162
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=0.002067  signifikan
      CSR-React vs SSR-Next p=0.3966  tidak signifikan
      SSG-Next vs SSR-Next p=0.08396  tidak signifikan
  tier heavy:
    Uji asumsi:
      Shapiro-Wilk CSR-React p=0.0014       tidak normal
      Shapiro-Wilk SSG-Next p=0.0000       tidak normal
      Shapiro-Wilk SSR-Next p=0.0002       tidak normal
      Levene              p=0.0640      homogen
    Kruskal-Wallis: H=22.343, df=2, p=1.407e-05, epsilon-kuadrat=0.484
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      CSR-React vs SSG-Next p=4.321e-06  signifikan
      CSR-React vs SSR-Next p=0.005506  signifikan
      SSG-Next vs SSR-Next p=0.03951  tidak signifikan

## 3. RQ2 — Pengaruh Variasi Beban Media (light vs medium vs heavy)

Diuji terpisah pada setiap strategi rendering.

### LCP (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0017       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.1171      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0020       tidak normal
      Shapiro-Wilk medium   p=0.0113       tidak normal
      Shapiro-Wilk heavy    p=0.0014       tidak normal
      Levene              p=0.0000      tidak homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0030       tidak normal
      Shapiro-Wilk medium   p=0.0081       tidak normal
      Shapiro-Wilk heavy    p=0.0097       tidak normal
      Levene              p=0.0000      tidak homogen
    Kruskal-Wallis: H=38.957, df=2, p=3.472e-09, epsilon-kuadrat=0.880
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=4.143e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan

### CLS
  strategi CSR-React:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  strategi SSG-Next:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  strategi SSR-Next:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.

### FCP (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0254       tidak normal
      Shapiro-Wilk medium   p=0.0928       normal
      Shapiro-Wilk heavy    p=0.0123       tidak normal
      Levene              p=0.8030      homogen
    Kruskal-Wallis: H=1.435, df=2, p=0.4879, epsilon-kuadrat=-0.013
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0008       tidak normal
      Shapiro-Wilk heavy    p=0.0037       tidak normal
      Levene              p=0.1763      homogen
    Kruskal-Wallis: H=16.374, df=2, p=0.0002782, epsilon-kuadrat=0.342
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.6482  tidak signifikan
      light    vs heavy    p=4.02e-05  signifikan
      medium   vs heavy    p=0.004795  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.7341      homogen
    Kruskal-Wallis: H=0.795, df=2, p=0.6719, epsilon-kuadrat=-0.029
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.

### TBT (ms)
  strategi CSR-React:
    Semua nilai identik di seluruh kelompok — uji tidak bermakna.
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.1282       normal
      Shapiro-Wilk heavy    p=0.1004       normal
      Levene              p=0.5042      homogen
    Kruskal-Wallis: H=5.117, df=2, p=0.07742, epsilon-kuadrat=0.074
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.4080       normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.5048      homogen
    Kruskal-Wallis: H=0.329, df=2, p=0.8481, epsilon-kuadrat=-0.040
      (dipakai karena normalitas tidak terpenuhi)
    -> Tidak ada perbedaan signifikan antar tier beban media.

### Speed Index (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0002       tidak normal
      Shapiro-Wilk medium   p=0.1675       normal
      Shapiro-Wilk heavy    p=0.0273       tidak normal
      Levene              p=0.0010      tidak homogen
    Kruskal-Wallis: H=36.847, df=2, p=9.971e-09, epsilon-kuadrat=0.830
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=4.806e-05  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0107       tidak normal
      Levene              p=0.9863      homogen
    Kruskal-Wallis: H=22.763, df=2, p=1.141e-05, epsilon-kuadrat=0.494
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.2134  tidak signifikan
      light    vs heavy    p=5.737e-05  signifikan
      medium   vs heavy    p=5.737e-05  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0001       tidak normal
      Shapiro-Wilk heavy    p=0.0110       tidak normal
      Levene              p=0.3836      homogen
    Kruskal-Wallis: H=16.005, df=2, p=0.0003346, epsilon-kuadrat=0.333
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=0.0745  tidak signifikan
      light    vs heavy    p=0.00421  signifikan
      medium   vs heavy    p=0.0001356  signifikan

### TTI (ms)
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0017       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.1087      homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0020       tidak normal
      Shapiro-Wilk medium   p=0.0113       tidak normal
      Shapiro-Wilk heavy    p=0.0014       tidak normal
      Levene              p=0.0000      tidak homogen
    Kruskal-Wallis: H=39.130, df=2, p=3.184e-09, epsilon-kuadrat=0.884
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.392e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0030       tidak normal
      Shapiro-Wilk medium   p=0.0081       tidak normal
      Shapiro-Wilk heavy    p=0.0097       tidak normal
      Levene              p=0.0000      tidak homogen
    Kruskal-Wallis: H=38.957, df=2, p=3.472e-09, epsilon-kuadrat=0.880
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=4.143e-06  signifikan
      light    vs heavy    p=3.392e-06  signifikan
      medium   vs heavy    p=3.392e-06  signifikan

### Performance Score
  strategi CSR-React:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0000       tidak normal
      Shapiro-Wilk medium   p=0.0226       tidak normal
      Shapiro-Wilk heavy    p=0.0014       tidak normal
      Levene              p=0.1581      homogen
    Kruskal-Wallis: H=39.858, df=2, p=2.213e-09, epsilon-kuadrat=0.901
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=2.076e-06  signifikan
      light    vs heavy    p=1.725e-06  signifikan
      medium   vs heavy    p=2.551e-06  signifikan
  strategi SSG-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0379       tidak normal
      Shapiro-Wilk medium   p=0.0000       tidak normal
      Shapiro-Wilk heavy    p=0.0000       tidak normal
      Levene              p=0.0604      homogen
    Kruskal-Wallis: H=34.356, df=2, p=3.465e-08, epsilon-kuadrat=0.770
      (dipakai karena normalitas tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=3.171e-06  signifikan
      light    vs heavy    p=1.059e-06  signifikan
      medium   vs heavy    p=0.0646  tidak signifikan
  strategi SSR-Next:
    Uji asumsi:
      Shapiro-Wilk light    p=0.0252       tidak normal
      Shapiro-Wilk medium   p=0.0292       tidak normal
      Shapiro-Wilk heavy    p=0.0002       tidak normal
      Levene              p=0.0252      tidak homogen
    Kruskal-Wallis: H=32.075, df=2, p=1.084e-07, epsilon-kuadrat=0.716
      (dipakai karena normalitas dan homogenitas varians tidak terpenuhi)
    Post-hoc Mann-Whitney, koreksi Bonferroni (alpha=0.05/3=0.0167):
      light    vs medium   p=5.081e-05  signifikan
      light    vs heavy    p=2.511e-06  signifikan
      medium   vs heavy    p=0.0006764  signifikan
