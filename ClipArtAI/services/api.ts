const BACKEND_URL = "https://ai-clip-generator-two.vercel.app/api/generate";
const REQUEST_TIMEOUT_MS = 90000;

export async function generateClipart(
  imageBase64: string,
  style: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ imageBase64, style }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Generation failed with status ${response.status}${errorText ? `: ${errorText}` : ""}`
      );
    }

    const data = await response.json();
    if (!data?.image) {
      throw new Error("Generation succeeded but no image was returned.");
    }

    return `data:image/png;base64,${data.image}`;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The request timed out while waiting for the backend.");
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Network request failed before the backend responded. Check phone internet access and whether the Vercel endpoint is reachable."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Generation failed.");
  } finally {
    clearTimeout(timeoutId);
  }
}
