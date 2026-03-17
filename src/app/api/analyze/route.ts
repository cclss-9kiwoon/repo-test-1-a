import { NextRequest, NextResponse } from "next/server";
import { analyzeAnswers } from "@/lib/openai";

// In-memory store for MVP (replace with Supabase later)
const results = new Map<string, Record<string, unknown>>();

export function getResult(id: string) {
  return results.get(id);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, testTitle, questions } = body;

    if (!testId || !testTitle || !questions?.length) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다" },
        { status: 400 }
      );
    }

    const analysis = await analyzeAnswers(testTitle, questions);

    const id = crypto.randomUUID();
    const result = {
      id,
      testId,
      ...analysis,
      answers: Object.fromEntries(
        questions.map((q: { text: string; answer: string }) => [
          q.text,
          q.answer,
        ])
      ),
      createdAt: new Date().toISOString(),
    };

    results.set(id, result);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("분석 오류:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID가 필요합니다" }, { status: 400 });
  }

  const result = results.get(id);
  if (!result) {
    return NextResponse.json(
      { error: "결과를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
