"use client";
import { TopNav } from "../components/TopNav";

export default function Page() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-xl font-bold">レポート印刷</h1>
        <p>このページはレポート印刷の内容を表示する予定です。</p>
      </main>
    </div>
  );
}