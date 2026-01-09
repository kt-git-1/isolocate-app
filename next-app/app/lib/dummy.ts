import { EvaluateRequest, EvaluateResponse, PopGroup, PosteriorRow } from "./types";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function makeDummyResponse(req: EvaluateRequest): EvaluateResponse {
  const pops = (req.populations.length ? req.populations : ["Japan", "SEA", "US"]) as PopGroup[];

  // ダミー確率を適当に作って正規化
  const raw = pops.map(() => Math.random() + 0.2);
  const sum = raw.reduce((a, b) => a + b, 0);

  const rows: PosteriorRow[] = pops.map((g, i) => ({
    group: g,
    posterior: clamp01(raw[i] / sum),
    chi2Typicality: clamp01(0.2 + Math.random() * 0.8),
    distance: Number((0.8 + Math.random() * 3.2).toFixed(2)),
  }));

  // posterior降順
  rows.sort((a, b) => b.posterior - a.posterior);

  return {
    ok: true,
    model: {
      referenceSample: "Modern Isotopic Dataset",
      classifier: req.classifier.toUpperCase(),
      stepwise: req.stepwise,
    },
    rows,
  };
}