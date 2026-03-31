import { GoogleGenerativeAI } from "@google/generative-ai";

const STYLE_PROMPTS: Record<string, string> = {
  cartoon:
    "Transform this image into a vibrant cartoon style with thick outlines and vivid colors, like a Disney or Pixar animation. Keep the subject recognizable.",
  anime:
    "Transform this image into anime style, inspired by Studio Ghibli. Add soft shading, expressive features, and detailed linework.",
  sketch:
    "Transform this image into a detailed pencil sketch. Use black and white tones with hand-drawn lines and cross-hatching for shading.",
  pixel:
    "Transform this image into 16-bit pixel art. Use a limited color palette with sharp, visible pixels in a retro game style.",
  flat:
    "Transform this image into a flat design illustration. Use minimal shapes, solid colors, clean outlines, and a modern vector art style.",
};

type GeminiPart = {
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
};

export async function generateWithGemini(
  imageBase64: string,
  mimeType: string,
  style: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    } as any,
  });

  const prompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.cartoon;
  const result = await model.generateContent([
    { inlineData: { mimeType, data: imageBase64 } },
    { text: prompt },
  ]);

  const parts = (result.response.candidates?.[0]?.content?.parts ?? []) as GeminiPart[];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
      return part.inlineData.data;
    }
  }

  throw new Error("Gemini returned no image part");
}
