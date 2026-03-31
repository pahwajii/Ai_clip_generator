export interface ArtStyle {
  id: "cartoon" | "anime" | "sketch" | "pixel" | "flat";
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export const ART_STYLES: ArtStyle[] = [
  {
    id: "cartoon",
    label: "Cartoon",
    emoji: "\u{1F3A8}",
    description: "Vivid Disney/Pixar look",
    color: "#FF6B6B",
  },
  {
    id: "anime",
    label: "Anime",
    emoji: "\u26E9\uFE0F",
    description: "Studio Ghibli inspired",
    color: "#845EF7",
  },
  {
    id: "sketch",
    label: "Sketch",
    emoji: "\u270F\uFE0F",
    description: "Hand-drawn pencil art",
    color: "#495057",
  },
  {
    id: "pixel",
    label: "Pixel Art",
    emoji: "\u{1F47E}",
    description: "Retro 16-bit game style",
    color: "#20C997",
  },
  {
    id: "flat",
    label: "Flat Art",
    emoji: "\u{1F537}",
    description: "Modern minimal illustration",
    color: "#339AF0",
  },
];
