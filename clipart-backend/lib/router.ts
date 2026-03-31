import { generateWithHuggingFace } from "./huggingface";
import { generateWithGemini } from "./gemini";
import { generateWithSegmind } from "./segmind";

export type Provider = "huggingface" | "gemini" | "segmind";

export interface GenerateResult {
  imageBase64: string;
  provider: Provider;
}

export async function generateImage(
  imageBase64: string,
  mimeType: string,
  style: string
): Promise<GenerateResult> {
  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      const huggingFaceImage = await generateWithHuggingFace(imageBase64, style);
      return { imageBase64: huggingFaceImage, provider: "huggingface" };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Hugging Face error";
      console.warn("Hugging Face failed, falling back to Gemini:", message);
    }
  }

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

  if (!process.env.SEGMIND_API_KEY) {
    throw new Error(
      "No image provider configured. Set HUGGINGFACE_API_KEY, GEMINI_API_KEY, or SEGMIND_API_KEY."
    );
  }

  const segmindImage = await generateWithSegmind(imageBase64, style);
  return { imageBase64: segmindImage, provider: "segmind" };
}
