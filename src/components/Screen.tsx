import type { ReactNode } from "react";
import { ImageBackground, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import appPatternBackground from "../assets/app-pattern-background.png";

interface ScreenProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, contentContainerStyle, style }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safe, style]}>
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
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

interface StackProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Stack({ children, style }: StackProps) {
  return <View style={[styles.stack, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternImage: {
    opacity: 0.16,
    resizeMode: "cover",
  },
  readabilityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(246,248,252,0.88)",
  },
  content: {
    backgroundColor: "transparent",
    paddingBottom: 40,
  },
  stack: {
    gap: 22,
  },
});
