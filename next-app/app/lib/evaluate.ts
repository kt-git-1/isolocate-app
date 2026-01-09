import { EvaluateRequest, EvaluateResponse } from "./types";
import { makeDummyResponse } from "./dummy";

export async function evaluate(req: EvaluateRequest): Promise<EvaluateResponse> {
  // 将来：ここを DB検索 + 計算ロジック に置換する
  // 例）Prismaで参照集団を取得 → 前処理 → LDA/Logit/RF → 結果生成

  // いまはダミー
  return makeDummyResponse(req);
}