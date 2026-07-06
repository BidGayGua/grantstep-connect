import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { RootStackParamList } from "../navigation/types";
import { faculties, specialties } from "../data/specialties";
import { Screen } from "../components/Screen";
import { useI18n } from "../i18n";
import { colors, shadows } from "../theme";

export function SpecialtyDetailsScreen() {
  const { t } = useI18n();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "SpecialtyDetails">>();
  const specialty = specialties.find((item) => item.id === route.params.id);

  if (!specialty) {
    return null;
  }

  const faculty = faculties.find(f => f.id === specialty.facultyId);

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={typeof specialty.imageUrl === 'string' ? { uri: specialty.imageUrl } : specialty.imageUrl}
            style={styles.heroImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{specialty.code}</Text>
            </View>
            <Text style={styles.title}>{t(specialty.titleKey)}</Text>
            <Text style={styles.facultyName}>{faculty ? t(faculty.titleKey) : ""}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("description")}</Text>
            <Text style={styles.description}>{t(specialty.descriptionKey)}</Text>
          </View>

          {specialty.subjectsKeys && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("whatLearn")}</Text>
              <View style={styles.listContainer}>
                {specialty.subjectsKeys.map((key) => (
                  <View key={key} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>{t(key)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {specialty.skillsKeys && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("skillsTitle")}</Text>
              <View style={styles.tagsContainer}>
                {specialty.skillsKeys.map((key) => (
                  <View key={key} style={styles.tag}>
                    <Text style={styles.tagText}>{t(key)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {specialty.careerKeys && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("careerOpportunities")}</Text>
              <View style={styles.listContainer}>
                {specialty.careerKeys.map((key) => (
                  <View key={key} style={styles.listItem}>
                    <Ionicons name="briefcase-outline" size={18} color={colors.primary} style={styles.listIcon} />
                    <Text style={styles.listText}>{t(key)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {specialty.salaryRange && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("salaryEstimate")}</Text>
              <View style={styles.salaryCard}>
                <View style={styles.salaryItem}>
                  <Text style={styles.salaryLabel}>{t("juniorLevel")}</Text>
                  <Text style={styles.salaryValue}>
                    {specialty.salaryRange.junior} {t("tenge")}
                  </Text>
                </View>
                <View style={styles.salaryDivider} />
                <View style={styles.salaryItem}>
                  <Text style={styles.salaryLabel}>{t("middleLevel")}</Text>
                  <Text style={styles.salaryValue}>
                    {specialty.salaryRange.middle} {t("tenge")}
                  </Text>
                </View>
                <View style={styles.salaryDivider} />
                <View style={styles.salaryItem}>
                  <Text style={styles.salaryLabel}>{t("seniorLevel")}</Text>
                  <Text style={styles.salaryValue}>
                    {specialty.salaryRange.senior} {t("tenge")}
                  </Text>
                </View>
              </View>
              <Text style={styles.salaryDisclaimer}>{t("salaryDisclaimer")}</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.infoLabel}>{t("duration")}</Text>
                <Text style={styles.infoValue}>{t("durationValue")}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="school-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.infoLabel}>{t("degree")}</Text>
                <Text style={styles.infoValue}>{t("degreeValue")}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => Linking.openURL("https://www.ektu.kz/enrollee2.aspx")}
          >
            <Text style={styles.applyText}>{t("apply")}</Text>
            <Ionicons name="open-outline" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  hero: {
    height: 300,
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 24,
    marginTop: -30,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  headerInfo: {
    marginBottom: 24,
  },
  codeBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  codeText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: 32,
  },
  facultyName: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingRight: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  listIcon: {
    marginTop: 2,
  },
  listText: {
    fontSize: 15,
    color: colors.foreground,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  salaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  salaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  salaryLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "500",
    flex: 1,
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "right",
  },
  salaryDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    opacity: 0.5,
  },
  salaryDisclaimer: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  cardInfo: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    gap: 24,
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.foreground,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...shadows.soft,
  },
  applyText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

