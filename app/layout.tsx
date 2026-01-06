import "./globals.css";

export const metadata = {
  title: "IsoLocate UI Mock",
  description: "UI scaffold with Tailwind + App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-slate-900">{children}</body>
    </html>
  );
}