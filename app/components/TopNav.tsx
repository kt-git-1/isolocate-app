export function TopNav() {
  const items = [
    "入力",
    "集団定義",
    "レポート印刷",
    "相対尤度",
    "尤度レポート印刷",
    "このサイトについて",
    "ランダムフォレスト・モデリング(ベータ)",
  ];
  
    return (
    <header className="h-12 bg-sky-700 text-white">
      <div className="mx-auto max-w-6xl h-full px-4 flex items-center gap-5 text-sm">
        <div className="font-semibold tracking-wide">IsoLocate(モック)</div>
        <nav className="flex items-center gap-4 opacity-95">
          {items.map((x) => (
            <span key={x} className="cursor-default whitespace-nowrap">
              {x}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}