import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "../theme";

export function Section({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    gap: 14,
  },
  title: {
    ...typography.section,
    color: colors.foreground,
    letterSpacing: 0,
  },
});
