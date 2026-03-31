import { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://your-backend.vercel.app";

export interface GenResult {
  imageBase64: string;
  imageUri: string;
  provider: "gemini" | "segmind";
}

export function useImageGen() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [result, setResult] = useState<GenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Permission to access gallery is required.");
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: false,
    });

    if (!picked.canceled && picked.assets[0]) {
      setSourceImage(picked.assets[0].uri);
      setResult(null);
      setError(null);
    }
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setError("Camera permission is required.");
      return;
    }

    const photo = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: false,
    });

    if (!photo.canceled && photo.assets[0]) {
      setSourceImage(photo.assets[0].uri);
      setResult(null);
      setError(null);
    }
  }

  async function generate(style: string): Promise<GenResult | null> {
    if (!sourceImage) {
      return null;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imageBase64 = await FileSystem.readAsStringAsync(sourceImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const lowerUri = sourceImage.toLowerCase();
      const mimeType = lowerUri.endsWith(".png") ? "image/png" : "image/jpeg";

      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType, style }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      const resultUri = `${FileSystem.cacheDirectory}clipart_result_${Date.now()}.jpg`;
      await FileSystem.writeAsStringAsync(resultUri, data.imageBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const nextResult: GenResult = {
        imageBase64: data.imageBase64,
        imageUri: resultUri,
        provider: data.provider,
      };

      setResult(nextResult);
      return nextResult;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    sourceImage,
    result,
    loading,
    error,
    pickImage,
    takePhoto,
    generate,
  };
}

