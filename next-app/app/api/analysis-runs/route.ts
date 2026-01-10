import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query } from '../../lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // バリデーション（省略）
  const id = randomUUID();
  const now = new Date().toISOString();

  await query(
    `INSERT INTO analysis_run (id, status, input_json, params_json, reference_dataset_id, created_at)
       VALUES ($1, 'queued', $2, $3, $4, $5)`,
    [id, body.input_json, body.params_json, body.reference_dataset_id, now]
  );

  return NextResponse.json({ id, status: 'queued' }, { status: 201 });
}
