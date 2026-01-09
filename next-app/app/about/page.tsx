"use client";
import { TopNav } from "../components/TopNav";

export default function Page() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl p-6 space-y-8">
        {/* サブタブのプレースホルダ */}
        <nav className="flex gap-4 bg-gray-100 p-2 rounded-md text-sm">
          <span className="bg-sky-200 text-sky-800 px-2 py-1 rounded">IsoLocateの使い方</span>
          <span className="px-2 py-1">集団説明</span>
          <span className="px-2 py-1">準備プロトコル</span>
          <span className="px-2 py-1">参考文献</span>
        </nav>

        {/* タイトルと概要 */}
        <h1 className="text-2xl font-bold">IsoLocateへようこそ</h1>
        <p>
          IsoLocateでは、線形判別関数解析（LDFAまたはLDA）、混合判別分析（MDA）、またはランダムフォレスト・モデリング（RFM）を用いて、
          コラーゲン、アパタイト、または歯のエナメルから採取された未知の安定同位体試料を複数の参照領域の1つに分類します。
          グラフィカルユーザーインターフェース（GUI）の基盤はRで開発されているため、出力や書式設定はこのプログラムの機能に依存します。
          このGUIはホストされているので、ローカルコンピュータにRを用意する必要はありません。
          基礎となるデータベースは継続的に更新されています。
          データの提供にご協力いただける場合は、プログラムのデータベースに追加し、貢献者としてお名前を掲載させていただきます。
          ぜひデータをご提供ください！データを送付いただける場合は、以下のフォーマットに従ってください。
        </p>
        <p className="font-mono">
          ID&nbsp;|&nbsp;地域&nbsp;|&nbsp;同位体源&nbsp;|&nbsp;d13C&nbsp;|&nbsp;d15N&nbsp;|&nbsp;d18O
        </p>

        {/* 解析セクション */}
        <section>
          <h2 className="text-xl font-semibold mt-4">解析</h2>
          <p>
            IsoLocateでは、LDA、MDA、またはRFMを使用して骨や歯の組織から得られた個々の安定同位体値を原産地の領域に分類します。
            また、確率密度関数（PDF）および尤度比（LR）を用いて、2つのグループ間の分類の強さを評価します。
            現在利用可能なステップワイズ手法は、klaRパッケージ（Weihs ら、2016）の関数「greedy.wilks」を使用した前方Wilks法のみです。
            前方Wilks法では、グループを最もよく区別する変数から始め、Wilksのラムダ基準に基づいて変数を順次追加します。
            標準的な前方および後方の変数選択もテストしましたが、パフォーマンスが低かったため本アプリケーションでは採用していません（Berg & Kenyhercz、2017）。
          </p>
        </section>

        {/* 名前とケース番号セクション */}
        <section>
          <h2 className="text-xl font-semibold mt-4">名前とケース番号</h2>
          <p>
            必要に応じて分析者の名前とケース番号を入力することができます。
            これらの情報は印刷レポートの出力に表示されます。
          </p>
        </section>

        {/* 比較セクション */}
        <section>
          <h2 className="text-xl font-semibold mt-4">比較</h2>
          <p>
            参照グループを選択するには、地域コードの左側にあるラジオボタンをクリックしてください（地域定義コードについては「地域説明」タブをご参照ください）。
            次に、「比較するグループ数を選択」のドロップダウンから「2グループ」または「2グループ以上」を選択します。
            Rでの判別関数分析の出力は比較するグループ数に依存します。
            「2グループ以上」を選択しておきながら実際には2グループのみを比較すると「次元数が不正です」というエラーが表示されます。
            必ずドロップダウンで適切なグループ数を選択してください。
          </p>
        </section>

        {/* データの比較セクション */}
        <section>
          <h2 className="text-xl font-semibold mt-4">データの比較</h2>
          <p>
            コラーゲン試料用、アパタイト試料用、歯のエナメル試料用の3つのテーブルがあります。
            各検体成分の抽出プロトコルについては「準備プロトコル」タブを参照してください。
            必要に応じて変数は何個でも入力できます。
            また、下記のステップワイズ選択を利用することも可能です。
          </p>
        </section>
      </main>
    </div>
  );
}
