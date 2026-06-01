import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Section } from "../components/Section";
import { useI18n, type TranslationKey } from "../i18n";
import {
  admissionStore,
  docProgress,
  documentsStore,
  useDocuments,
  type DocId,
  type DocStatus,
} from "../lib/documents-store";
import { colors, shadows } from "../theme";

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

const statusLabel: Record<DocStatus, TranslationKey> = {
  missing: "missingStatus",
  uploaded: "uploadedStatus",
  review: "reviewStatus",
  approved: "approvedStatus",
};

const statusStyle: Record<DocStatus, { bg: string; color: string; icon: "cloud-upload" | "checkmark" | "time" }> = {
  missing: { bg: colors.accent, color: colors.primary, icon: "cloud-upload" },
  uploaded: { bg: "#eaf0ff", color: colors.primary, icon: "checkmark" },
  review: { bg: "#fff2cc", color: colors.warning, icon: "time" },
  approved: { bg: "#dff5e9", color: colors.success, icon: "checkmark" },
};

export function DocumentsScreen() {
  const { t } = useI18n();
  const state = useDocuments();
  const [uploading, setUploading] = useState<DocId | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const { done, total, percent } = docProgress(state);
  const allDone = done === total;

  const uploadDocument = (id: DocId) => {
    setUploading(id);
    setTimeout(() => {
      const nextStatus: DocStatus = id === "id" || id === "att" ? "review" : "uploaded";
      documentsStore.set(id, nextStatus);
      setUploading(null);
    }, 650);
  };

  const submitApplication = () => {
    if (!allDone) return;
    admissionStore.submitApplication();
    setSuccessOpen(true);
  };

  return (
    <Screen>
      <Stack>
        <ScreenHeader title={t("documentsTitle")} subtitle={t("documentsSub")} />

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>{t("progress")}</Text>
              <Text style={styles.progressValue}>{percent}%</Text>
            </View>
            <View style={styles.progressRight}>
              <Text style={styles.progressSmall}>
                {done} {t("of")} {total}
              </Text>
              <Text style={styles.progressStep}>{t("uploaded")}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>

        <Section title={t("docsChecklist")}>
          <View style={styles.list}>
            {docs.map((doc) => {
              const status = state[doc.id];
              const isDone = status !== "missing";
              const style = statusStyle[status];
              const isUploading = uploading === doc.id;

              return (
                <View key={doc.id} style={styles.docCard}>
                  <View style={styles.docIcon}>
                    <Ionicons name={doc.icon} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.docBody}>
                    <Text style={styles.docTitle} numberOfLines={1}>
                      {t(doc.label)}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: style.bg }]}>
                      <Ionicons name={style.icon} size={11} color={style.color} />
                      <Text style={[styles.statusText, { color: style.color }]}>
                        {t(statusLabel[status])}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    disabled={isUploading}
                    onPress={() => uploadDocument(doc.id)}
                    style={[styles.actionButton, isDone && styles.actionButtonLight]}
                    activeOpacity={0.82}
                  >
                    <Ionicons
                      name={isDone ? "refresh" : "cloud-upload"}
                      size={13}
                      color={isDone ? colors.primary : colors.white}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        isDone && styles.actionButtonTextLight,
                      ]}
                    >
                      {isUploading ? "..." : isDone ? t("replace") : t("upload")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Section>

        <View style={styles.submitWrap}>
          <TouchableOpacity
            disabled={!allDone}
            onPress={submitApplication}
            style={[styles.submitButton, !allDone && styles.submitButtonDisabled]}
            activeOpacity={0.84}
          >
            <Ionicons name="document-text" size={18} color={colors.white} />
            <Text style={styles.submitText}>
              {allDone
                ? t("submitApplication")
                : `${t("uploadMore")} ${total - done} ${t("docsShort")}`}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>{t("submitHint")}</Text>
        </View>

        <Modal transparent visible={successOpen} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.successCard}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={34} color={colors.white} />
              </View>
              <Text style={styles.successTitle}>{t("applicationSentSuccess")}</Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={() => setSuccessOpen(false)}
                activeOpacity={0.84}
              >
                <Text style={styles.successButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    letterSpacing: 0.7,
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
  },
  progressSmall: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  progressStep: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 12,
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
  list: {
    gap: 10,
  },
  docCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12,
    ...shadows.soft,
  },
  docIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  docBody: {
    flex: 1,
  },
  docTitle: {
    color: colors.foreground,
    fontSize: 13,
    fontWeight: "500",
  },
  statusPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 11,
    flexDirection: "row",
    gap: 4,
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionButtonLight: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "500",
  },
  actionButtonTextLight: {
    color: colors.primary,
  },
  submitWrap: {
    paddingHorizontal: 20,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 15,
    ...shadows.card,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
  hint: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 9,
    textAlign: "center",
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(10,18,40,0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 22,
    width: "100%",
    ...shadows.card,
  },
  successIcon: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  successTitle: {
    color: colors.foreground,
    fontSize: 17,
    fontWeight: "500",
    marginTop: 14,
    textAlign: "center",
  },
  successButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 18,
    paddingHorizontal: 30,
    paddingVertical: 11,
  },
  successButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
});

