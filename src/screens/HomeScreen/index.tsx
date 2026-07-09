import { useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import heroBg from "../../assets/9.jpeg";
import ektuLogo from "../../assets/ektu-logo.png";
import LinearGradient from "react-native-linear-gradient";
import { useI18n, languages, type Language } from "../../i18n";
import { PremiumIcon } from "../../components/PremiumIcon";
import { Screen, Stack } from "../../components/Screen";
import { colors, shadows, typography } from "../../theme";
import { useHomeNavigation } from "./useHomeNavigation";
import { AnimatedButton } from "./AnimatedButton";
import { SectionTile } from "./SectionTile";
import { sectionConfig, advantageKeys, parentItems, expenseCards } from "./config";

export function HomeScreen() {
  console.log("HomeScreen: Rendering start");
  const { language, setLanguage, t } = useI18n();
  const { navigateToTab, navigateToInfo, navigateToStack } = useHomeNavigation();
  const [languageOpen, setLanguageOpen] = useState(false);
  console.log("HomeScreen: Language is", language);

  const handleLanguageChange = async (nextLanguage: Language) => {
    await setLanguage(nextLanguage);
    setLanguageOpen(false);
  };

  const handleSectionNavigate = (config: (typeof sectionConfig)[0]) => {
    config.navigate(navigateToTab, navigateToInfo as any);
  };

  return (
    <Screen contentContainerStyle={styles.screenContent}>
      <Stack style={styles.stack}>
        <View pointerEvents="none" style={styles.topGradient}>
          <View style={styles.topGradientStrong} />
          <View style={styles.topGradientSoft} />
          <View style={styles.topGradientFade} />
        </View>

        {/* Header */}
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

            {languageOpen && (
              <View style={styles.languageMenu}>
                <Text style={styles.languageTitle}>{t("language")}</Text>
                {languages.map((item) => {
                  const active = item.id === language;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleLanguageChange(item.id)}
                      style={[styles.languageOption, active && styles.languageOptionActive]}
                      activeOpacity={0.78}
                    >
                      <Text
                        style={
                          active
                            ? [styles.languageOptionText, styles.languageOptionTextActive]
                            : styles.languageOptionText
                        }
                      >
                        {item.label}
                      </Text>
                      {active && <Ionicons name="checkmark" size={15} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <ImageBackground source={heroBg} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{t("heroTitle")}</Text>
              <Text style={styles.heroMeta}>{t("heroMeta")}</Text>
              <Text style={styles.heroSub}>{t("heroSub")}</Text>
              <AnimatedButton
                style={styles.heroButton}
                onPress={() => Linking.openURL("https://www.ektu.kz/enrollee2.aspx")}
              >
                <Text style={styles.heroButtonText}>{t("applyOnline")}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </AnimatedButton>
            </View>
          </ImageBackground>
        </View>

        {/* Partner Card */}
        <View style={styles.partnerWrap}>
          <AnimatedButton
            style={styles.partnerCard}
            onPress={() => Linking.openURL("https://ektu.kz/")}
          >
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

        {/* Advantages Card */}
        <LinearGradient
          colors={["#0F766E", "#064E3B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.advantagesCard}
        >
          <View style={styles.advantagesText}>
            <Text style={styles.darkTitle}>{t("advantagesTitle")}</Text>
            <View style={styles.advantageList}>
              {advantageKeys.map((key) => (
                <View key={key} style={styles.advantageRow}>
                  <Ionicons name="checkmark-circle" size={18} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.advantageText}>{t(key)}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Sections Grid */}
        <View style={[styles.sectionsWrap, { zIndex: 99, elevation: 10 }]}>
          <Text style={styles.sectionTitle}>{t("sectionsTitle")}</Text>
          <View style={styles.grid}>
            {sectionConfig.map((item) => (
              <SectionTile
                key={item.key}
                icon={item.icon}
                label={t(item.labelKey)}
                onNavigate={() => handleSectionNavigate(item)}
              />
            ))}
          </View>
        </View>

        {/* Parents Section */}
        <LinearGradient
          colors={["#1e3c72", "#2a5298"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.parentsCard}
        >
          <Text style={styles.darkTitle}>{t("parentsTitle")}</Text>
          <Text style={styles.parentsSub}>{t("parentsSub")}</Text>
          <View style={styles.parentsList}>
            {parentItems.map((item) => (
              <AnimatedButton
                key={item.title}
                style={styles.parentRow}
                onPress={() => navigateToStack("Parents")}
              >
                <View style={styles.parentIconWrapper}>
                  <Ionicons name={item.icon} size={16} color="#1E3C72" />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.parentTitle}>{t(item.title)}</Text>
                  <Text style={styles.parentSub}>{t(item.sub)}</Text>
                </View>
                <View style={styles.chevronWrapper}>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </View>
              </AnimatedButton>
            ))}
          </View>
        </LinearGradient>

        {/* Expense Cards */}
        <View style={styles.expenseSection}>
          {expenseCards.map((card) => (
            <AnimatedButton
              key={card.screen}
              style={styles.expenseCard}
              onPress={() => navigateToStack(card.screen)}
            >
              <View style={styles.expenseIcon}>
                <PremiumIcon name={card.icon} size={48} tone={card.tone} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.expenseTitle}>{t(card.titleKey)}</Text>
                <Text style={styles.expenseSub}>{t(card.subKey)}</Text>
              </View>
              <View style={styles.expenseArrow}>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
            </AnimatedButton>
          ))}
        </View>
      </Stack>
    </Screen>
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
    backgroundColor: "#f8fbff",
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
    fontWeight: "800",
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
    marginTop: 8,
    minWidth: 140,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 36,
    zIndex: 100,
    ...shadows.card,
  },
  languageTitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingTop: 10,
    textTransform: "uppercase",
  },
  languageOption: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  languageOptionActive: {
    backgroundColor: colors.accent,
  },
  languageOptionText: {
    color: colors.foreground,
    fontSize: 14,
    flex: 1,
  },
  languageOptionTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  heroWrap: {
    borderRadius: 20,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  hero: {
    minHeight: 220,
    justifyContent: "flex-end",
  },
  heroImage: {
    opacity: 1, // Full opacity since we use overlay
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  heroContent: {
    gap: 8,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  heroMeta: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSub: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    lineHeight: 21,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 10,
  },
  heroButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  partnerWrap: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  partnerCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...shadows.soft,
  },
  partnerIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  partnerLogo: {
    height: 48,
    width: 48,
  },
  flex: {
    flex: 1,
  },
  eyebrow: {
    color: colors.label,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  partnerTitle: {
    color: colors.foreground,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 2,
  },
  partnerSub: {
    color: "#475569", // Refined graphite color
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  advantagesCard: {
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  advantagesText: {
    flex: 1,
    gap: 12,
    zIndex: 2,
  },
  darkTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  advantageList: {
    gap: 10,
  },
  advantageRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  check: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  advantageText: {
    color: colors.white,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  bgIcon: {
    position: "absolute",
    right: -20,
    bottom: -20,
    opacity: 0.15,
    transform: [{ rotate: "-15deg" }],
  },
  screenContent: {
    paddingBottom: 20,
  },
  stack: {
    gap: 4,
  },
  sectionsWrap: {
    marginHorizontal: 16,
    marginVertical: 2,
    zIndex: 10,
    elevation: 5,
  },
  sectionTitle: {
    color: colors.foreground,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    zIndex: 100,
  },
  parentsCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 2,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  parentsSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  parentsList: {
    gap: 8,
    marginTop: 12,
  },
  parentRow: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 14,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  parentIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronWrapper: {
    opacity: 0.4,
  },
  parentTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: typography.family.semiBold,
    fontWeight: "600",
    lineHeight: 20,
  },
  parentSub: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  expenseSection: {
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  expenseCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  expenseIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  expenseTitle: {
    color: colors.foreground,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  expenseSub: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  expenseArrow: {
    alignItems: "center",
    justifyContent: "center",
  },
});
