import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type SkeletonLoaderProps = {
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonLoader({
  height = 280,
  style,
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
      opacity.stopAnimation();
    };
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { height, opacity }, style]}>
      <View style={styles.innerGlow} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E3F",
    borderRadius: 16,
    overflow: "hidden",
  },
  innerGlow: {
    flex: 1,
    backgroundColor: "#282853",
    opacity: 0.55,
  },
});
