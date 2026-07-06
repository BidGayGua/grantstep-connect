import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { colors, shadows, typography } from "../theme";
import { useAdmission } from "../lib/admission-store";
import { useI18n, type TranslationKey } from "../i18n";

const admissionUrl = "https://www.ektu.kz/admissiondetails.aspx";

type ApplicantId = "school" | "college" | "transfer" | "international";

interface ApplicantCard {
  id: ApplicantId;
  titleKey: TranslationKey;
  textKey: TranslationKey;
  detailKeys: TranslationKey[];
  icon: string;
  color: string;
  bg: string;
}

const applicantCards: ApplicantCard[] = [
  {
    id: "school",
    titleKey: "applicantSchoolTitle",
    textKey: "applicantSchoolText",
    detailKeys: ["applicantSchoolDetail1", "applicantSchoolDetail2", "applicantSchoolDetail3"],
    icon: "school-outline",
    color: colors.primary,
    bg: "#edf4ff",
  },
  {
    id: "college",
    titleKey: "applicantCollegeTitle",
    textKey: "applicantCollegeText",
    detailKeys: ["applicantCollegeDetail1", "applicantCollegeDetail2", "applicantCollegeDetail3"],
    icon: "briefcase-outline",
    color: colors.success,
    bg: "#eaf8f0",
  },
  {
    id: "transfer",
    titleKey: "applicantTransferTitle",
    textKey: "applicantTransferText",
    detailKeys: ["applicantTransferDetail1", "applicantTransferDetail2", "applicantTransferDetail3"],
    icon: "swap-horizontal-outline",
    color: colors.purple,
    bg: "#f1efff",
  },
  {
    id: "international",
    titleKey: "applicantIntlTitle",
    textKey: "applicantIntlText",
    detailKeys: ["applicantIntlDetail1", "applicantIntlDetail2", "applicantIntlDetail3"],
    icon: "globe-outline",
    color: colors.cyan,
    bg: "#e7f8fc",
  },
];

const scoreCards = [
  { value: "50", labelKey: "points" as TranslationKey, titleKey: "scoreTotal" as TranslationKey, textKey: "scoreTotalSub" as TranslationKey, icon: "trophy-outline", color: colors.primary },
  { value: "5", labelKey: "points" as TranslationKey, titleKey: "scoreProfile" as TranslationKey, textKey: "scoreProfileSub" as TranslationKey, icon: "analytics-outline", color: colors.success },
  { value: "3", labelKey: "pointsGenitive" as TranslationKey, titleKey: "scoreLiteracy" as TranslationKey, textKey: "scoreLiteracySub" as TranslationKey, icon: "reader-outline", color: colors.orange },
] as const;

const subjectPairKeys: TranslationKey[] = [
  "subjectMathPhys",
  "subjectMathGeo",
  "subjectBioGeo",
  "subjectCreative",
  "subjectMathInfo",
  "subjectBioChem",
];

export function AdmissionScreen() {
  const { t } = useI18n();
  const navigation = useNavigation<any>();
  const admission = useAdmission();
  const [openApplicant, setOpenApplicant] = useState<ApplicantId>("school");

  const openAdmissionSite = () => {
    Linking.openURL(admissionUrl);
  };

  return (
    <Screen>
      <Stack>
        <View style={styles.header}>
          <Text style={styles.title}>{t("admissionTitle")}</Text>
          <Text style={styles.subtitle}>{t("admissionHeroSub")}</Text>
        </View>

        {admission.selectedSpecialty ? (
          <TouchableOpacity
            style={styles.specialtyStatusCard}
            onPress={() => navigation.navigate("SpecialtyPicker")}
            activeOpacity={0.88}
          >
            <View style={styles.specialtyStatusContent}>
              <Text style={styles.specialtyStatusLabel}>{t("selectedSpecialty")}</Text>
              <Text style={styles.specialtyStatusName}>{admission.selectedSpecialty}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.pickerCta}
            onPress={() => navigation.navigate("SpecialtyPicker")}
            activeOpacity={0.88}
          >
            <View style={styles.pickerCtaIcon}>
              <Ionicons name="color-wand" size={24} color={colors.white} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.pickerCtaTitle}>{t("pickSpecialty")}</Text>
              <Text style={styles.pickerCtaText}>{t("pickSpecialtySub")}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.heroCard} onPress={openAdmissionSite} activeOpacity={0.88}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTopLine} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles-outline" size={15} color={colors.white} />
              <Text style={styles.heroBadgeText}>{t("officialSection")}</Text>
            </View>
            <Text style={styles.heroTitle}>{t("admissionHeroTitle")}</Text>
            <Text style={styles.heroText}>
              {t("admissionHeroText")}
            </Text>
          </View>
          <View style={styles.heroArrow}>
            <Ionicons name="arrow-forward" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <Section title={t("whoCanApply")}>
          <View style={styles.applicantList}>
            {applicantCards.map((item) => {
              const active = openApplicant === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.applicantCard,
                    active && { borderColor: item.color, backgroundColor: item.bg },
                  ]}
                  activeOpacity={0.86}
                  onPress={() => setOpenApplicant(active ? "school" : item.id)}
                >
                  <View style={styles.applicantHead}>
                    <View style={[styles.applicantIcon, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.applicantTitle}>{t(item.titleKey)}</Text>
                      <Text style={styles.applicantText}>{t(item.textKey)}</Text>
                    </View>
                    <View style={[styles.expandIcon, active && { backgroundColor: item.bg }]}>
                      <Ionicons name={active ? "chevron-up" : "chevron-down"} size={18} color={item.color} />
                    </View>
                  </View>
                  {active ? (
                    <View style={styles.detailBox}>
                      {item.detailKeys.map((detailKey) => (
                        <View key={detailKey} style={styles.detailRow}>
                          <Ionicons name="checkmark-circle" size={16} color={item.color} />
                          <Text style={styles.detailText}>{t(detailKey)}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section title={t("minScores")}>
          <View style={styles.scoreGrid}>
            {scoreCards.map((item) => (
              <View key={item.titleKey} style={styles.scoreCard}>
                <View style={[styles.scoreIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={19} color={colors.white} />
                </View>
                <View style={styles.scoreValueRow}>
                  <Text style={[styles.scoreValue, { color: item.color }]}>{item.value}</Text>
                  <Text style={styles.scoreLabel}>{t(item.labelKey)}</Text>
                </View>
                <Text style={styles.scoreTitle}>{t(item.titleKey)}</Text>
                <Text style={styles.scoreText}>{t(item.textKey)}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("profileSubjects")}>
          <View style={styles.badgeWrap}>
            {subjectPairKeys.map((key) => (
              <View key={key} style={styles.subjectBadge}>
                <View style={styles.badgeCheck}>
                  <Ionicons name="checkmark" size={13} color={colors.white} />
                </View>
                <Text style={styles.subjectText}>{t(key)}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("admissionRules")}>
          <View style={styles.rulesCard}>
            <Text style={styles.rulesText}>
              {t("rulesIntro")}{"\n\n"}
              • {t("rule1")}{"\n\n"}
              • {t("rule2")}
            </Text>
          </View>
        </Section>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rulesCard: {
    backgroundColor: colors.card,
    borderColor: "rgba(255,255,255,0.68)",
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    ...shadows.card,
  },
  rulesText: {
    color: "#334155",
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  title: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 37,
    letterSpacing: -0.6,
    lineHeight: 43,
  },
  subtitle: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: colors.primaryDeep,
    borderColor: "#31549b",
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: 20,
    minHeight: 190,
    overflow: "hidden",
    padding: 20,
    ...shadows.deep,
  },
  heroGlow: {
    backgroundColor: "rgba(61,99,199,0.55)",
    borderRadius: 120,
    height: 170,
    position: "absolute",
    right: -58,
    top: -52,
    width: 170,
  },
  heroTopLine: {
    backgroundColor: colors.cyan,
    height: 4,
    left: 20,
    position: "absolute",
    right: 110,
    top: 0,
  },
  heroContent: { flex: 1, justifyContent: "space-between", paddingRight: 12 },
  heroBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  heroBadgeText: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 26,
    letterSpacing: -0.35,
    lineHeight: 31,
    marginTop: 18,
  },
  heroText: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  heroArrow: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: colors.white,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  applicantList: { gap: 12 },
  applicantCard: {
    backgroundColor: colors.card,
    borderColor: "rgba(255,255,255,0.68)",
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    ...shadows.deep,
  },
  applicantHead: { alignItems: "center", flexDirection: "row", gap: 12 },
  applicantIcon: {
    alignItems: "center",
    borderRadius: 17,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  applicantTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
    letterSpacing: -0.1,
    lineHeight: 20,
  },
  applicantText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 3,
  },
  expandIcon: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  detailBox: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 9,
    marginTop: 13,
    paddingTop: 12,
  },
  detailRow: { alignItems: "flex-start", flexDirection: "row", gap: 8 },
  detailText: {
    color: "#334155",
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 19,
  },
  scoreGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  scoreCard: {
    backgroundColor: colors.card,
    borderColor: "rgba(255,255,255,0.68)",
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    width: "48%",
    ...shadows.card,
  },
  scoreIcon: {
    alignItems: "center",
    borderRadius: 15,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  scoreValueRow: { alignItems: "flex-end", flexDirection: "row", gap: 5, marginTop: 12 },
  scoreValue: { fontFamily: typography.family.bold, fontSize: 33, lineHeight: 37 },
  scoreLabel: {
    color: colors.muted,
    fontFamily: typography.family.medium,
    fontSize: 12,
    marginBottom: 5,
  },
  scoreTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 13,
    letterSpacing: -0.1,
    lineHeight: 18,
    marginTop: 8,
  },
  scoreText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  badgeWrap: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  subjectBadge: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: "rgba(255,255,255,0.68)",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    ...shadows.soft,
  },
  badgeCheck: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  subjectText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  pickerCta: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  pickerCtaIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerCtaTitle: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.foreground,
  },
  pickerCtaText: {
    fontSize: 12,
    fontFamily: typography.family.regular,
    color: colors.muted,
  },
  specialtyStatusCard: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: colors.primary + "33",
    ...shadows.soft,
  },
  specialtyStatusContent: {
    flex: 1,
  },
  specialtyStatusLabel: {
    fontSize: 12,
    fontFamily: typography.family.medium,
    color: colors.primary,
    marginBottom: 2,
  },
  specialtyStatusName: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.foreground,
  },
});
