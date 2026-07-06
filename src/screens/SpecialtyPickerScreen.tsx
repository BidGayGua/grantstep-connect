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
import { useI18n } from "../i18n";
import { colors, shadows, typography } from "../theme";
import { useAdmission, admissionStore } from "../lib/admission-store";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const COMBINATIONS = [
  { id: "MathPhys", label: "Математика + Физика" },
  { id: "MathInfo", label: "Математика + Информатика" },
  { id: "GeoMath", label: "География + Математика" },
  { id: "ChemPhys", label: "Химия + Физика" },
];

const SPECIALTIES = [
  {
    id: "1",
    code: "B057",
    name: "Информационные технологии",
    school: "Школа информационных технологий",
    subjects: "MathInfo",
    minScore: 92,
  },
  {
    id: "2",
    code: "B058",
    name: "Информационная безопасность",
    school: "Школа информационных технологий",
    subjects: "MathInfo",
    minScore: 95,
  },
  {
    id: "3",
    code: "B064",
    name: "Механика и металлообработка",
    school: "Школа машиностроения",
    subjects: "MathPhys",
    minScore: 78,
  },
  {
    id: "4",
    code: "B074",
    name: "Строительство",
    school: "Школа архитектуры и строительства",
    subjects: "MathPhys",
    minScore: 82,
  },
  {
    id: "5",
    code: "B095",
    name: "Транспортные услуги",
    school: "Школа машиностроения",
    subjects: "MathPhys",
    minScore: 75,
  },
  {
    id: "6",
    code: "B060",
    name: "Химическая технология",
    school: "Школа наук о Земле",
    subjects: "ChemPhys",
    minScore: 80,
  },
  {
    id: "7",
    code: "B093",
    name: "Логистика (в сервисе)",
    school: "Школа бизнеса",
    subjects: "GeoMath",
    minScore: 85,
  },
  {
    id: "8",
    code: "B071",
    name: "Горное дело",
    school: "Школа наук о Земле",
    subjects: "MathPhys",
    minScore: 70,
  },
  {
    id: "9",
    code: "B059",
    name: "Коммуникации и технологии связи",
    school: "Школа информационных технологий",
    subjects: "MathInfo",
    minScore: 88,
  },
  {
    id: "10",
    code: "B061",
    name: "Материаловедение и технологии",
    school: "Школа наук о Земле",
    subjects: "ChemPhys",
    minScore: 72,
  },
];

export function SpecialtyPickerScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();
  const admission = useAdmission();

  const [selectedCombination, setSelectedCombination] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredSpecialties = useMemo(() => {
    if (!selectedCombination) return [];
    return SPECIALTIES.filter((s) => s.subjects === selectedCombination);
  }, [selectedCombination]);

  const handleSelectCombination = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCombination(id);
    setShowResults(false);
  };

  const handleCalculate = () => {
    if (!score || parseInt(score) < 50) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setShowResults(true);
  };

  const handleSelectSpecialty = (specialty: (typeof SPECIALTIES)[0]) => {
    Alert.alert(
      "Выбор специальности",
      `Вы выбрали "${specialty.name}". Подтвердить?`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Да",
          onPress: () => {
            admissionStore.setSelectedSpecialty(specialty.name);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const getChanceBadge = (minScore: number, userScore: number) => {
    const diff = userScore - minScore;
    if (diff >= 10) {
      return { text: "Высокий шанс", color: "#22C55E", bg: "#DCFCE7" };
    } else if (diff >= 0) {
      return { text: "Средний шанс", color: "#EAB308", bg: "#FEF9C3" };
    } else {
      return { text: "Платное / Квота", color: "#F97316", bg: "#FFEDD5" };
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
            <Text style={styles.headerTitle}>Подбор специальностей</Text>
            <View style={styles.headerSpacer} />
          </View>

          {admission.selectedSpecialty && (
            <View style={styles.currentSpecialty}>
              <Text style={styles.currentSpecialtyLabel}>Выбранная специальность:</Text>
              <Text style={styles.currentSpecialtyName}>{admission.selectedSpecialty}</Text>
            </View>
          )}

          {/* STEP 1: Subjects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Выберите комбинацию предметов</Text>
            <View style={styles.chipsContainer}>
              {COMBINATIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.chip,
                    selectedCombination === item.id && styles.chipActive,
                  ]}
                  onPress={() => handleSelectCombination(item.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCombination === item.id && styles.chipTextActive,
                    ]}
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
              <Text style={styles.sectionTitle}>2. Введите ваш балл ЕНТ</Text>
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
                  <Text style={styles.calculateButtonText}>Подобрать</Text>
                  <Ionicons name="sparkles" size={18} color={colors.white} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
              {score !== "" && (parseInt(score) < 50 || parseInt(score) > 140) && (
                <Text style={styles.errorText}>Введите корректный балл (50-140)</Text>
              )}
            </View>
          )}

          {/* STEP 3: Results */}
          {showResults && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Подходящие специальности ВКТУ</Text>
              {filteredSpecialties.map((item) => {
                const badge = getChanceBadge(item.minScore, parseInt(score));
                const isSelected = admission.selectedSpecialty === item.name;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.specialtyCard, isSelected && styles.specialtyCardSelected]}
                    onPress={() => handleSelectSpecialty(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.specialtyHeader}>
                      <View style={styles.schoolBadge}>
                        <Text style={styles.schoolText}>{item.school}</Text>
                      </View>
                      <View style={[styles.chanceBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.chanceText, { color: badge.color }]}>{badge.text}</Text>
                      </View>
                    </View>
                    <Text style={styles.specialtyCode}>{item.code}</Text>
                    <Text style={styles.specialtyName}>{item.name}</Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                        <Text style={styles.selectedBadgeText}>Выбрано</Text>
                      </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.cardFooter}>
                      <Text style={styles.metaText}>Проходной балл 2023:</Text>
                      <Text style={styles.minScoreText}>{item.minScore} б.</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {filteredSpecialties.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color={colors.muted} />
                  <Text style={styles.emptyText}>К сожалению, по данной комбинации специальностей не найдено.</Text>
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
