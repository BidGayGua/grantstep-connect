import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import React, { useState } from "react";

import type { RootStackParamList } from "../navigation/types";
import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Section } from "../components/Section";
import { PremiumIcon } from "../components/PremiumIcon";
import { languages, useI18n, type Language } from "../i18n";
import { useAuth } from "../lib/auth-store";
import { colors, shadows, typography } from "../theme";

const extra = [
  { icon: "flask", label: "labs", target: "Labs" },
  { icon: "school", label: "parentsMenu", target: "Parents" },
  { icon: "business", label: "dorm", target: "Info" },
  { icon: "location", label: "city", target: "Info" },
] as const;

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language, setLanguage, t } = useI18n();
  const { isLoggedIn, user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSupport = () => {
    Alert.alert(
      t("support"),
      t("supportAlert"),
      [
        { text: t("supportCall"), onPress: () => Linking.openURL("tel:+77232267409") },
        { text: t("supportWrite"), onPress: () => Linking.openURL("mailto:admission@ektu.kz") },
        { text: t("cancel"), style: "cancel" },
      ]
    );
  };

  return (
    <Screen>
      <Stack>
        <ScreenHeader title={t("settings")} />

        {!isLoggedIn ? (
          <TouchableOpacity
            style={styles.authBanner}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Auth")}
          >
            <View style={styles.authBannerContent}>
              <View style={styles.authBannerText}>
                <Text style={styles.authBannerTitle}>{t("authBannerTitle")}</Text>
                <Text style={styles.authBannerSub}>{t("authBannerSub")}</Text>
              </View>
              <View style={styles.authBannerIcon}>
                <PremiumIcon size={32} />
              </View>
            </View>
            <View style={styles.authBannerButton}>
              <Text style={styles.authBannerButtonText}>{t("login")}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userStatus}>{t("statusEnrolled")}</Text>
            </View>
            <TouchableOpacity onPress={signOut} style={styles.signOutSmall}>
              <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.officialCard}
          activeOpacity={0.7}
          onPress={() => Linking.openURL("https://www.ektu.kz/admissiondetails.aspx")}
        >
          <View style={styles.officialIcon}>
            <Ionicons name="open-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.officialTitle}>{t("officialAdmission")}</Text>
            <Text style={styles.officialSub}>
              {t("officialAdmissionDesc")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </TouchableOpacity>

        <Section title={t("interfaceLanguage")}>

          <View style={styles.segmented}>
            {languages.map((item) => {
              const active = language === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setLanguage(item.id as Language)}
                  style={[styles.segment, active && styles.segmentActive]}
                  activeOpacity={0.7}
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
          <View style={styles.menu}>
            {extra.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, index !== extra.length - 1 && styles.divider]}
                onPress={() => {
                  if (item.target === "Info") {
                    navigation.navigate(item.target, { kind: item.label === "dorm" ? "dorm" : "city" });
                  } else {
                    // @ts-ignore
                    navigation.navigate(item.target);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as never} size={18} color={colors.foreground} />
                </View>
                <Text style={styles.menuText}>{t(item.label)}</Text>
                <Ionicons name="chevron-forward" size={17} color={colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title={t("settings")}>
          <View style={styles.menu}>
            <View style={[styles.menuRow, styles.divider]}>
              <View style={styles.menuIcon}>
                <Ionicons name="notifications" size={18} color={colors.foreground} />
              </View>
              <Text style={styles.menuText}>{t("notifications")}</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <TouchableOpacity
              style={[styles.menuRow, styles.divider]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SpecialtyPicker")}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="color-wand" size={18} color={colors.foreground} />
              </View>
              <Text style={styles.menuText}>{t("specialtyPickerTitle")}</Text>
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={handleSupport}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle" size={18} color={colors.foreground} />
              </View>
              <Text style={styles.menuText}>{t("support")}</Text>
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </Section>

        {isLoggedIn && (
          <TouchableOpacity
            style={styles.signOutButton}
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(t("signOut"), t("supportAlert"), [
                { text: t("cancel"), style: "cancel" },
                { text: t("signOut"), style: "destructive", onPress: signOut },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            <Text style={styles.signOutText}>{t("signOut")}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.version}>GrantStep x ВКТУ · v 1.0.0</Text>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  officialCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: "#c8d7ee",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    padding: 15,
    marginTop: 15,
    ...shadows.deep,
  },
  officialIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  officialTitle: {
    color: colors.foreground,
    fontSize: 14,
    fontFamily: typography.family.medium,
  },
  officialSub: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  flex: {
    flex: 1,
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
    fontFamily: typography.family.medium,
  },
  segmentTextActive: {
    color: colors.primary,
  },
  menu: {
    backgroundColor: colors.card,
    borderColor: "#c8d7ee",
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
    fontFamily: typography.family.medium,
  },
  version: {
    color: colors.muted,
    fontSize: 11,
    paddingBottom: 8,
    textAlign: "center",
  },
  authBanner: {
    backgroundColor: colors.primaryDeep,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    ...shadows.deep,
  },
  authBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  authBannerText: {
    flex: 1,
    paddingRight: 10,
  },
  authBannerTitle: {
    ...typography.cardTitle,
    color: colors.white,
    fontSize: 18,
    marginBottom: 4,
  },
  authBannerSub: {
    ...typography.meta,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },
  authBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  authBannerButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  authBannerButtonText: {
    ...typography.button,
    color: colors.white,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    marginTop: 10,
    borderColor: "#c8d7ee",
    borderWidth: 1,
    ...shadows.soft,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    ...typography.title,
    fontSize: 20,
    color: colors.primary,
  },
  userEmail: {
    ...typography.cardTitle,
    color: colors.foreground,
  },
  userStatus: {
    ...typography.meta,
    color: colors.success,
    fontWeight: "600",
  },
  signOutSmall: {
    padding: 8,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginHorizontal: 20,
    backgroundColor: "rgba(209, 67, 67, 0.08)",
    borderRadius: 20,
    borderColor: "rgba(209, 67, 67, 0.2)",
    borderWidth: 1,
  },
  signOutText: {
    ...typography.button,
    color: colors.destructive,
  },
});
