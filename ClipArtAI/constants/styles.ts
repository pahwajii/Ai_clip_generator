export type ClipartStyle = {
  id: "cartoon" | "anime" | "sketch" | "pixel" | "flat";
  label: string;
  emoji: string;
  color: string;
};

export const CLIPART_STYLES: ClipartStyle[] = [
  { id: "cartoon", label: "Cartoon", emoji: "C", color: "#FF6B6B" },
  { id: "anime", label: "Anime", emoji: "A", color: "#845EC2" },
  { id: "sketch", label: "Sketch", emoji: "S", color: "#6B7280" },
  { id: "pixel", label: "Pixel Art", emoji: "P", color: "#00C9A7" },
  { id: "flat", label: "Flat Art", emoji: "F", color: "#FF9671" }
];

export const getClipartStyleById = (styleId: string) =>
  CLIPART_STYLES.find((style) => style.id === styleId);
