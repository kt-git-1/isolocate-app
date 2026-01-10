import type { EvaluateRequest } from "./types";
import { query } from "./db";

/**
 * 参照データセットIDを取得する（データベースから取得、または環境変数から取得）
 */
async function getReferenceDatasetId(name: string = "modern"): Promise<string> {
  // まず環境変数を確認
  const envId = process.env.REFERENCE_DATASET_ID;
  if (envId) {
    return envId;
  }
  
  // データベースから取得を試みる
  try {
    const datasets = await query<{ id: string }>(
      `SELECT id FROM reference_dataset WHERE name = $1 LIMIT 1`,
      [name]
    );
    if (datasets.length > 0) {
      return datasets[0].id;
    }
  } catch (error) {
    console.warn('参照データセットの取得に失敗しました:', error);
  }
  
  throw new Error(`参照データセット "${name}" が見つかりません。REFERENCE_DATASET_ID環境変数を設定するか、データベースに参照データセットを登録してください。`);
}

export async function toAnalysisPayload(req: EvaluateRequest) {
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
  // 注意: この関数はサーバーサイドでのみ使用されるべきです
  const reference_dataset_id = await getReferenceDatasetId(req.referenceSample);
  return { input_json, params_json, reference_dataset_id };
}
