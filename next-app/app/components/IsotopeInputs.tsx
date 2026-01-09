"use client";

import { EvaluateRequest } from "../lib/types";

function Section({
  title,
  cols,
  values,
  onChange,
}: {
  title: string;
  cols: { key: string; label: string }[];
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="font-semibold text-slate-700">{title}</div>
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-2 text-xs text-slate-600 pb-2">入力値</div>
        {cols.map((c) => (
          <div key={c.key} className="col-span-3">
            <div className="text-[11px] text-slate-600 mb-1">{c.label}</div>
            <input
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={values[c.key] ?? ""}
              onChange={(e) => onChange({ ...values, [c.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function IsotopeInputs({
  value,
  onChange,
}: {
  value: EvaluateRequest;
  onChange: (next: EvaluateRequest) => void;
}) {
  return (
    <section className="rounded-md border bg-white p-4 space-y-4">
      <Section
        title="コラーゲン"
        cols={[
          { key: "col13c", label: "Col13C" },
          { key: "col15n", label: "Col15N" },
          { key: "col34s", label: "Col34S" },
        ]}
        values={value.isotopes.collagen}
        onChange={(next) => onChange({ ...value, isotopes: { ...value.isotopes, collagen: next as any } })}
      />

      <Section
        title="アパタイト"
        cols={[
          { key: "a13c", label: "A13C" },
          { key: "a18o", label: "A18O" },
        ]}
        values={value.isotopes.apatite}
        onChange={(next) => onChange({ ...value, isotopes: { ...value.isotopes, apatite: next as any } })}
      />

      <Section
        title="エナメル"
        cols={[
          { key: "e13c", label: "E13C" },
          { key: "e18o", label: "E18O" },
        ]}
        values={value.isotopes.enamel}
        onChange={(next) => onChange({ ...value, isotopes: { ...value.isotopes, enamel: next as any } })}
      />
    </section>
  );
}