import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Section } from "../components/Section";
import { useI18n, type TranslationKey } from "../i18n";
import { admissionProgress, docProgress, useAdmission } from "../lib/documents-store";
import { colors, shadows } from "../theme";

const steps = [
  { icon: "school", title: "stepChoose", desc: "stepChooseDesc" },
  { icon: "folder-open", title: "stepDocs", desc: "stepDocsDesc" },
  { icon: "send", title: "stepApply", desc: "stepApplyDesc" },
  { icon: "pulse", title: "stepTrack", desc: "stepTrackDesc" },
  { icon: "trophy", title: "stepResult", desc: "stepResultDesc" },
] as const;

const calendar = [
  { date: "20 июня", text: "Начало приёма документов" },
  { date: "01 июля", text: "Сдача ЕНТ" },
  { date: "10 августа", text: "Подача на гранты" },
  { date: "13 августа", text: "Объявление результатов" },
  { date: "25 августа", text: "Зачисление" },
];

const faqs = [
  {
    q: "faqGrantQ",
    a: "faqGrantA",
  },
  {
    q: "faqMinScoreQ",
    a: "faqMinScoreA",
  },
  {
    q: "faqOnlineQ",
    a: "faqOnlineA",
  },
] satisfies { q: TranslationKey; a: TranslationKey }[];

export function AdmissionScreen() {
  const { t } = useI18n();
  const admission = useAdmission();
  const { done, total } = docProgress(admission.documents);
  const percent = admissionProgress(admission);
  const [openFaq, setOpenFaq] = useState(0);
  const docsReady = done === total;
  const submitted =
    admission.applicationStatus === "application_submitted" ||
    admission.applicationStatus === "under_review" ||
    admission.applicationStatus === "approved";
  const approved = admission.applicationStatus === "approved";
  const activeIndex = !admission.selectedSpecialty
    ? 0
    : !docsReady
      ? 1
      : !submitted
        ? 2
        : !approved
          ? 3
          : 4;
  const nextIndex = Math.min(activeIndex + 1, steps.length - 1);

  return (
    <Screen>
      <Stack>
        <ScreenHeader title={t("admissionTitle")} subtitle={t("admissionSub")} />

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>{t("progress")}</Text>
              <Text style={styles.progressValue}>{percent}%</Text>
            </View>
            <View style={styles.progressRight}>
              <Text style={styles.progressSmall}>
                {t("step")} {activeIndex + 1} {t("of")} {steps.length}
              </Text>
              <Text style={styles.progressStep}>{t(steps[activeIndex].title)}</Text>
              <Text style={styles.nextStep}>
                {t("nextStep")}: {t(steps[nextIndex].title)}
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>

        <Section title={t("roadmap")}>
          <View style={styles.steps}>
            {steps.map((step, index) => {
              const isDone =
                (index === 0 && Boolean(admission.selectedSpecialty)) ||
                (index === 1 && docsReady) ||
                (index === 2 && submitted) ||
                (index === 3 && approved) ||
                (index === 4 && approved);
              const isActive = index === activeIndex;
              const bg = isDone
                ? colors.success
                : isActive
                  ? colors.primary
                  : colors.secondary;
              const iconColor = isDone || isActive ? colors.white : colors.muted;

              return (
                <View key={step.title} style={styles.stepRow}>
                  <View style={[styles.stepIcon, { backgroundColor: bg }]}>
                    <Ionicons
                      name={isDone ? "checkmark" : step.icon}
                      size={22}
                      color={iconColor}
                    />
                  </View>
                  <View style={[styles.stepCard, isActive && styles.stepCardActive]}>
                    <View style={styles.stepHead}>
                      <Text style={styles.stepLabel}>{t("step")} {index + 1}</Text>
                      {isActive ? <Text style={styles.nowBadge}>{t("now")}</Text> : null}
                      {isDone ? <Text style={styles.doneBadge}>{t("done")}</Text> : null}
                      {!isActive && !isDone ? (
                        <Text style={styles.waitingBadge}>{t("waiting")}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.stepTitle}>{t(step.title)}</Text>
                    <Text style={styles.stepDesc}>{t(step.desc)}</Text>
                    {index === 1 && !docsReady ? (
                      <Text style={styles.uploadedText}>
                        {t("uploadedDocs")} {done} {t("of")} {total} {t("navDocuments").toLowerCase()}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </Section>

        <Section title={t("admissionCalendar")}>
          <View style={styles.calendar}>
            {calendar.map((item, index) => (
              <View
                key={item.date}
                style={[
                  styles.calendarRow,
                  index !== calendar.length - 1 && styles.divider,
                ]}
              >
                <View style={styles.calendarIcon}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.calendarDate}>{item.date}</Text>
                  <Text style={styles.calendarText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("faqTitle")}>
          <View style={styles.faqCard}>
            {faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <View key={item.q} style={index !== faqs.length - 1 && styles.divider}>
                  <TouchableOpacity
                    onPress={() => setOpenFaq(open ? -1 : index)}
                    style={styles.faqButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.faqQuestion}>{t(item.q)}</Text>
                    <Ionicons
                      name={open ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                  {open ? <Text style={styles.faqAnswer}>{t(item.a)}</Text> : null}
                </View>
              );
            })}
          </View>
        </Section>

        <TouchableOpacity style={styles.questionButton} activeOpacity={0.84}>
          <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
          <Text style={styles.questionButtonText}>{t("askAdmission")}</Text>
        </TouchableOpacity>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: colors.primaryDeep,
    borderRadius: 22,
    marginHorizontal: 20,
    padding: 18,
    ...shadows.deep,
  },
  progressTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  progressValue: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "500",
    marginTop: 4,
  },
  progressRight: {
    alignItems: "flex-end",
    flexShrink: 1,
  },
  progressSmall: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "500",
  },
  progressStep: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
  nextStep: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },
  progressTrack: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 6,
    height: 8,
    marginTop: 14,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: colors.white,
    borderRadius: 6,
    height: 8,
  },
  steps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
  },
  stepIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    padding: 14,
    ...shadows.soft,
  },
  stepCardActive: {
    ...shadows.card,
  },
  stepHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  nowBadge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    color: colors.primary,
    fontSize: 10,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneBadge: {
    backgroundColor: colors.success,
    borderRadius: 10,
    color: colors.white,
    fontSize: 10,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  waitingBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    color: colors.muted,
    fontSize: 10,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepTitle: {
    color: colors.foreground,
    fontSize: 15,
    fontWeight: "500",
    marginTop: 7,
  },
  stepDesc: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  uploadedText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 8,
  },
  calendar: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  calendarRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  divider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  calendarIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 13,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  calendarDate: {
    color: colors.foreground,
    fontSize: 13,
    fontWeight: "500",
  },
  calendarText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  faqCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  faqButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 15,
  },
  faqQuestion: {
    color: colors.foreground,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  faqAnswer: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    paddingBottom: 14,
    paddingHorizontal: 15,
  },
  questionButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    ...shadows.card,
  },
  questionButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
});

