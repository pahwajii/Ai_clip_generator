import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ImagePreview } from "../components/ImagePreview";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { StyleCard } from "../components/StyleCard";
import { ART_STYLES } from "../constants/styles";
import { useImageGen } from "../hooks/useImageGen";

export default function HomeScreen() {
  const [selectedStyle, setSelectedStyle] = useState("cartoon");
  const { sourceImage, result, loading, error, pickImage, takePhoto, generate } =
    useImageGen();
  const router = useRouter();

  async function handleGenerate() {
    if (!sourceImage) {
      Alert.alert("Pick an image first");
      return;
    }

    const generated = await generate(selectedStyle);
    if (!generated) {
      return;
    }

    router.push({
      pathname: "/result" as never,
      params: {
        sourceUri: sourceImage,
        resultUri: generated.imageUri,
        provider: generated.provider,
        style: selectedStyle,
      },
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>ClipArt AI</Text>
        <Text style={styles.subtitle}>Turn any photo into art</Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
            <Text style={styles.pickBtnText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickBtn} onPress={takePhoto}>
            <Text style={styles.pickBtnText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Choose style</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScroll}>
          {ART_STYLES.map((style) => (
            <View key={style.id}>
              <StyleCard
                style={style}
                selected={selectedStyle === style.id}
                onPress={() => setSelectedStyle(style.id)}
              />
            </View>
          ))}
        </ScrollView>

        {sourceImage && !loading ? (
          <ImagePreview
            sourceUri={sourceImage}
            resultUri={result?.imageUri ?? null}
            provider={result?.provider}
          />
        ) : null}

        {loading ? <SkeletonLoader /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.generateBtn, (!sourceImage || loading) && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={!sourceImage || loading}
        >
          <Text style={styles.generateBtnText}>
            {loading ? "Generating..." : "Generate"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  scroll: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: -12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#aaa",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  pickBtn: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  pickBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  styleScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  error: {
    color: "#ff6b6b",
    textAlign: "center",
    fontSize: 13,
  },
  generateBtn: {
    backgroundColor: "#7c5cfc",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  generateBtnDisabled: {
    opacity: 0.4,
  },
  generateBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

