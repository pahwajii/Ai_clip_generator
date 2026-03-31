import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ImagePreview } from "../components/ImagePreview";

export default function ResultScreen() {
  const router = useRouter();
  const { sourceUri, resultUri, provider, style } = useLocalSearchParams<{
    sourceUri?: string;
    resultUri?: string;
    provider?: string;
    style?: string;
  }>();

  if (!sourceUri || !resultUri) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Missing result</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/")}>
            <Text style={styles.backBtnText}>Back Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Your {style ?? "clipart"} result</Text>
        <Text style={styles.subtitle}>Preview, save, or share the generated image.</Text>

        <ImagePreview sourceUri={sourceUri} resultUri={resultUri} provider={provider} />
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
  backLink: {
    alignSelf: "flex-start",
  },
  backLinkText: {
    color: "#7c5cfc",
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#777",
    fontSize: 14,
    marginTop: -10,
  },
  backBtn: {
    backgroundColor: "#7c5cfc",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
