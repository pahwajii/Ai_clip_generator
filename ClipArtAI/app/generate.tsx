import { useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { StyleCard } from "../components/StyleCard";
import { getClipartStyleById } from "../constants/styles";
import { useGeneration } from "../hooks/useGeneration";

export default function GenerateScreen() {
  const { imageBase64, styleId } = useLocalSearchParams<{
    imageBase64: string;
    styleId: string;
  }>();
  const { result, loading, error, isGenerating, generateStyle } = useGeneration();
  const router = useRouter();
  const selectedStyle = getClipartStyleById(styleId ?? "");

  useEffect(() => {
    if (!imageBase64 || !selectedStyle) {
      return;
    }

    void generateStyle(imageBase64, selectedStyle.id);
  }, [generateStyle, imageBase64, selectedStyle]);

  const handleDownload = async (base64Image: string, nextStyleId: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Allow media access to save images.");
        return;
      }

      const base64Data = base64Image.replace("data:image/png;base64,", "");
      const fileUri = `${FileSystem.documentDirectory}clipart_${nextStyleId}_${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Saved", "Image saved to your gallery.");
    } catch {
      Alert.alert("Error", "Failed to save image.");
    }
  };

  const handleShare = async (base64Image: string) => {
    try {
      const base64Data = base64Image.replace("data:image/png;base64,", "");
      const fileUri = `${FileSystem.documentDirectory}share_${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Share.share({ url: fileUri });
    } catch {
      Alert.alert("Error", "Failed to share image.");
    }
  };

  const handleRegenerate = () => {
    if (!imageBase64 || !selectedStyle) {
      Alert.alert("Missing input", "Go back and choose an image and a style first.");
      return;
    }

    void generateStyle(imageBase64, selectedStyle.id);
  };

  if (!selectedStyle) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
        <LinearGradient colors={["#0A0A0F", "#12122A"]} style={styles.background}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Style not found</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.regenerateButton}>
              <Text style={styles.regenerateButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <LinearGradient colors={["#0A0A0F", "#12122A"]} style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedStyle.label}</Text>
          <TouchableOpacity onPress={handleRegenerate} style={styles.regenerateButton}>
            <Text style={styles.regenerateButtonText}>Regenerate</Text>
          </TouchableOpacity>
        </View>

        {isGenerating ? (
          <View style={styles.generatingBanner}>
            <Text style={styles.generatingText}>
              Generating {selectedStyle.label}...
            </Text>
          </View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          <StyleCard
            error={error}
            imageUri={result}
            isLoading={loading}
            onSave={() => {
              if (!result) {
                return;
              }

              void handleDownload(result, selectedStyle.id);
            }}
            onShare={() => {
              if (!result) {
                return;
              }

              void handleShare(result);
            }}
            style={selectedStyle}
          />
          <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  backButtonText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  regenerateButton: {
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D2D5E",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  regenerateButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  generatingBanner: {
    alignItems: "center",
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7C3AED",
    marginBottom: 16,
    padding: 12,
  },
  generatingText: {
    color: "#A78BFA",
    fontSize: 13,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyStateTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
