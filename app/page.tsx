"use client";

import { useState } from "react";
import { TopNav } from "./components/TopNav";
import { ComparisonSidebar } from "./components/ComparisonSidebar";
import { CaseHeader } from "./components/CaseHeader";
import { IsotopeInputs } from "./components/IsotopeInputs";
import { ResultsTabs } from "./components/ResultsTabs";
import { EvaluateRequest, EvaluateResponse } from "./lib/types";

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
    collagen: { col13c: "", col15n: "", col34s: "" },
    apatite: { a13c: "", a18o: "" },
    enamel: { e13c: "", e18o: "" },
  },
};

export default function Page() {
  const [form, setForm] = useState<EvaluateRequest>(initial);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EvaluateResponse | null>(null);

  const onEvaluate = async () => {
    setLoading(true);
    setData(null);

    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = (await res.json()) as EvaluateResponse;
    setData(json);
    setLoading(false);
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
          <ResultsTabs data={data} />
        </div>
      </main>
    </div>
  );
}