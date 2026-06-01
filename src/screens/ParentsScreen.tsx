import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n, type TranslationKey } from "../i18n";
import {
  docProgress,
  useAdmission,
  type DocId,
  type DocStatus,
} from "../lib/documents-store";
import { expenseTotal, useExpenses, type ExpenseFieldId } from "../lib/expenses-store";
import { colors, shadows, typography } from "../theme";

const docs: {
  id: DocId;
  label: TranslationKey;
  icon: "card" | "reader" | "camera" | "heart" | "ribbon";
}[] = [
  { id: "id", label: "idDoc", icon: "card" },
  { id: "att", label: "attDoc", icon: "reader" },
  { id: "photo", label: "photoDoc", icon: "camera" },
  { id: "med", label: "medDoc", icon: "heart" },
  { id: "ent", label: "entDoc", icon: "ribbon" },
];

const expenseRows: { id: ExpenseFieldId; label: TranslationKey; icon: string }[] = [
  { id: "dorm", label: "dormCost", icon: "bed-outline" },
  { id: "food", label: "foodCost", icon: "restaurant-outline" },
  { id: "transport", label: "transportCost", icon: "bus-outline" },
  { id: "materials", label: "materialsCost", icon: "book-outline" },
];

const parentCards: { title: TranslationKey; sub: TranslationKey; icon: string }[] = [
  { title: "parentDiploma", sub: "parentDiplomaSub", icon: "reader-outline" },
  { title: "parentDorm", sub: "parentDormSub", icon: "bed-outline" },
  { title: "parentJobs", sub: "parentJobsSub", icon: "briefcase-outline" },
  { title: "parentSafety", sub: "parentSafetySub", icon: "shield-checkmark-outline" },
  { title: "parentInternational", sub: "parentInternationalSub", icon: "globe-outline" },
];

const docStatusMeta: Record<
  DocStatus,
  { label: TranslationKey; icon: "alert-circle" | "checkmark" | "time"; color: string; bg: string }
> = {
  missing: {
    label: "parentStatusMissing",
    icon: "alert-circle",
    color: colors.muted,
    bg: colors.secondary,
  },
  uploaded: {
    label: "uploadedStatus",
    icon: "checkmark",
    color: colors.primary,
    bg: colors.accent,
  },
  review: {
    label: "reviewStatus",
    icon: "time",
    color: colors.warning,
    bg: "#fff2cc",
  },
  approved: {
    label: "approvedStatus",
    icon: "checkmark",
    color: colors.success,
    bg: "#dff5e9",
  },
};

export function ParentsScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();
  const admission = useAdmission();
  const expenses = useExpenses();
  const docsProgress = docProgress(admission.documents);
  const total = expenseTotal(expenses.values);
  const docsReady = docsProgress.done === docsProgress.total;
  const submitted =
    admission.applicationStatus === "application_submitted" ||
    admission.applicationStatus === "under_review" ||
    admission.applicationStatus === "approved";
  const approved = admission.applicationStatus === "approved";
  const timeline = [
    { label: "parentStepSpecialty", done: Boolean(admission.selectedSpecialty), active: !admission.selectedSpecialty },
    { label: "parentStepDocs", done: docsReady, active: Boolean(admission.selectedSpecialty) && !docsReady },
    { label: "parentStepReview", done: submitted, active: submitted && !approved },
    { label: "parentStepResults", done: approved, active: false },
    { label: "parentStepEnrollment", done: approved, active: false },
  ] satisfies { label: TranslationKey; done: boolean; active: boolean }[];

  return (
    <Screen>
      <Stack>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.82}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("parentsTitle")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="people" size={26} color={colors.white} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.heroTitle}>{t("parentsTitle")}</Text>
            <Text style={styles.heroText}>{t("parentsScreenSub")}</Text>
          </View>
        </View>

        <Section title={t("parentAdmissionStatus")}>
          <View style={styles.statusCard}>
            <View style={styles.progressHead}>
              <Text style={styles.progressText}>
                {docsProgress.done} {t("of")} {docsProgress.total} {t("navDocuments").toLowerCase()}
              </Text>
              <Text style={styles.progressPercent}>{docsProgress.percent}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${docsProgress.percent}%` }]} />
            </View>
            <View style={styles.timeline}>
              {timeline.map((item) => (
                <View key={item.label} style={styles.timelineRow}>
                  <View
                    style={[
                      styles.timelineIcon,
                      item.done && styles.timelineDone,
                      item.active && styles.timelineActive,
                    ]}
                  >
                    <Ionicons
                      name={item.done ? "checkmark" : item.active ? "time" : "ellipse-outline"}
                      size={15}
                      color={item.done || item.active ? colors.white : colors.muted}
                    />
                  </View>
                  <Text
                    style={[
                      styles.timelineText,
                      item.done && styles.timelineTextDone,
                      item.active && styles.timelineTextActive,
                    ]}
                  >
                    {t(item.label)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Section>

        <Section title={t("documentsTitle")}>
          <View style={styles.docsCard}>
            {docs.map((doc, index) => {
              const status = admission.documents[doc.id];
              const meta = docStatusMeta[status];
              return (
                <View key={doc.id} style={[styles.docRow, index !== docs.length - 1 && styles.divider]}>
                  <View style={styles.docIcon}>
                    <Ionicons name={doc.icon} size={19} color={colors.primary} />
                  </View>
                  <Text style={styles.docTitle}>{t(doc.label)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon} size={11} color={meta.color} />
                    <Text style={[styles.statusBadgeText, { color: meta.color }]}>
                      {t(meta.label)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Section>

        <Section title={t("parentExpensesTitle")}>
          <View style={styles.expensesCard}>
            {expenseRows.map((row) => (
              <View key={row.id} style={styles.expenseRow}>
                <View style={styles.expenseIcon}>
                  <Ionicons name={row.icon as never} size={18} color={colors.primary} />
                </View>
                <Text style={styles.expenseLabel}>{t(row.label)}</Text>
                <Text style={styles.expenseValue}>
                  {formatMoney(expenses.values[row.id])} {t("tenge")}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t("totalPerMonth")}</Text>
              <Text style={styles.totalValue}>
                {new Intl.NumberFormat("ru-RU").format(total)} {t("tenge")}
              </Text>
            </View>
          </View>
        </Section>

        <Section title={t("parentsWhyTitle")}>
          <View style={styles.reasonGrid}>
            {parentCards.map((item) => (
              <View key={item.title} style={styles.reasonCard}>
                <View style={styles.reasonIcon}>
                  <Ionicons name={item.icon as never} size={19} color={colors.primary} />
                </View>
                <Text style={styles.reasonTitle}>{t(item.title)}</Text>
                <Text style={styles.reasonSub}>{t(item.sub)}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("contactsTitle")}>
          <View style={styles.contactsCard}>
            <ContactRow icon="school-outline" label={t("admissionOffice")} value="ВКТУ имени Д. Серикбаева" />
            <ContactRow icon="call-outline" label={t("phone")} value="+7 (7232) 26-74-09" />
            <ContactRow icon="mail-outline" label={t("email")} value="admission@ektu.kz" />
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL("https://ektu.kz/")}
              activeOpacity={0.82}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="globe-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.contactLabel}>{t("website")}</Text>
                <Text style={styles.contactValue}>https://ektu.kz/</Text>
              </View>
              <Ionicons name="open-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Section>
      </Stack>
    </Screen>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: "call-outline" | "mail-outline" | "school-outline";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatMoney(value: string) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0));
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
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
  flex: {
    flex: 1,
  },
  heroCard: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 24,
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    padding: 18,
    ...shadows.card,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 21,
  },
  heroText: {
    color: "rgba(255,255,255,0.78)",
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 15,
    ...shadows.soft,
  },
  progressHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
  },
  progressPercent: {
    color: colors.primary,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  track: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    height: 8,
    marginTop: 10,
    overflow: "hidden",
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 8,
  },
  timeline: {
    gap: 11,
    marginTop: 15,
  },
  timelineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  timelineIcon: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  timelineDone: {
    backgroundColor: colors.success,
  },
  timelineActive: {
    backgroundColor: colors.primary,
  },
  timelineText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
  },
  timelineTextDone: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
  },
  timelineTextActive: {
    color: colors.primary,
    fontFamily: typography.family.semiBold,
  },
  docsCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  docRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 13,
  },
  divider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  docIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  docTitle: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  statusBadge: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontFamily: typography.family.medium,
    fontSize: 10,
  },
  expensesCard: {
    backgroundColor: "#f7fbff",
    borderColor: "#d8e8ff",
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 14,
    ...shadows.soft,
  },
  expenseRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  expenseIcon: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "#d8e8ff",
    borderRadius: 12,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  expenseLabel: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 13,
  },
  expenseValue: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 13,
  },
  totalRow: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  totalLabel: {
    color: "rgba(255,255,255,0.78)",
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  totalValue: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 16,
  },
  reasonGrid: {
    gap: 10,
  },
  reasonCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    padding: 13,
    ...shadows.soft,
  },
  reasonIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 13,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  reasonTitle: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  reasonSub: {
    color: colors.muted,
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  contactsCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  contactRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 11,
    padding: 13,
  },
  contactIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  contactLabel: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 11,
  },
  contactValue: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
    marginTop: 2,
  },
});
