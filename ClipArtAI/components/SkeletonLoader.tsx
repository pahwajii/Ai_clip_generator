import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function SkeletonLoader() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, { opacity }]} />
      <View style={styles.row}>
        <Animated.View style={[styles.pill, { opacity, width: 80 }]} />
        <Animated.View style={[styles.pill, { opacity, width: 120 }]} />
      </View>
      <Animated.View
        style={[styles.pill, { opacity, width: "70%", alignSelf: "center" }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    gap: 12,
    padding: 16,
  },
  box: {
    height: 280,
    borderRadius: 16,
    backgroundColor: "#2a2a2a",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  pill: {
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2a2a2a",
  },
});
