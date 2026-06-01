import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "../theme";

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    paddingTop: 10,
  },
  title: {
    ...typography.title,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.body,
    marginTop: 4,
    color: colors.label,
  },
});
