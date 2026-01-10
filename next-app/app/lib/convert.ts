import type { EvaluateRequest } from "./types";

export function toAnalysisPayload(req: EvaluateRequest) {
  // 入力データ（解析対象となる値）
  const input_json = {
    caseNumber: req.caseNumber,
    analystName: req.analystName,
    elementSampled: req.elementSampled,
    isotopes: req.isotopes,
  };

  // 解析パラメータ（アルゴリズムや集団選択など）
  const params_json = {
    referenceSample: req.referenceSample,   // "modern" 固定であれば省略可
    numberOfGroups: req.numberOfGroups,
    classifier: req.classifier,
    stepwise: req.stepwise,
    populations: req.populations,
  };

  // 参照データセットID（modernデータセットに対応するUUIDを設定）
  const reference_dataset_id = process.env.NEXT_PUBLIC_REFERENCE_DATASET_ID!;
  return { input_json, params_json, reference_dataset_id };
}
