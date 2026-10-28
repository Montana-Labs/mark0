#!/usr/bin/env python3
"""
Uji statistik untuk skripsi mark0, sesuai kolokium bagian 8.3.

Alur pengujian:
    1. Statistik deskriptif per sel (n, mean, SD, min, max, median)
    2. Uji asumsi: Shapiro-Wilk (normalitas) + Levene (homogenitas varians)
    3. Asumsi terpenuhi -> ANOVA satu arah + post-hoc Tukey HSD
       Asumsi gagal      -> Kruskal-Wallis + post-hoc Mann-Whitney (Bonferroni)
    4. Effect size: eta-kuadrat (ANOVA) / epsilon-kuadrat (Kruskal-Wallis)

Dua pengujian dijalankan terpisah:
    RQ1 — pengaruh STRATEGI RENDERING (CSR vs SSG vs SSR) pada tiap tier
    RQ2 — pengaruh BEBAN MEDIA (light vs medium vs heavy) pada tiap strategi

Pemakaian:
    .venv/bin/python scripts/analyze.py
"""

import csv
import itertools
import os
import sys

try:
    import numpy as np
    from scipy import stats
except ImportError:
    sys.exit(
        "numpy/scipy belum terpasang. Jalankan:\n"
        "  uv venv --python 3.13 .venv\n"
        "  uv pip install --python .venv/bin/python numpy scipy\n"
        "lalu panggil dengan .venv/bin/python scripts/analyze.py"
    )

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_IN = os.path.join(ROOT, "results", "metrics.csv")
MD_OUT = os.path.join(ROOT, "results", "analisis.md")

ALPHA = 0.05
STRATEGIES = ["csr", "ssg", "ssr"]
TIERS = ["light", "medium", "heavy"]

METRICS = [
    ("lcp_ms", "LCP (ms)", "Core Web Vitals"),
    ("cls", "CLS", "Core Web Vitals"),
    ("fcp_ms", "FCP (ms)", "metrik Lighthouse pendukung"),
    ("tbt_ms", "TBT (ms)", "metrik Lighthouse pendukung"),
    ("si_ms", "Speed Index (ms)", "metrik Lighthouse pendukung"),
    ("tti_ms", "TTI (ms)", "metrik Lighthouse pendukung"),
    ("performance_score", "Performance Score", "metrik Lighthouse pendukung"),
]

out_lines = []


def emit(line=""):
    print(line)
    out_lines.append(line)


def load():
    with open(CSV_IN) as fh:
        rows = list(csv.DictReader(fh))
    data = {}
    for r in rows:
        key = (r["strategy"], r["tier"])
        for metric, _, _ in METRICS:
            v = r.get(metric)
            if v not in ("", None):
                data.setdefault(key, {}).setdefault(metric, []).append(float(v))
    return data, rows


def describe(values):
    a = np.asarray(values, dtype=float)
    return {
        "n": len(a),
        "mean": a.mean(),
        "sd": a.std(ddof=1) if len(a) > 1 else 0.0,
        "min": a.min(),
        "max": a.max(),
        "median": float(np.median(a)),
    }


def check_assumptions(groups):
    """Kembalikan (normal_semua, varians_homogen, detail)."""
    detail = []
    normal = True
    for label, g in groups:
        a = np.asarray(g, dtype=float)
        if len(a) < 3 or np.allclose(a, a[0]):
            # varians nol (mis. TBT selalu 0, CLS selalu 0) -> Shapiro tak terdefinisi
            detail.append((label, None, "konstan"))
            continue
        w, p = stats.shapiro(a)
        detail.append((label, p, "normal" if p > ALPHA else "tidak normal"))
        if p <= ALPHA:
            normal = False

    arrays = [np.asarray(g, dtype=float) for _, g in groups]
    if all(np.allclose(a, a[0]) for a in arrays):
        return normal, True, detail, None
    try:
        _, p_lev = stats.levene(*arrays, center="median")
    except ValueError:
        return normal, True, detail, None
    return normal, p_lev > ALPHA, detail, p_lev


def run_test(groups, factor_name):
    """Uji omnibus + post-hoc. groups = [(label, values), ...]"""
    labels = [l for l, _ in groups]
    arrays = [np.asarray(g, dtype=float) for _, g in groups]

    if all(np.allclose(np.concatenate(arrays), np.concatenate(arrays)[0])):
        emit(f"    Semua nilai identik di seluruh kelompok — uji tidak bermakna.")
        return

    normal, homog, detail, p_lev = check_assumptions(groups)

    emit("    Uji asumsi:")
    for label, p, verdict in detail:
        ptxt = "n/a" if p is None else f"p={p:.4f}"
        emit(f"      Shapiro-Wilk {label:8} {ptxt:14} {verdict}")
    if p_lev is not None:
        emit(f"      Levene              p={p_lev:.4f}      "
             f"{'homogen' if homog else 'tidak homogen'}")

    n_total = sum(len(a) for a in arrays)
    k = len(arrays)

    if normal and homog:
        f, p = stats.f_oneway(*arrays)
        ss_between = sum(
            len(a) * (a.mean() - np.concatenate(arrays).mean()) ** 2 for a in arrays
        )
        ss_total = ((np.concatenate(arrays) - np.concatenate(arrays).mean()) ** 2).sum()
        eta2 = ss_between / ss_total if ss_total else 0.0
        emit(f"    ANOVA satu arah: F({k-1},{n_total-k})={f:.3f}, p={p:.4g}, "
             f"eta-kuadrat={eta2:.3f}")
        sig = p < ALPHA
        if sig:
            res = stats.tukey_hsd(*arrays)
            emit("    Post-hoc Tukey HSD:")
            for i, j in itertools.combinations(range(k), 2):
                pv = res.pvalue[i][j]
                mark = "signifikan" if pv < ALPHA else "tidak signifikan"
                emit(f"      {labels[i]:8} vs {labels[j]:8} p={pv:.4g}  {mark}")
    else:
        h, p = stats.kruskal(*arrays)
        eps2 = (h - k + 1) / (n_total - k) if n_total > k else 0.0
        emit(f"    Kruskal-Wallis: H={h:.3f}, df={k-1}, p={p:.4g}, "
             f"epsilon-kuadrat={eps2:.3f}")
        emit(f"      (dipakai karena {'normalitas' if not normal else ''}"
             f"{' dan ' if not normal and not homog else ''}"
             f"{'homogenitas varians' if not homog else ''} tidak terpenuhi)")
        sig = p < ALPHA
        if sig:
            pairs = list(itertools.combinations(range(k), 2))
            emit(f"    Post-hoc Mann-Whitney, koreksi Bonferroni "
                 f"(alpha={ALPHA}/{len(pairs)}={ALPHA/len(pairs):.4f}):")
            for i, j in pairs:
                _, pv = stats.mannwhitneyu(arrays[i], arrays[j],
                                           alternative="two-sided")
                mark = "signifikan" if pv < ALPHA / len(pairs) else "tidak signifikan"
                emit(f"      {labels[i]:8} vs {labels[j]:8} p={pv:.4g}  {mark}")

    if not sig:
        emit(f"    -> Tidak ada perbedaan signifikan antar {factor_name}.")


def main():
    if not os.path.exists(CSV_IN):
        sys.exit(f"{CSV_IN} tidak ada. Jalankan scripts/extract-metrics.py dulu.")

    data, rows = load()

    emit("# Hasil Analisis Statistik — mark0")
    emit()
    emit(f"Sumber: `results/metrics.csv` ({len(rows)} run)")
    emit(f"Taraf signifikansi: alpha = {ALPHA}")
    emit()

    # ---------- 1. Statistik deskriptif ----------
    emit("## 1. Statistik Deskriptif")
    for metric, label, kelompok in METRICS:
        emit()
        emit(f"### {label}  _({kelompok})_")
        emit()
        emit("| Strategi | Tier | n | Mean | SD | Min | Max | Median |")
        emit("|---|---|---|---|---|---|---|---|")
        for s in STRATEGIES:
            for t in TIERS:
                vals = data.get((s, t), {}).get(metric)
                if not vals:
                    continue
                d = describe(vals)
                emit(f"| {s.upper()} | {t} | {d['n']} | {d['mean']:.2f} | "
                     f"{d['sd']:.2f} | {d['min']:.2f} | {d['max']:.2f} | "
                     f"{d['median']:.2f} |")

    # ---------- 2. RQ1: pengaruh strategi rendering ----------
    emit()
    emit("## 2. RQ1 — Pengaruh Strategi Rendering (CSR vs SSG vs SSR)")
    emit()
    emit("Diuji terpisah pada setiap tier beban media, agar faktor media")
    emit("tidak mencemari perbandingan antar strategi.")
    for metric, label, _ in METRICS:
        emit()
        emit(f"### {label}")
        for t in TIERS:
            groups = [(s.upper(), data[(s, t)][metric])
                      for s in STRATEGIES
                      if (s, t) in data and metric in data[(s, t)]]
            if len(groups) < 2:
                continue
            emit(f"  tier {t}:")
            run_test(groups, "strategi rendering")

    # ---------- 3. RQ2: pengaruh beban media ----------
    emit()
    emit("## 3. RQ2 — Pengaruh Variasi Beban Media (light vs medium vs heavy)")
    emit()
    emit("Diuji terpisah pada setiap strategi rendering.")
    for metric, label, _ in METRICS:
        emit()
        emit(f"### {label}")
        for s in STRATEGIES:
            groups = [(t, data[(s, t)][metric])
                      for t in TIERS
                      if (s, t) in data and metric in data[(s, t)]]
            if len(groups) < 2:
                continue
            emit(f"  strategi {s.upper()}:")
            run_test(groups, "tier beban media")

    with open(MD_OUT, "w") as fh:
        fh.write("\n".join(out_lines) + "\n")
    print()
    print(f"Tersimpan juga ke {MD_OUT}")


if __name__ == "__main__":
    main()
