import { memo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ImagePreviewProps = {
  imageUri: string;
  onClear: () => void;
  onChange: () => void;
};

function ImagePreviewComponent({
  imageUri,
  onClear,
  onChange,
}: ImagePreviewProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <TouchableOpacity
        accessibilityLabel="Clear selected image"
        activeOpacity={0.85}
        onPress={onClear}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityLabel="Change selected image"
        activeOpacity={0.9}
        onPress={onChange}
        style={styles.changeButton}
      >
        <Text style={styles.changeButtonText}>Retake or Change</Text>
      </TouchableOpacity>
    </View>
  );
}

export const ImagePreview = memo(ImagePreviewComponent);

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#16163A",
    borderWidth: 1,
    borderColor: "#2D2D5E",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(10, 10, 15, 0.82)",
    borderWidth: 1,
    borderColor: "#2D2D5E",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  changeButton: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: "rgba(10, 10, 15, 0.82)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2D2D5E",
    paddingVertical: 12,
    alignItems: "center",
  },
  changeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
