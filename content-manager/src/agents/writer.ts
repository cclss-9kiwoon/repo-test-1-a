import OpenAI from "openai";
import { config } from "../config.js";
import type { UserInput, BlogContent } from "../types.js";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

const SYSTEM_PROMPT = `당신은 전문 블로그 작가입니다. 사용자가 제공하는 주제, 느낀점, 키워드를 바탕으로 유용한 정보를 전달하는 블로그 글을 작성합니다.

규칙:
- 독자에게 실질적으로 도움이 되는 정보 중심으로 작성
- 친근하지만 전문적인 어조
- 마크다운 형식으로 본문 작성 (## 소제목, 리스트, 볼드 등 활용)
- 본문은 800~1500자 내외

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "블로그 제목",
  "body": "마크다운 형식의 본문",
  "summary": "2줄 이내 요약",
  "hashtags": ["태그1", "태그2", "태그3"]
}`;

export async function generateBlogContent(
  input: UserInput
): Promise<BlogContent> {
  const userMessage = buildUserMessage(input);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const raw = response.choices[0].message.content;
  if (!raw) throw new Error("Writer Agent: 빈 응답을 받았습니다.");

  return JSON.parse(raw) as BlogContent;
}

export async function regenerateBlogContent(
  input: UserInput,
  feedback: string
): Promise<BlogContent> {
  const userMessage = buildUserMessage(input);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
      {
        role: "user",
        content: `이전 글에 대한 수정 요청입니다: ${feedback}\n\n위 피드백을 반영해서 다시 작성해주세요. 동일한 JSON 형식으로 응답하세요.`,
      },
    ],
  });

  const raw = response.choices[0].message.content;
  if (!raw) throw new Error("Writer Agent: 빈 응답을 받았습니다.");

  return JSON.parse(raw) as BlogContent;
}

function buildUserMessage(input: UserInput): string {
  let message = `주제: ${input.topic}`;
  if (input.feelings) message += `\n오늘 느낀점: ${input.feelings}`;
  if (input.keywords?.length)
    message += `\n키워드: ${input.keywords.join(", ")}`;
  return message;
}
