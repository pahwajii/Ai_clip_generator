import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ImagePreview } from "../components/ImagePreview";
import { CLIPART_STYLES, type ClipartStyle } from "../constants/styles";
import { useImagePicker } from "../hooks/useImagePicker";

type PickerResult = {
  uri: string;
  base64?: string | null;
};

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<ClipartStyle["id"]>("cartoon");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { pickImage, takePhoto } = useImagePicker();
  const router = useRouter();

  useEffect(() => {
    if (!selectedImage) {
      fadeAnim.setValue(0);
      return;
    }

    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [fadeAnim, selectedImage]);

  const applyImageResult = (result: PickerResult | null) => {
    if (!result) {
      return;
    }

    setSelectedImage(result.uri);
    setImageBase64(result.base64 ?? null);
  };

  const handlePickImage = async () => {
    const result = await pickImage();
    applyImageResult(result);
  };

  const handleTakePhoto = async () => {
    const result = await takePhoto();
    applyImageResult(result);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImageBase64(null);
  };

  const handleGenerate = () => {
    if (!imageBase64) {
      Alert.alert("No image", "Please select a photo first.");
      return;
    }

    router.push({
      pathname: "/generate",
      params: { imageBase64, styleId: selectedStyleId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <LinearGradient colors={["#0A0A0F", "#12122A"]} style={styles.background}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>ClipArt AI</Text>
            <Text style={styles.subtitle}>
              Transform one photo into the exact clipart style you choose.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.92}
            disabled={Boolean(selectedImage)}
            onPress={selectedImage ? undefined : handlePickImage}
            style={styles.uploadBox}
          >
            {selectedImage ? (
              <Animated.View style={[styles.previewWrapper, { opacity: fadeAnim }]}>
                <ImagePreview
                  imageUri={selectedImage}
                  onClear={handleClearImage}
                  onChange={handlePickImage}
                />
              </Animated.View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderIcon}>+</Text>
                <Text style={styles.placeholderText}>Tap to upload photo</Text>
                <Text style={styles.placeholderSub}>JPG and PNG supported</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handlePickImage} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTakePhoto} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={!selectedImage}
            onPress={handleGenerate}
            style={[styles.generateButton, !selectedImage && styles.generateButtonDisabled]}
          >
            <LinearGradient
              colors={selectedImage ? ["#7C3AED", "#4F46E5"] : ["#2A2A2A", "#2A2A2A"]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={styles.generateGradient}
            >
              <Text style={styles.generateButtonText}>
                {selectedImage ? "Generate Selected Style" : "Select a photo first"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.stylesLabel}>Choose One Style</Text>
          <View style={styles.styleRow}>
            {CLIPART_STYLES.map((style) => (
              <TouchableOpacity
                activeOpacity={0.9}
                key={style.id}
                onPress={() => setSelectedStyleId(style.id)}
                style={[
                  styles.stylePill,
                  selectedStyleId === style.id && styles.stylePillSelected,
                  selectedStyleId === style.id && { borderColor: style.color },
                ]}
              >
                <Text style={styles.stylePillText}>
                  {style.emoji} {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  background: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 48,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#8B8BA7",
  },
  uploadBox: {
    height: 280,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2D2D5E",
    backgroundColor: "#16163A",
    overflow: "hidden",
    marginBottom: 16,
  },
  previewWrapper: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#1E1E3F",
    borderWidth: 1,
    borderColor: "#2D2D5E",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    color: "#FFFFFF",
    fontSize: 34,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B8BA7",
  },
  placeholderSub: {
    marginTop: 4,
    fontSize: 12,
    color: "#4A4A6A",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1E1E3F",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2D2D5E",
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: "#A0A0C0",
    fontSize: 14,
    fontWeight: "600",
  },
  generateButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 28,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateGradient: {
    alignItems: "center",
    paddingVertical: 18,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  stylesLabel: {
    color: "#8B8BA7",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  styleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stylePill: {
    backgroundColor: "#1E1E3F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2D2D5E",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stylePillSelected: {
    backgroundColor: "#262656",
  },
  stylePillText: {
    color: "#8B8BA7",
    fontSize: 12,
    fontWeight: "500",
  },
});
