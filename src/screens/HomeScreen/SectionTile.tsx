import { useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { colors, shadows, typography } from "../../theme";
import { AnimatedButton } from "./AnimatedButton";

export function SectionTile({
  icon,
  label,
  onNavigate,
}: {
  icon: string;
  label: string;
  onNavigate: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.gridItem}>
      <AnimatedButton
        onPress={onNavigate}
        style={styles.button}
      >
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Ionicons name={icon} size={28} color={colors.primary} />
          </View>
          <Text
            style={styles.gridLabel}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </AnimatedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: colors.card,
    marginBottom: 8,
    ...shadows.soft,
  },
  button: {
    flex: 1,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(30, 60, 168, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 13,
    fontFamily: typography.family.semiBold,
    color: colors.foreground,
    textAlign: "center",
  },
});
