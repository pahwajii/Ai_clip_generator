import { memo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { ClipartStyle } from "../constants/styles";
import { SkeletonLoader } from "./SkeletonLoader";

type StyleCardProps = {
  style: ClipartStyle;
  imageUri: string | null;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  onShare: () => void;
};

function StyleCardComponent({
  style,
  imageUri,
  isLoading,
  error,
  onSave,
  onShare,
}: StyleCardProps) {
  const hasResult = Boolean(imageUri);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.accentDot, { backgroundColor: style.color }]} />
        <Text style={styles.cardEmoji}>{style.emoji}</Text>
        <Text style={styles.cardLabel}>{style.label}</Text>
        {isLoading ? (
          <View style={styles.loadingBadge}>
            <Text style={styles.loadingBadgeText}>Generating</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <SkeletonLoader />
        ) : hasResult ? (
          <>
            <Image source={{ uri: imageUri ?? undefined }} style={styles.resultImage} />
            <View style={styles.actionRow}>
              <TouchableOpacity activeOpacity={0.9} onPress={onSave} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onShare}
                style={[styles.actionButton, styles.shareButton]}
              >
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Generation failed</Text>
            <Text style={styles.errorText}>
              {error ?? "The backend did not return an image for this style."}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export const StyleCard = memo(StyleCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#16163A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2D2D5E",
    marginBottom: 20,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cardEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  cardLabel: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingBadge: {
    backgroundColor: "#1E1E3F",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2D2D5E",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  loadingBadgeText: {
    color: "#8B8BA7",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  resultImage: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    backgroundColor: "#1E1E3F",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2D2D5E",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: "#7C3AED",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  errorBox: {
    height: 280,
    borderRadius: 16,
    backgroundColor: "#1E1E3F",
    borderWidth: 1,
    borderColor: "#2D2D5E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: "#FF6B6B",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: {
    color: "#8B8BA7",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
