import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import campus from "../assets/campus.jpg";
import ektuLogo from "../assets/ektu-logo.png";
import trophy from "../assets/trophy.png";
import type { RootStackParamList, RootTabParamList } from "../../App";
import { languages, useI18n, type Language } from "../i18n";
import { PremiumIcon } from "../components/PremiumIcon";
import { Screen, Stack } from "../components/Screen";
import { colors, shadows, typography } from "../theme";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const sectionItems = [
  { key: "about", icon: "business-outline" },
  { key: "specialties", icon: "school-outline" },
  { key: "grants", icon: "trophy-outline" },
  { key: "documents", icon: "document-text-outline" },
  { key: "dorm", icon: "bed-outline" },
  { key: "faq", icon: "help-circle-outline" },
] as const;

const advantageKeys = [
  "advantageScore",
  "advantageGrant",
  "advantageLabs",
  "advantageInternational",
  "advantageJobs",
] as const;

const parentItems = [
  { title: "parentDorm", sub: "parentDormSub", icon: "bed-outline" },
  { title: "parentJobs", sub: "parentJobsSub", icon: "briefcase-outline" },
  { title: "parentDiploma", sub: "parentDiplomaSub", icon: "reader-outline" },
  { title: "parentSafety", sub: "parentSafetySub", icon: "shield-checkmark-outline" },
  { title: "parentInternational", sub: "parentInternationalSub", icon: "globe-outline" },
] as const;

export function HomeScreen() {
  const { language, setLanguage, t } = useI18n();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const rootNavigation =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const [languageOpen, setLanguageOpen] = useState(false);

  const openPartner = () => {
    Linking.openURL("https://ektu.kz/");
  };

  const chooseLanguage = async (nextLanguage: Language) => {
    await setLanguage(nextLanguage);
    setLanguageOpen(false);
  };

  return (
    <Screen>
      <Stack>
        <View pointerEvents="none" style={styles.topGradient}>
          <View style={styles.topGradientStrong} />
          <View style={styles.topGradientSoft} />
          <View style={styles.topGradientFade} />
        </View>

        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logo}>
              <Text style={styles.logoGrant}>Grant</Text>
              <Text style={styles.logoStep}>Step</Text>
            </Text>
            <Ionicons name="school-outline" size={24} color="#075bd8" />
          </View>

          <View>
            <AnimatedButton
              style={styles.langButton}
              onPress={() => setLanguageOpen((open) => !open)}
            >
              <Ionicons name="globe-outline" size={17} color={colors.primary} />
            </AnimatedButton>

            {languageOpen ? (
              <View style={styles.languageMenu}>
                <Text style={styles.languageTitle}>{t("language")}</Text>
                {languages.map((item) => {
                  const active = item.id === language;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => chooseLanguage(item.id)}
                      style={[styles.languageOption, active && styles.languageOptionActive]}
                      activeOpacity={0.78}
                    >
                      <Text
                        style={[
                          styles.languageOptionText,
                          active && styles.languageOptionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {active ? (
                        <Ionicons name="checkmark" size={15} color={colors.primary} />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.heroWrap}>
          <ImageBackground source={campus} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay} />
            <View style={styles.heroSoftShape} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{t("heroTitle")}</Text>
              <Text style={styles.heroMeta}>{t("heroMeta")}</Text>
              <Text style={styles.heroSub}>{t("heroSub")}</Text>
              <AnimatedButton style={styles.heroButton}>
                <Text style={styles.heroButtonText}>{t("applyOnline")}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </AnimatedButton>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.partnerWrap}>
          <AnimatedButton style={styles.partnerCard} onPress={openPartner}>
            <View style={styles.partnerIcon}>
              <Image source={ektuLogo} style={styles.partnerLogo} resizeMode="contain" />
            </View>
            <View style={styles.flex}>
              <Text style={styles.eyebrow}>{t("partnerEyebrow")}</Text>
              <Text style={styles.partnerTitle}>{t("partnerTitle")}</Text>
              <Text style={styles.partnerSub}>{t("partnerSub")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={19} color={colors.muted} />
          </AnimatedButton>
        </View>

        <View style={styles.advantagesCard}>
          <View style={styles.advantagesText}>
            <Text style={styles.darkTitle}>{t("advantagesTitle")}</Text>
            <View style={styles.advantageList}>
              {advantageKeys.map((key) => (
                <View key={key} style={styles.advantageRow}>
                  <Text style={styles.check}>✓</Text>
                  <Text style={styles.advantageText}>{t(key)}</Text>
                </View>
              ))}
            </View>
          </View>
          <Image source={trophy} style={styles.trophy} />
        </View>

        <View style={styles.sectionsWrap}>
          <Text style={styles.sectionTitle}>{t("sectionsTitle")}</Text>
          <View style={styles.grid}>
            {sectionItems.map((item) => {
              return (
                <SectionTile
                  key={item.key}
                  icon={item.icon}
                  label={
                    item.key === "about"
                      ? t("about")
                      : item.key === "specialties"
                        ? t("navSpecialties")
                        : item.key === "grants"
                          ? t("grants")
                          : item.key === "documents"
                            ? t("navDocuments")
                            : item.key === "dorm"
                              ? t("dorm")
                              : t("faq")
                  }
                  onNavigate={() => {
                    if (item.key === "specialties") {
                      navigation.navigate("Specialties");
                    } else if (item.key === "grants") {
                      navigation.navigate("Admission");
                    } else if (item.key === "documents") {
                      navigation.navigate("Documents");
                    } else if (item.key === "about") {
                      rootNavigation?.navigate("Info", { kind: "about" });
                    } else if (item.key === "dorm") {
                      rootNavigation?.navigate("Info", { kind: "dorm" });
                    } else {
                      rootNavigation?.navigate("Info", { kind: "faq" });
                    }
                  }}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.parentsCard}>
          <Text style={styles.darkTitle}>{t("parentsTitle")}</Text>
          <Text style={styles.parentsSub}>{t("parentsSub")}</Text>
          <View style={styles.parentsList}>
            {parentItems.map((item) => (
              <AnimatedButton
                key={item.title}
                style={styles.parentRow}
                onPress={() => rootNavigation?.navigate("Parents")}
              >
            <View style={styles.parentIcon}>
                  <PremiumIcon name={item.icon as never} size={34} iconSize={16} tone="blue" />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.parentTitle}>{t(item.title)}</Text>
                  <Text style={styles.parentSub}>{t(item.sub)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.74)" />
              </AnimatedButton>
            ))}
          </View>
        </View>

        <View style={styles.expenseSection}>
          <AnimatedButton
            style={styles.expenseCard}
            onPress={() => rootNavigation?.navigate("ExpenseCalculator")}
          >
            <View style={styles.expenseIcon}>
              <PremiumIcon name="calculator-outline" size={48} tone="cyan" />
            </View>
            <View style={styles.flex}>
              <Text style={styles.expenseTitle}>{t("expenseCalculator")}</Text>
              <Text style={styles.expenseSub}>{t("expenseCalculatorSub")}</Text>
            </View>
            <View style={styles.expenseArrow}>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>
          </AnimatedButton>

          <AnimatedButton
            style={styles.expenseCard}
            onPress={() => rootNavigation?.navigate("SpecialtyPicker")}
          >
            <View style={styles.expenseIcon}>
              <PremiumIcon name="school-outline" size={48} tone="purple" />
            </View>
            <View style={styles.flex}>
              <Text style={styles.expenseTitle}>{t("specialtyPickerTitle")}</Text>
              <Text style={styles.expenseSub}>{t("specialtyPickerSub")}</Text>
            </View>
            <View style={styles.expenseArrow}>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>
          </AnimatedButton>

          <AnimatedButton
            style={styles.expenseCard}
            onPress={() => rootNavigation?.navigate("Scholarships")}
          >
            <View style={styles.expenseIcon}>
              <PremiumIcon name="cash-outline" size={48} tone="green" />
            </View>
            <View style={styles.flex}>
              <Text style={styles.expenseTitle}>{t("scholarshipsTitle")}</Text>
              <Text style={styles.expenseSub}>{t("scholarshipsSub")}</Text>
            </View>
            <View style={styles.expenseArrow}>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>
          </AnimatedButton>

          <AnimatedButton
            style={styles.expenseCard}
            onPress={() => rootNavigation?.navigate("MilitaryDepartment")}
          >
            <View style={styles.expenseIcon}>
              <PremiumIcon name="shield-checkmark-outline" size={48} tone="blue" />
            </View>
            <View style={styles.flex}>
              <Text style={styles.expenseTitle}>{t("militaryTitle")}</Text>
              <Text style={styles.expenseSub}>{t("militarySub")}</Text>
            </View>
            <View style={styles.expenseArrow}>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>
          </AnimatedButton>
        </View>
      </Stack>
    </Screen>
  );
}

function AnimatedButton({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.timing(scale, {
      toValue: value,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.94}
      onPress={onPress}
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedTouchable>
  );
}

function SectionTile({
  icon,
  label,
  onNavigate,
}: {
  icon: string;
  label: string;
  onNavigate: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const animatePress = (pressed: boolean) => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: pressed ? 0.98 : 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: pressed ? 1 : 0,
        duration: pressed ? 120 : 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <AnimatedTouchable
      activeOpacity={0.96}
      onPress={onNavigate}
      onPressIn={() => animatePress(true)}
      onPressOut={() => animatePress(false)}
      style={[
        styles.gridItem,
        {
          borderColor,
          transform: [{ scale }],
        },
      ]}
    >
      <View style={styles.gridIcon}>
        <PremiumIcon
          name={icon as never}
          size={38}
          iconSize={18}
          tone={icon === "bed-outline" ? "orange" : icon === "trophy-outline" ? "green" : "blue"}
        />
      </View>
      <Text style={styles.gridLabel} numberOfLines={2}>
        {label}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    height: 310,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 0,
  },
  topGradientStrong: {
    backgroundColor: "#eaf3ff",
    height: 118,
  },
  topGradientSoft: {
    backgroundColor: "#f3f8ff",
    height: 94,
  },
  topGradientFade: {
    backgroundColor: "rgba(255,255,255,0.55)",
    height: 98,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 2,
    zIndex: 20,
  },
  logoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  logo: {
    fontFamily: typography.family.bold,
    fontSize: 27,
    letterSpacing: 0,
  },
  logoGrant: {
    color: colors.foreground,
  },
  logoStep: {
    color: "#075bd8",
  },
  langButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: "#d9e6fb",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
    ...shadows.soft,
  },
  languageMenu: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    padding: 8,
    position: "absolute",
    right: 0,
    top: 38,
    width: 144,
    zIndex: 30,
    ...shadows.card,
  },
  languageTitle: {
    color: colors.muted,
    fontFamily: typography.family.medium,
    fontSize: 10,
    paddingHorizontal: 8,
    textTransform: "uppercase",
  },
  languageOption: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  languageOptionActive: {
    backgroundColor: colors.accent,
  },
  languageOptionText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 12,
  },
  languageOptionTextActive: {
    color: colors.primary,
    fontFamily: typography.family.semiBold,
  },
  heroWrap: {
    paddingHorizontal: 16,
  },
  hero: {
    backgroundColor: colors.primaryDeep,
    borderRadius: 26,
    height: 184,
    overflow: "hidden",
    ...shadows.deep,
  },
  heroImage: {
    borderRadius: 26,
    opacity: 0.52,
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,38,124,0.5)",
  },
  heroSoftShape: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 120,
    height: 104,
    position: "absolute",
    right: -34,
    top: -28,
    width: 204,
  },
  heroContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 22,
    lineHeight: 26,
    maxWidth: 285,
  },
  heroMeta: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 12,
    marginTop: 14,
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: typography.family.regular,
    fontSize: 12,
    marginTop: 2,
  },
  heroButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: "row",
    gap: 7,
    marginTop: 15,
    paddingHorizontal: 17,
    paddingVertical: 10,
    ...shadows.soft,
  },
  heroButtonText: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  partnerWrap: {
    paddingHorizontal: 16,
  },
  partnerCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: "#dbe7f8",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
    ...shadows.card,
  },
  partnerIcon: {
    alignItems: "center",
    backgroundColor: "#edfdfa",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  partnerLogo: {
    height: 36,
    width: 36,
  },
  flex: {
    flex: 1,
  },
  eyebrow: {
    color: colors.muted,
    fontFamily: typography.family.medium,
    fontSize: 8,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  partnerTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 13,
    marginTop: 2,
  },
  partnerSub: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 9,
    lineHeight: 12,
    marginTop: 1,
  },
  advantagesCard: {
    backgroundColor: "#087052",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: 16,
    minHeight: 174,
    overflow: "hidden",
    paddingHorizontal: 17,
    paddingVertical: 18,
    ...shadows.deep,
  },
  advantagesText: {
    flex: 1,
    paddingRight: 92,
  },
  darkTitle: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 18,
  },
  advantageList: {
    gap: 8,
    marginTop: 12,
  },
  advantageRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 5,
  },
  check: {
    color: "#d7ff75",
    fontFamily: typography.family.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  advantageText: {
    color: "rgba(255,255,255,0.98)",
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  trophy: {
    bottom: -2,
    height: 118,
    position: "absolute",
    right: 8,
    width: 118,
  },
  sectionsWrap: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "#e2e9f5",
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    marginHorizontal: 16,
    padding: 12,
    ...shadows.soft,
  },
  sectionTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  gridItem: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "#dfe8f6",
    borderRadius: 20,
    borderWidth: 1,
    gap: 7,
    height: 74,
    justifyContent: "center",
    width: "31%",
    ...shadows.card,
  },
  gridIcon: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  gridLabel: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 10,
    lineHeight: 12,
    textAlign: "center",
  },
  parentsCard: {
    backgroundColor: "#071a7b",
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
    borderWidth: 1,
    marginHorizontal: 16,
    padding: 14,
    ...shadows.deep,
  },
  parentsSub: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: typography.family.regular,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  parentsList: {
    gap: 9,
    marginTop: 13,
  },
  parentRow: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  parentIcon: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  parentTitle: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 12,
  },
  parentSub: {
    color: "rgba(255,255,255,0.66)",
    fontFamily: typography.family.regular,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 1,
  },
  expenseSection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  expenseCard: {
    alignItems: "center",
    backgroundColor: "#f3f8ff",
    borderColor: "#cfe2ff",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 16,
    ...shadows.card,
  },
  expenseIcon: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: 17,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  expenseTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 16,
  },
  expenseSub: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  expenseArrow: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "#d8e8ff",
    borderRadius: 16,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
});

