import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function analyzeAnswers(
  testTitle: string,
  questions: { text: string; answer: string }[]
): Promise<{
  personalitySummary: string;
  relationshipStyle: string;
  loveStyle: string;
  rarityScore: number;
  rarityLabel: string;
  oneLineSummary: string;
  typeName: string;
  traits: string[];
}> {
  const answersText = questions
    .map((q) => `질문: ${q.text}\n답변: ${q.answer}`)
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `너는 심리 테스트 분석 전문가다. 사용자의 답변을 분석하여 JSON 형식으로 결과를 반환해라.
반드시 아래 JSON 형식으로만 응답해라:
{
  "personalitySummary": "핵심 성격 요약 (2-3문장)",
  "relationshipStyle": "인간관계 스타일 (1-2문장)",
  "loveStyle": "연애 성향 (1-2문장)",
  "rarityScore": 숫자(1-100),
  "rarityLabel": "일반적" | "조금 독특" | "매우 독특",
  "oneLineSummary": "공유용 한 줄 요약",
  "typeName": "유형 이름 (예: 숲속 관찰자)",
  "traits": ["특성1", "특성2", "특성3", "특성4"]
}`,
      },
      {
        role: "user",
        content: `다음은 "${testTitle}" 심리 테스트의 사용자 답변이다. 분석하여 결과를 작성해라.\n\n${answersText}`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI 응답이 없습니다");
  }

  return JSON.parse(content);
}
