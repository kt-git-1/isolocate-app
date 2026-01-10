import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { toAnalysisPayload } from '../../lib/convert';
import type { EvaluateRequest } from '../../lib/types';

// db.tsを動的インポートにして、pgモジュールをビルド時に解決しないようにする
async function getQuery() {
  const { query } = await import('../../lib/db');
  return query;
}

/**
 * 参照データセットIDを取得する（データベースから取得、または環境変数から取得）
 */
async function getReferenceDatasetId(name: string = "modern"): Promise<string> {
  // まず環境変数を確認
  const envId = process.env.REFERENCE_DATASET_ID;
  if (envId) {
    console.log('環境変数から参照データセットIDを取得しました:', envId);
    return envId;
  }
  
  // データベースから取得を試みる
  try {
    console.log(`データベースから参照データセット "${name}" を検索します`);
    const query = await getQuery();
    const datasets = await query<{ id: string }>(
      `SELECT id FROM reference_dataset WHERE name = $1 LIMIT 1`,
      [name]
    );
    console.log('検索結果:', datasets);
    if (datasets.length > 0) {
      console.log('参照データセットIDを取得しました:', datasets[0].id);
      return datasets[0].id;
    }
    console.warn(`参照データセット "${name}" がデータベースに見つかりませんでした`);
  } catch (error) {
    console.error('参照データセットの取得に失敗しました:', error);
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
      console.error('エラースタック:', error.stack);
    }
    throw error;
  }
  
  throw new Error(`参照データセット "${name}" が見つかりません。REFERENCE_DATASET_ID環境変数を設定するか、データベースに参照データセットを登録してください。`);
}

export async function POST(request: NextRequest) {
  try {
    console.log('APIリクエストを受信しました');
    const body = await request.json();
    console.log('リクエストボディ:', JSON.stringify(body, null, 2));
    
    // リクエスト形式を確認（新しい形式: { request: EvaluateRequest } または旧形式: { input_json, params_json, reference_dataset_id }）
    let input_json, params_json, reference_dataset_id;
    
    if (body.request) {
      // 新しい形式: EvaluateRequestから変換
      console.log('EvaluateRequestから変換を開始します');
      const payload = toAnalysisPayload(body.request as EvaluateRequest);
      console.log('変換結果:', payload);
      input_json = payload.input_json;
      params_json = payload.params_json;
      // 参照データセットIDを取得
      reference_dataset_id = await getReferenceDatasetId(body.request.referenceSample || "modern");
      console.log('参照データセットID:', reference_dataset_id);
    } else {
      // 旧形式: 直接指定
      input_json = body.input_json;
      params_json = body.params_json;
      reference_dataset_id = body.reference_dataset_id;
    }
    
    // バリデーション
    if (!input_json || typeof input_json !== 'object') {
      console.error('バリデーションエラー: input_jsonが必要です');
      return NextResponse.json(
        { error: 'input_jsonが必要です' },
        { status: 400 }
      );
    }
    if (!params_json || typeof params_json !== 'object') {
      console.error('バリデーションエラー: params_jsonが必要です');
      return NextResponse.json(
        { error: 'params_jsonが必要です' },
        { status: 400 }
      );
    }
    if (!reference_dataset_id || typeof reference_dataset_id !== 'string') {
      console.error('バリデーションエラー: reference_dataset_idが必要です', reference_dataset_id);
      return NextResponse.json(
        { error: 'reference_dataset_idが必要です' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    console.log('データベースに挿入を開始します:', { id, reference_dataset_id });
    const query = await getQuery();
    await query(
      `INSERT INTO analysis_run (id, status, input_json, params_json, reference_dataset_id, created_at)
         VALUES ($1, 'queued', $2::jsonb, $3::jsonb, $4, $5)`,
      [id, JSON.stringify(input_json), JSON.stringify(params_json), reference_dataset_id, now]
    );
    console.log('データベースへの挿入が完了しました:', id);

    return NextResponse.json({ id, status: 'queued' }, { status: 201 });
  } catch (error) {
    console.error('分析実行の作成エラー:', error);
    const errorMessage = error instanceof Error ? error.message : '分析実行の作成に失敗しました';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('エラースタック:', errorStack);
    return NextResponse.json(
      { error: errorMessage, details: errorStack },
      { status: 500 }
    );
  }
}
