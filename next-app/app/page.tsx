"use client";

import { useState } from "react";
import { TopNav } from "./components/TopNav";
import { ComparisonSidebar } from "./components/ComparisonSidebar";
import { CaseHeader } from "./components/CaseHeader";
import { IsotopeInputs } from "./components/IsotopeInputs";
import { EvaluateRequest } from "./lib/types";
import { useRouter } from "next/navigation";

const initial: EvaluateRequest = {
  caseNumber: "",
  analystName: "",
  elementSampled: "",

  referenceSample: "modern",
  numberOfGroups: "more2",
  classifier: "lda",
  stepwise: "none",
  populations: ["Japan", "SEA", "US"],

  isotopes: {
    collagen: { col13c: 0, col15n: 0, col34s: 0 },
    apatite: { a13c: 0, a18o: 0 },
    enamel: { e13c: 0, e18o: 0 },
  },
};

export default function Page() {
  const [form, setForm] = useState<EvaluateRequest>(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const onEvaluate = async () => {
    console.log('評価ボタンがクリックされました', form);
    setLoading(true);
    try {
      const res = await fetch("/api/analysis-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: form }),
      });
      
      console.log('APIレスポンス:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('APIエラー:', errorData);
        throw new Error(errorData.error || `APIエラー: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('APIレスポンスデータ:', data);
      
      if (!data.id) {
        throw new Error('レスポンスにIDが含まれていません');
      }
      
      router.push(`/runs/${data.id}`);
    } catch (error) {
      console.error('分析実行の作成エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '分析実行の作成に失敗しました';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-6xl p-6 grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <ComparisonSidebar value={form} onChange={setForm} onEvaluate={onEvaluate} loading={loading} />
        </div>

        <div className="col-span-8 space-y-6">
          <CaseHeader value={form} onChange={setForm} />
          <IsotopeInputs value={form} onChange={setForm} />
        </div>
      </main>
    </div>
  );
}