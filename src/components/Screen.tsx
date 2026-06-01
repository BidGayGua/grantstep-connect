import type { ReactNode } from "react";
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import appPatternBackground from "../assets/app-pattern-background.png";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={styles.background}>
        <ImageBackground
          source={appPatternBackground}
          style={styles.pattern}
          imageStyle={styles.patternImage}
        >
          <View style={styles.readabilityOverlay} />
        </ImageBackground>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Stack({ children }: { children: ReactNode }) {
  return <View style={styles.stack}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EEF3FA",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternImage: {
    opacity: 0.34,
    resizeMode: "cover",
  },
  readabilityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(238,243,250,0.68)",
  },
  content: {
    backgroundColor: "transparent",
    paddingBottom: 24,
  },
  stack: {
    gap: 22,
  },
});
