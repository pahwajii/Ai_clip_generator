import { InferenceClient } from "@huggingface/inference";

const STYLE_PROMPTS: Record<string, string> = {
  cartoon:
    "Transform this image into vibrant cartoon clipart with bold outlines, vivid colors, and a clean Disney/Pixar-inspired illustration look. Keep the subject recognizable.",
  anime:
    "Transform this image into anime-style artwork with expressive linework, soft shading, and Studio Ghibli-inspired visual treatment. Keep the subject recognizable.",
  sketch:
    "Transform this image into a detailed pencil sketch with black-and-white tones, hand-drawn lines, and subtle cross-hatching. Keep the subject recognizable.",
  pixel:
    "Transform this image into retro 16-bit pixel art with a limited palette, crisp pixel edges, and classic game-art styling. Keep the subject recognizable.",
  flat:
    "Transform this image into flat vector-style illustration with minimal shapes, solid colors, and clean modern design. Keep the subject recognizable.",
};

export async function generateWithHuggingFace(
  imageBase64: string,
  style: string
): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY not set");
  }

  const model =
    process.env.HUGGINGFACE_MODEL ?? "black-forest-labs/FLUX.1-Kontext-dev";
  const provider =
    (process.env.HUGGINGFACE_PROVIDER as
      | Parameters<InferenceClient["imageToImage"]>[0]["provider"]
      | undefined) ?? "auto";
  const prompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.cartoon;
  const client = new InferenceClient(apiKey);
  const normalized = imageBase64.includes(",")
    ? imageBase64.split(",").pop() ?? ""
    : imageBase64;
  const imageBlob = new Blob([Buffer.from(normalized, "base64")], {
    type: "image/jpeg",
  });

  const outputBlob = await client.imageToImage({
    provider,
    model,
    inputs: imageBlob,
    parameters: {
      prompt,
      negative_prompt: "blurry, low quality, distorted, ugly, watermark",
      guidance_scale: 7.5,
      num_inference_steps: 25,
      target_size: {
        width: 1024,
        height: 1024,
      },
    },
  });

  return Buffer.from(await outputBlob.arrayBuffer()).toString("base64");
}
