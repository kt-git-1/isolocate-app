import type { EvaluateRequest } from "./types";

/**
 * EvaluateRequestからinput_jsonとparams_jsonに変換する（純粋な変換関数）
 * 注意: reference_dataset_idはAPIルート内で取得する必要があります
 */
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

  return { input_json, params_json };
}
