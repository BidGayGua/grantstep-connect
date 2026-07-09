import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useI18n, TranslationKey } from "../i18n";
import { colors, typography, spacing, shadows } from "../theme";

const CHECKLIST_STORAGE_KEY = "grantstep.checklist_progress";

interface ChecklistStep {
  id: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  hintKey: TranslationKey;
}

const steps: ChecklistStep[] = [
  {
    id: "step1",
    titleKey: "checklistStep1",
    descKey: "checklistDesc1",
    hintKey: "checklistHint1",
  },
  {
    id: "step2",
    titleKey: "checklistStep2",
    descKey: "checklistDesc2",
    hintKey: "checklistHint2",
  },
  {
    id: "step3",
    titleKey: "checklistStep3",
    descKey: "checklistDesc3",
    hintKey: "checklistHint3",
  },
  {
    id: "step4",
    titleKey: "checklistStep4",
    descKey: "checklistDesc4",
    hintKey: "checklistHint4",
  },
  {
    id: "step5",
    titleKey: "checklistStep5",
    descKey: "checklistDesc5",
    hintKey: "checklistHint5",
  },
  {
    id: "step6",
    titleKey: "checklistStep6",
    descKey: "checklistDesc6",
    hintKey: "checklistHint6",
  },
];

export function ChecklistScreen() {
  const { t } = useI18n();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const styles = React.useMemo(() => createStyles(), []);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (stored) {
        setCompletedSteps(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load checklist progress", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = async (id: string) => {
    const nextState = {
      ...completedSteps,
      [id]: !completedSteps[id],
    };
    setCompletedSteps(nextState);
    try {
      await AsyncStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.error("Failed to save checklist progress", e);
    }
  };

  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = (doneCount / steps.length) * 100;

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("checklistTitle")}</Text>
          <Text style={styles.subtitle}>{t("checklistSub")}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {t("checklistProgress")
                .replace("{done}", doneCount.toString())
                .replace("{total}", steps.length.toString())}
            </Text>
            <Text style={styles.percentText}>{Math.round(progressPercent)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.stepsList}>
          {steps.map((step, index) => {
            const isCompleted = !!completedSteps[step.id];
            return (
              <TouchableOpacity
                key={step.id}
                activeOpacity={0.7}
                onPress={() => toggleStep(step.id)}
                style={[styles.stepCard, isCompleted && styles.stepCardCompleted]}
              >
                <View style={styles.stepIconContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      isCompleted ? styles.checkboxChecked : styles.checkboxUnchecked,
                    ]}
                  >
                    {isCompleted && <Ionicons name="checkmark" size={16} color="#FFF" />}
                  </View>
                  {index < steps.length - 1 && <View style={styles.connector} />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, isCompleted && styles.stepTitleCompleted]}>
                    {t(step.titleKey)}
                  </Text>
                  <Text style={styles.stepDesc}>{t(step.descKey)}</Text>
                  {t(step.hintKey) && (
                    <View style={styles.hintBox}>
                      <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
                      <Text style={styles.hintText}>{t(step.hintKey)}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 40,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.family.bold,
    color: "#0F172A",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.family.regular,
    color: "#64748B",
    lineHeight: 22,
  },
  progressContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.m,
  },
  progressText: {
    fontSize: 15,
    fontFamily: typography.family.semiBold,
    color: "#334155",
  },
  percentText: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepsList: {
    paddingTop: spacing.s,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: spacing.m,
    marginBottom: spacing.m,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: "transparent",
  },
  stepCardCompleted: {
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F5F9",
  },
  stepIconContainer: {
    alignItems: "center",
    marginRight: spacing.m,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxUnchecked: {
    borderColor: "#CBD5E1",
    backgroundColor: "transparent",
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginTop: spacing.xs,
    marginBottom: -spacing.m - 4,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 17,
    fontFamily: typography.family.bold,
    color: "#1E293B",
    marginBottom: 4,
  },
  stepTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  stepDesc: {
    fontSize: 14,
    fontFamily: typography.family.regular,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 8,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  hintText: {
    fontSize: 12,
    fontFamily: typography.family.medium,
    color: colors.primary,
    marginLeft: 4,
  },
});
