import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { RootStackParamList } from "../../App";
import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Section } from "../components/Section";
import { languages, useI18n, type TranslationKey, type Language } from "../i18n";
import { docProgress, useAdmission } from "../lib/documents-store";
import { colors, shadows } from "../theme";

const extra = [
  { icon: "flask", label: "labs" },
  { icon: "school", label: "parentsMenu" },
  { icon: "business", label: "dorm" },
  { icon: "location", label: "city" },
] as const;

const settings = [
  { icon: "notifications", label: "notifications" },
  { icon: "lock-closed", label: "security" },
  { icon: "help-circle", label: "support" },
  { icon: "log-out", label: "logout", danger: true },
] as const;

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language, setLanguage, t } = useI18n();
  const admission = useAdmission();
  const docs = admission.documents;
  const { done, total, percent } = docProgress(docs);

  return (
    <Screen>
      <Stack>
        <ScreenHeader title={t("profileTitle")} />

        <View style={styles.userCard}>
          <View style={styles.userTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>АК</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.userName}>Алмас Калиев</Text>
              <Text style={styles.userEmail}>almas.k@grantstep.kz</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t("status")}</Text>
              <Text style={styles.statValue}>{t("underReview")}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t("specialty")}</Text>
              <Text style={styles.statValue} numberOfLines={2}>
                {admission.selectedSpecialty ?? t("chooseSpecialty")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.documentsCard}>
          <View style={styles.docIcon}>
            <Ionicons name="document-text" size={22} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <View style={styles.docHead}>
              <Text style={styles.docTitle}>{t("documentsTitle")}</Text>
              <Text style={styles.docPercent}>{percent}%</Text>
            </View>
            <Text style={styles.docSub}>
              {done} {t("of")} {total} {t("uploaded")}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${percent}%` }]} />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>

        <Section title={t("interfaceLanguage")}>
          <View style={styles.segmented}>
            {languages.map((item) => {
              const active = language === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setLanguage(item.id as Language)}
                  style={[styles.segment, active && styles.segmentActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section title={t("extra")}>
          <Menu
            items={extra}
            onPress={(label) => {
              if (label === "parentsMenu") {
                navigation.navigate("Parents");
              }
            }}
          />
        </Section>

        <Section title={t("settings")}>
          <Menu items={settings} />
        </Section>

        <Text style={styles.version}>GrantStep x ВКТУ · v 1.0.0</Text>
      </Stack>
    </Screen>
  );
}

function Menu({
  items,
  onPress,
}: {
  items: ReadonlyArray<{
    icon: string;
    label: TranslationKey;
    danger?: boolean;
  }>;
  onPress?: (label: TranslationKey) => void;
}) {
  const { t } = useI18n();

  return (
    <View style={styles.menu}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.menuRow, index !== items.length - 1 && styles.divider]}
          onPress={() => onPress?.(item.label)}
          activeOpacity={0.8}
        >
          <View style={styles.menuIcon}>
            <Ionicons name={item.icon as never} size={18} color={colors.foreground} />
          </View>
          <Text style={[styles.menuText, item.danger && styles.dangerText]}>
            {t(item.label)}
          </Text>
          <Ionicons name="chevron-forward" size={17} color={colors.muted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: colors.primaryDeep,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 20,
    ...shadows.deep,
  },
  userTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
  },
  flex: {
    flex: 1,
  },
  userName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
  },
  userEmail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 3,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  statBox: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    flex: 1,
    padding: 12,
  },
  statLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "500",
    marginTop: 5,
  },
  documentsCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    padding: 15,
    ...shadows.soft,
  },
  docIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  docHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  docTitle: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: "500",
  },
  docPercent: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  docSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
  },
  track: {
    backgroundColor: colors.secondary,
    borderRadius: 5,
    height: 6,
    marginTop: 8,
    overflow: "hidden",
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 6,
  },
  segmented: {
    backgroundColor: colors.secondary,
    borderRadius: 18,
    flexDirection: "row",
    padding: 4,
  },
  segment: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    paddingVertical: 11,
  },
  segmentActive: {
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500",
  },
  segmentTextActive: {
    color: colors.primary,
  },
  menu: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  menuRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  divider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  menuIcon: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  menuText: {
    color: colors.foreground,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  dangerText: {
    color: colors.destructive,
  },
  version: {
    color: colors.muted,
    fontSize: 11,
    paddingBottom: 8,
    textAlign: "center",
  },
});

