import React, { useState, useMemo } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";

import { Screen, Stack } from "../components/Screen";
import { useI18n, TranslationKey } from "../i18n";
import { colors, shadows, typography } from "../theme";
import { useAdmission, admissionStore } from "../lib/admission-store";
import { specialties, faculties, Specialty } from "../data/specialties";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export function SpecialtyPickerScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();
  const admission = useAdmission();

  const [selectedCombination, setSelectedCombination] = useState<TranslationKey | null>(null);
  const [score, setScore] = useState("");
  const [showResults, setShowResults] = useState(false);

  const combinations = useMemo(() => {
    const keys = Array.from(
      new Set(specialties.map((s) => s.subjectKey).filter((k): k is TranslationKey => !!k)),
    );
    return keys.map((key) => ({
      id: key,
      label: t(key),
    }));
  }, [t]);

  const filteredSpecialties = useMemo(() => {
    if (!selectedCombination) return [];
    return specialties.filter((s) => s.subjectKey === selectedCombination);
  }, [selectedCombination]);

  const handleSelectCombination = (id: TranslationKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCombination(id);
    setShowResults(false);
  };

  const handleCalculate = () => {
    if (!score || parseInt(score) < 50) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setShowResults(true);
  };

  const handleSelectSpecialty = (specialty: Specialty) => {
    const specName = t(specialty.titleKey);
    Alert.alert(t("confirmSelectionTitle"), t("confirmSelectionText").replace("{name}", specName), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("yes"),
        onPress: () => {
          admissionStore.setSelectedSpecialty(specName);
          navigation.goBack();
        },
      },
    ]);
  };

  const getChanceBadge = (minScore: number, userScore: number) => {
    const diff = userScore - minScore;
    if (diff >= 10) {
      return { text: t("chanceHigh"), color: "#22C55E", bg: "#DCFCE7" };
    } else if (diff >= 0) {
      return { text: t("chanceMedium"), color: "#EAB308", bg: "#FEF9C3" };
    } else {
      return { text: t("chanceLow"), color: "#F97316", bg: "#FFEDD5" };
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Stack>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.82}
            >
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t("pickSpecialty")}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {admission.selectedSpecialty && (
            <View style={styles.currentSpecialty}>
              <Text style={styles.currentSpecialtyLabel}>{t("selectedSpecialty")}:</Text>
              <Text style={styles.currentSpecialtyName}>{admission.selectedSpecialty}</Text>
            </View>
          )}

          {/* STEP 1: Subjects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("stepSubjects")}</Text>
            <View style={styles.chipsContainer}>
              {combinations.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, selectedCombination === item.id && styles.chipActive]}
                  onPress={() => handleSelectCombination(item.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.chipText, selectedCombination === item.id && styles.chipTextActive]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* STEP 2: Score */}
          {selectedCombination && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("stepScore")}</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.scoreInput}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  maxLength={3}
                  value={score}
                  onChangeText={setScore}
                />
                <TouchableOpacity
                  style={[
                    styles.calculateButton,
                    (!score || parseInt(score) < 50) && styles.calculateButtonDisabled,
                  ]}
                  onPress={handleCalculate}
                  activeOpacity={0.8}
                >
                  <Text style={styles.calculateButtonText}>{t("calculate")}</Text>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={colors.white}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>
              {score !== "" && (parseInt(score) < 50 || parseInt(score) > 140) && (
                <Text style={styles.errorText}>{t("invalidScore")}</Text>
              )}
            </View>
          )}

          {/* STEP 3: Results */}
          {showResults && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("matchingSpecialties")}</Text>
              {filteredSpecialties.map((item) => {
                const userScore = parseInt(score) || 0;
                const badge = getChanceBadge(item.minScore || 50, userScore);
                const specName = t(item.titleKey);
                const isSelected = admission.selectedSpecialty === specName;
                const faculty = faculties.find((f) => f.id === item.facultyId);
                const schoolName = faculty ? t(faculty.shortTitleKey) : "";

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.specialtyCard, isSelected && styles.specialtyCardSelected]}
                    onPress={() => handleSelectSpecialty(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.specialtyHeader}>
                      <View style={styles.schoolBadge}>
                        <Text style={styles.schoolText}>{schoolName}</Text>
                      </View>
                      <View style={[styles.chanceBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.chanceText, { color: badge.color }]}>{badge.text}</Text>
                      </View>
                    </View>
                    <Text style={styles.specialtyCode}>{item.code}</Text>
                    <Text style={styles.specialtyName}>{specName}</Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                        <Text style={styles.selectedBadgeText}>{t("uploadedStatus")}</Text>
                      </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.cardFooter}>
                      <Text style={styles.metaText}>{t("minScoreLabel")}</Text>
                      <Text style={styles.minScoreText}>
                        {item.minScore} {t("pointsShort")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {filteredSpecialties.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color={colors.muted} />
                  <Text style={styles.emptyText}>{t("noSpecialtiesFound")}</Text>
                </View>
              )}
            </View>
          )}
        </Stack>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 20,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.foreground,
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: typography.family.medium,
    color: colors.foreground,
  },
  chipTextActive: {
    color: colors.white,
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  scoreInput: {
    flex: 1,
    fontSize: 32,
    fontFamily: typography.family.bold,
    color: colors.primary,
    textAlign: "center",
    paddingVertical: 0,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  calculateButtonDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.6,
  },
  calculateButtonText: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 15,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  specialtyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  specialtyCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  currentSpecialty: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.accent,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary + "33",
  },
  currentSpecialtyLabel: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: typography.family.medium,
    marginBottom: 4,
  },
  currentSpecialtyName: {
    fontSize: 16,
    color: colors.foreground,
    fontFamily: typography.family.bold,
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  selectedBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: typography.family.bold,
  },
  specialtyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  schoolBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  schoolText: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: typography.family.semiBold,
  },
  chanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chanceText: {
    fontSize: 11,
    fontFamily: typography.family.bold,
  },
  specialtyCode: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: typography.family.medium,
  },
  specialtyName: {
    fontSize: 17,
    fontFamily: typography.family.bold,
    color: colors.foreground,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: typography.family.regular,
  },
  minScoreText: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: typography.family.bold,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
