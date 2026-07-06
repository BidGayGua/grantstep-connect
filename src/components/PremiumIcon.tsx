import Ionicons from "react-native-vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

import { shadows } from "../theme";

type Tone = "blue" | "cyan" | "green" | "orange" | "purple";

const tones: Record<Tone, { icon: string; border: string; tint: string }> = {
  blue: { icon: "#1764d8", border: "#dbe8fb", tint: "#f8fbff" },
  cyan: { icon: "#047f9f", border: "#d7eef6", tint: "#f8fdff" },
  green: { icon: "#168454", border: "#dceee5", tint: "#fbfffd" },
  orange: { icon: "#c97721", border: "#f2e3cf", tint: "#fffdfa" },
  purple: { icon: "#6654d9", border: "#e4e0f8", tint: "#fcfbff" },
};

export function PremiumIcon({
  name,
  size = 44,
  iconSize,
  tone = "blue",
}: {
  name: ComponentProps<typeof Ionicons>["name"];
  size?: number;
  iconSize?: number;
  tone?: Tone;
}) {
  const palette = tones[tone];
  const resolvedIconSize = iconSize ?? Math.round(size * 0.46);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.tint,
          borderColor: palette.border,
          borderRadius: Math.round(size / 2),
          height: size,
          width: size,
        },
      ]}
    >
      <Ionicons name={name} size={resolvedIconSize} color={palette.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "center",
  },
});
