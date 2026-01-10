import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const runs = await query(
    `SELECT id, status, result_json, error_message FROM analysis_run WHERE id = $1`,
    [id]
  );

  if (runs.length === 0) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const run = runs[0];
  return NextResponse.json(run);
}
