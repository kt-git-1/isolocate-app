import { NextRequest, NextResponse } from 'next/server';

// db.tsを動的インポートにして、pgモジュールをビルド時に解決しないようにする
async function getQuery() {
  const { query } = await import('../../../lib/db');
  return query;
}

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

    const query = await getQuery();
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
