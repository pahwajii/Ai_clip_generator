import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArtStyle } from "../constants/styles";

interface Props {
  style: ArtStyle;
  selected: boolean;
  onPress: () => void;
}

export function StyleCard({ style, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: style.color },
        selected && { backgroundColor: `${style.color}22` },
      ]}
      activeOpacity={0.75}
    >
      <Text style={styles.emoji}>{style.emoji}</Text>
      <Text style={[styles.label, selected && { color: style.color }]}>
        {style.label}
      </Text>
      <Text style={styles.desc}>{style.description}</Text>
      {selected ? <View style={[styles.dot, { backgroundColor: style.color }]} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: "#1a1a1a",
    marginRight: 12,
    alignItems: "center",
    gap: 4,
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  desc: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});
