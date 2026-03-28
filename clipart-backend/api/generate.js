module.exports = async function handler(req, res) {
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
    cartoon:
      "cartoon clipart style, bold outlines, flat colors, disney-like, vibrant, sticker",
    anime:
      "anime style portrait, studio ghibli, cel shading, vibrant colors, japanese illustration",
    sketch:
      "pencil sketch, black and white, detailed line art, hand drawn, monochrome",
    pixel:
      "pixel art, 16-bit retro game style, pixelated, limited color palette",
    flat:
      "flat vector illustration, minimal, geometric shapes, clean modern design",
  };

  const prompt = stylePrompts[style];
  if (!prompt) return res.status(400).json({ error: "Invalid style" });

  try {
    const imageData = imageBase64.startsWith("data:image")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const response = await fetch(
      "https://api.segmind.com/v1/sd1.5-img2img",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.SEGMIND_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
          prompt,
          negative_prompt: "blurry, low quality, distorted, ugly",
          samples: 1,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          strength: 0.75,
          img_width: 512,
          img_height: 512,
          base64: true,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const data = await response.json();
    return res.json({ image: data.image });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
