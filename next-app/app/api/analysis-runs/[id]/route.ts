import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: '有効なIDが必要です' },
        { status: 400 }
      );
    }

    const runs = await query(
      `SELECT id, status, result_json, error_message FROM analysis_run WHERE id = $1`,
      [id]
    );

    if (runs.length === 0) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    const run = runs[0];
    return NextResponse.json(run);
  } catch (error) {
    console.error('分析実行の取得エラー:', error);
    return NextResponse.json(
      { error: '分析実行の取得に失敗しました' },
      { status: 500 }
    );
  }
}
