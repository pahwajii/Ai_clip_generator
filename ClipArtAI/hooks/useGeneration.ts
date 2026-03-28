import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateClipart } from "../services/api";
import { type ClipartStyle } from "../constants/styles";

type StyleId = ClipartStyle["id"];

export function useGeneration() {
  const isMountedRef = useRef(true);
  const [result, setResult] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<StyleId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateIfMounted = useCallback((updater: () => void) => {
    if (isMountedRef.current) {
      updater();
    }
  }, []);

  const generateStyle = useCallback(
    async (imageBase64: string, styleId: StyleId) => {
      updateIfMounted(() => {
        setSelectedStyleId(styleId);
        setIsGenerating(true);
        setResult(null);
        setError(null);
        setLoading(true);
      });

      try {
        const nextResult = await generateClipart(imageBase64, styleId);
        updateIfMounted(() => {
          setResult(nextResult);
        });
      } catch (nextError) {
        console.error(`Failed to generate ${styleId}`, nextError);
        updateIfMounted(() => {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Generation failed. Try again."
          );
        });
      } finally {
        updateIfMounted(() => {
          setLoading(false);
          setIsGenerating(false);
        });
      }
    },
    [updateIfMounted]
  );

  return useMemo(
    () => ({
      result,
      selectedStyleId,
      loading,
      error,
      isGenerating,
      generateStyle,
    }),
    [error, generateStyle, isGenerating, loading, result, selectedStyleId]
  );
}
