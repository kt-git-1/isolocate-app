"use client";
import { TopNav } from "../components/TopNav";

export default function Page() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-xl font-bold">集団定義</h1>
        <p>このページは集団定義の内容を表示する予定です。</p>
      </main>
    </div>
  );
}
