import { generateImage } from "../lib/router";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64, mimeType, style } = req.body ?? {};

  if (!imageBase64 || !mimeType || !style) {
    return res.status(400).json({
      error: "Missing required fields: imageBase64, mimeType, style",
    });
  }

  try {
    const result = await generateImage(imageBase64, mimeType, style);
    return res.status(200).json({
      imageBase64: result.imageBase64,
      provider: result.provider,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed";

    return res.status(500).json({ error: message });
  }
}
