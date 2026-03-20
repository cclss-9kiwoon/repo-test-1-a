import { generateBlogContent, regenerateBlogContent } from "./writer.js";
import { generateImage } from "./image.js";
import type { UserInput, ContentDraft } from "../types.js";

export async function generateDraft(input: UserInput): Promise<ContentDraft> {
  const [content, image] = await Promise.all([
    generateBlogContent(input),
    // 첫 생성 시에는 주제 기반으로 이미지 생성
    generateImage(input.topic),
  ]);

  return { content, image };
}

export async function regenerateContent(
  input: UserInput,
  feedback: string,
  currentDraft: ContentDraft
): Promise<ContentDraft> {
  const content = await regenerateBlogContent(input, feedback);
  return { content, image: currentDraft.image };
}

export async function regenerateImageOnly(
  currentDraft: ContentDraft
): Promise<ContentDraft> {
  const image = await generateImage(currentDraft.content.summary);
  return { content: currentDraft.content, image };
}
