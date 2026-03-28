export default async function handler(req, res) {
  // Allow requests from your app
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { imageBase64, style } = req.body;
  if (!imageBase64 || !style) {
    return res.status(400).json({ error: "Missing imageBase64 or style" });
  }

  const stylePrompts = {
    cartoon: "cartoon clipart style, bold outlines, flat colors, disney-like, vibrant",
    anime: "anime style portrait, studio ghibli, soft shading, japanese illustration",
    sketch: "pencil sketch, black and white, detailed line art, hand drawn portrait",
    pixel: "pixel art, 16-bit retro game style, pixelated portrait",
    flat: "flat illustration, minimal vector art style, clean geometric shapes",
  };

  const prompt = stylePrompts[style];
  if (!prompt) return res.status(400).json({ error: "Invalid style" });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            prompt,
            image: imageBase64,
            strength: 0.75,
            num_inference_steps: 30,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return res.json({ image: base64 });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}