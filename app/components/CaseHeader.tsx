"use client";

import { EvaluateRequest } from "../lib/types";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs text-slate-600 mb-1">{label}</div>
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function CaseHeader({
  value,
  onChange,
}: {
  value: EvaluateRequest;
  onChange: (next: EvaluateRequest) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Field label="ケース番号" value={value.caseNumber} onChange={(v) => onChange({ ...value, caseNumber: v })} />
      <Field
        label="分析担当者名"
        value={value.analystName}
        onChange={(v) => onChange({ ...value, analystName: v })}
      />
      <Field
        label="分析対象元素"
        value={value.elementSampled}
        onChange={(v) => onChange({ ...value, elementSampled: v })}
      />
    </div>
  );
}