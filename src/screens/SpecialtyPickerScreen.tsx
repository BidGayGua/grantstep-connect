import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { useI18n } from "../i18n";
import { colors, shadows, typography } from "../theme";

export function SpecialtyPickerScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();

  return (
    <Screen>
      <Stack>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.82}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("specialtyPickerTitle")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="school-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t("specialtyPickerTitle")}</Text>
          <Text style={styles.text}>{t("specialtyPickerSoon")}</Text>
        </View>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
    ...shadows.soft,
  },
  headerTitle: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.semiBold,
    fontSize: 18,
    textAlign: "center",
  },
  headerSpacer: {
    width: 38,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    marginHorizontal: 20,
    padding: 22,
    ...shadows.card,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 22,
    height: 68,
    justifyContent: "center",
    width: 68,
  },
  title: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 24,
    marginTop: 16,
    textAlign: "center",
  },
  text: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
});
