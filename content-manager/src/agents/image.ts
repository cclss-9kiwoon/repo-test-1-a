import OpenAI from "openai";
import { config } from "../config.js";
import type { GeneratedImage } from "../types.js";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export async function generateImage(summary: string): Promise<GeneratedImage> {
  const prompt = `A clean, modern blog header illustration for the following topic: ${summary}. Style: minimal, professional, vibrant colors, suitable for a blog post.`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1792x1024",
  });

  const url = response.data?.[0]?.url;
  if (!url) throw new Error("Image Agent: 이미지 URL을 받지 못했습니다.");

  return { url, prompt };
}
