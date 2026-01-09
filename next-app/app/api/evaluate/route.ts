import { NextResponse } from "next/server";
import { evaluate } from "../../lib/evaluate";
import { EvaluateRequest } from "../../lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as EvaluateRequest;
  const result = await evaluate(body);
  return NextResponse.json(result);
}