import { generateWithGemini } from "./gemini";
import { generateWithSegmind } from "./segmind";

export type Provider = "gemini" | "segmind";

export interface GenerateResult {
  imageBase64: string;
  provider: Provider;
}

export async function generateImage(
  imageBase64: string,
  mimeType: string,
  style: string
): Promise<GenerateResult> {
  if (process.env.GEMINI_API_KEY) {
    const geminiImage = await generateWithGemini(imageBase64, mimeType, style);
    return { imageBase64: geminiImage, provider: "gemini" };
  }

  if (!process.env.SEGMIND_API_KEY) {
    throw new Error("No image provider configured. Set GEMINI_API_KEY or SEGMIND_API_KEY.");
  }

  const segmindImage = await generateWithSegmind(imageBase64, style);
  return { imageBase64: segmindImage, provider: "segmind" };
}
