"use client";

import { useState } from "react";
import { EvaluateResponse } from "../lib/types";
import { DataTable } from "./DataTable";

type TabKey = "results" | "matrix" | "plot" | "summary" | "details";

const TABS: { key: TabKey; label: string }[] = [
  { key: "results", label: "分類結果" },
  { key: "matrix", label: "分類行列" },
  { key: "plot", label: "分類プロット" },
  { key: "summary", label: "要約統計" },
  { key: "details", label: "モデル詳細" },
];

export function ResultsTabs({ data }: { data: EvaluateResponse | null }) {
  const [tab, setTab] = useState<TabKey>("results");

  return (
    <section>
      <div className="text-sm font-semibold text-slate-700 mb-2">結果と出力</div>

      <div className="rounded-md border bg-white">
        <div className="flex flex-wrap gap-1 border-b bg-slate-50 p-2">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "px-3 py-1.5 text-sm rounded",
                  active ? "bg-white border shadow-sm" : "text-slate-700 hover:bg-white/70",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {tab === "results" && (
            <>
              {!data ? (
                <div className="text-slate-500 text-sm">（評価ボタンを押すと結果を表示します）</div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-600">
                    モデル: {data.model.referenceSample} / {data.model.classifier} / ステップワイズ: {data.model.stepwise}
                  </div>
                  <DataTable rows={data.rows} />
                </div>
              )}
            </>
          )}

          {tab !== "results" && (
            <div className="text-slate-600 text-sm">
              ダミー：{TABS.find((x) => x.key === tab)?.label} の内容をここに表示（準備中）
            </div>
          )}
        </div>
      </div>
    </section>
  );
}