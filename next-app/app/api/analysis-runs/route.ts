import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query } from '../../lib/db';
import { toAnalysisPayload } from '../../lib/convert';
import type { EvaluateRequest } from '../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // リクエスト形式を確認（新しい形式: { request: EvaluateRequest } または旧形式: { input_json, params_json, reference_dataset_id }）
    let input_json, params_json, reference_dataset_id;
    
    if (body.request) {
      // 新しい形式: EvaluateRequestから変換
      const payload = await toAnalysisPayload(body.request as EvaluateRequest);
      input_json = payload.input_json;
      params_json = payload.params_json;
      reference_dataset_id = payload.reference_dataset_id;
    } else {
      // 旧形式: 直接指定
      input_json = body.input_json;
      params_json = body.params_json;
      reference_dataset_id = body.reference_dataset_id;
    }
    
    // バリデーション
    if (!input_json || typeof input_json !== 'object') {
      return NextResponse.json(
        { error: 'input_jsonが必要です' },
        { status: 400 }
      );
    }
    if (!params_json || typeof params_json !== 'object') {
      return NextResponse.json(
        { error: 'params_jsonが必要です' },
        { status: 400 }
      );
    }
    if (!reference_dataset_id || typeof reference_dataset_id !== 'string') {
      return NextResponse.json(
        { error: 'reference_dataset_idが必要です' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    await query(
      `INSERT INTO analysis_run (id, status, input_json, params_json, reference_dataset_id, created_at)
         VALUES ($1, 'queued', $2::jsonb, $3::jsonb, $4, $5)`,
      [id, JSON.stringify(input_json), JSON.stringify(params_json), reference_dataset_id, now]
    );

    return NextResponse.json({ id, status: 'queued' }, { status: 201 });
  } catch (error) {
    console.error('分析実行の作成エラー:', error);
    const errorMessage = error instanceof Error ? error.message : '分析実行の作成に失敗しました';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
