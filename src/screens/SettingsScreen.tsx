import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import React, { useState } from "react";

import type { RootStackParamList } from "../navigation/types";
import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Section } from "../components/Section";
import { languages, useI18n, type Language } from "../i18n";
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
                    navigation.navigate(item.target, { tab: item.label === "dorm" ? "dorm" : "city" });
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
});
