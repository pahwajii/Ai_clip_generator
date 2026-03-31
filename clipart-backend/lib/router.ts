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
    try {
      const geminiImage = await generateWithGemini(imageBase64, mimeType, style);
      return { imageBase64: geminiImage, provider: "gemini" };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Gemini error";
      console.warn("Gemini failed, falling back to Segmind:", message);
    }
  }

  const segmindImage = await generateWithSegmind(imageBase64, style);
  return { imageBase64: segmindImage, provider: "segmind" };
}
