const STYLE_MODELS: Record<string, string> = {
  cartoon: "sdxl-img2img",
  anime: "anime-diffusion",
  sketch: "sdxl-img2img",
  pixel: "sdxl-img2img",
  flat: "sdxl-img2img",
};

const STYLE_PROMPTS: Record<string, string> = {
  cartoon:
    "cartoon style, vibrant colors, thick outlines, Disney/Pixar look, high quality",
  anime:
    "anime style, Studio Ghibli inspired, soft shading, detailed, high quality",
  sketch:
    "pencil sketch, black and white, hand drawn lines, detailed sketch art",
  pixel:
    "pixel art style, 16-bit retro game art, sharp pixels, limited palette",
  flat:
    "flat design illustration, minimal, clean shapes, solid colors, modern vector style",
};

export async function generateWithSegmind(
  imageBase64: string,
  style: string
): Promise<string> {
  const apiKey = process.env.SEGMIND_API_KEY;
  if (!apiKey) {
    throw new Error("SEGMIND_API_KEY not set");
  }

  const model = STYLE_MODELS[style] ?? "sdxl-img2img";
  const prompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.cartoon;

  const response = await fetch(`https://api.segmind.com/v1/${model}`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
      negative_prompt: "blurry, low quality, distorted, ugly, watermark",
      samples: 1,
      num_inference_steps: 25,
      guidance_scale: 7.5,
      strength: 0.7,
      base64: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Segmind error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as { image?: string };
  if (!data.image) {
    throw new Error("No image in Segmind response");
  }

  return data.image;
}
