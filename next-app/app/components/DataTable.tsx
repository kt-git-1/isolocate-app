import { PosteriorRow } from "../lib/types";
import { POP_LABELS } from "../lib/labels";

function pct(x: number) {
  return `${(x * 100).toFixed(1)}%`;
}

export function DataTable({ rows }: { rows: PosteriorRow[] }) {
  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-700">
            <th className="px-3 py-2 border-b">グループ</th>
            <th className="px-3 py-2 border-b">事後確率</th>
            <th className="px-3 py-2 border-b">カイ二乗適合度</th>
            <th className="px-3 py-2 border-b">距離</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.group} className="hover:bg-slate-50">
              <td className="px-3 py-2 border-b">{POP_LABELS[r.group]}</td>
              <td className="px-3 py-2 border-b font-medium">{pct(r.posterior)}</td>
              <td className="px-3 py-2 border-b">{pct(r.chi2Typicality)}</td>
              <td className="px-3 py-2 border-b">{r.distance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}