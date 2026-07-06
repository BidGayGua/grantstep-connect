import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PremiumIcon } from "../components/PremiumIcon";
import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n, type TranslationKey } from "../i18n";
import {
  expenseStore,
  expenseTotal,
  useExpenses,
  type ExpenseFieldId,
  type ExpensePresetId,
} from "../lib/expenses-store";
import { colors, shadows, typography } from "../theme";

const fields: {
  id: ExpenseFieldId;
  label: TranslationKey;
  icon: "bed-outline" | "restaurant-outline" | "bus-outline" | "book-outline" | "wifi-outline" | "wallet-outline";
  max: number;
  presets: number[];
}[] = [
  { id: "dorm", label: "dormCost", icon: "bed-outline", max: 60000, presets: [10000, 10000, 10000] },
  { id: "food", label: "foodCost", icon: "restaurant-outline", max: 120000, presets: [90000, 65000, 45000] },
  { id: "transport", label: "transportCost", icon: "bus-outline", max: 30000, presets: [20000, 12000, 8000] },
  { id: "materials", label: "materialsCost", icon: "book-outline", max: 35000, presets: [20000, 12000, 7000] },
  { id: "internet", label: "internetCost", icon: "wifi-outline", max: 15000, presets: [10000, 7000, 5000] },
  { id: "personal", label: "personalCost", icon: "wallet-outline", max: 60000, presets: [35000, 20000, 10000] },
];

const cityNotes: Record<ExpensePresetId, string> = {
  economy: "Астана: самый дорогой сценарий, выше питание, проезд и личные расходы.",
  medium: "Алматы: средний сценарий, дешевле Астаны, но дороже Усть-Каменогорска.",
  comfort: "Усть-Каменогорск: самый выгодный студенческий бюджет.",
};

export function ExpenseCalculatorScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();
  const expenses = useExpenses();
  const total = expenseTotal(expenses.values);
  const maxCategory = fields.reduce((winner, field) => {
    const value = Number(expenses.values[field.id] || 0);
    return value > Number(expenses.values[winner.id] || 0) ? field : winner;
  }, fields[0]);

  const setNumber = (id: ExpenseFieldId, next: number) => {
    expenseStore.setField(id, String(Math.max(0, next)));
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <Stack>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.82}>
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t("expenseCalculator")}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroKicker}>Budget planner</Text>
              <Text style={styles.heroTitle}>{t("totalPerMonth")}</Text>
              <Text style={styles.heroValue}>{money(total)}</Text>
            </View>
            <PremiumIcon name="calculator-outline" size={62} iconSize={28} tone="cyan" />
          </View>

          <View style={styles.presets}>
            {(["economy", "medium", "comfort"] as ExpensePresetId[]).map((preset) => {
              const active = expenses.activePreset === preset;
              return (
                <TouchableOpacity
                  key={preset}
                  onPress={() => expenseStore.applyPreset(preset)}
                  style={[styles.presetButton, active && styles.presetButtonActive]}
                  activeOpacity={0.82}
                >
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>
                    {t(preset)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.cityNote}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.cityNoteText}>{cityNotes[expenses.activePreset]}</Text>
          </View>

          <Section title="Категории расходов">
            <View style={styles.categoryList}>
              {fields.map((field) => {
                const value = Number(expenses.values[field.id] || 0);
                const percent = Math.min(100, Math.round((value / field.max) * 100));
                return (
                  <View key={field.id} style={styles.categoryCard}>
                    <View style={styles.categoryHead}>
                      <PremiumIcon name={field.icon} size={42} iconSize={19} tone={field.id === "dorm" ? "orange" : "blue"} />
                      <View style={styles.flex}>
                        <Text style={styles.categoryTitle}>{t(field.label)}</Text>
                        <Text style={styles.categoryMeta}>{money(value)} / месяц</Text>
                      </View>
                      <View style={styles.inputWrap}>
                        <TextInput
                          value={expenses.values[field.id] ? money(expenses.values[field.id]) : ""}
                          onChangeText={(text) => expenseStore.setField(field.id, text.replace(/\D/g, ""))}
                          keyboardType="number-pad"
                          style={styles.input}
                        />
                      </View>
                    </View>
                    <View style={styles.sliderTrack}>
                      <View style={[styles.sliderFill, { width: `${percent}%` }]} />
                    </View>
                    <View style={styles.controls}>
                      <TouchableOpacity style={styles.stepButton} onPress={() => setNumber(field.id, value - 1000)}>
                        <Ionicons name="remove" size={16} color={colors.primary} />
                      </TouchableOpacity>
                      {(field.id === "dorm"
                        ? getDormPresets(expenses.activePreset, t)
                        : field.presets.map((p) => ({ label: money(p), value: p }))
                      ).map((p, idx) => (
                        <TouchableOpacity
                          key={`${field.id}-${idx}`}
                          style={styles.quickButton}
                          onPress={() => setNumber(field.id, p.value)}
                        >
                          <Text style={styles.quickText}>{p.label}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity style={styles.stepButton} onPress={() => setNumber(field.id, value + 1000)}>
                        <Ionicons name="add" size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </Section>

          <Section title="Расчёт в реальном времени">
            <View style={styles.totalGrid}>
              <TotalBox label="В месяц" value={total} />
              <TotalBox label="За семестр" value={total * 5} />
              <TotalBox label="За учебный год" value={total * 10} />
              <TotalBox label="За 4 года" value={total * 40} />
            </View>
          </Section>

          <Section title="Визуализация расходов">
            <View style={styles.chartCard}>
              <Text style={styles.chartLead}>
                Больше всего занимает: {t(maxCategory.label)}
              </Text>
              {fields.map((field) => {
                const value = Number(expenses.values[field.id] || 0);
                const percent = total > 0 ? Math.round((value / total) * 100) : 0;
                return (
                  <View key={field.id} style={styles.chartRow}>
                    <Text style={styles.chartLabel}>{t(field.label)}</Text>
                    <View style={styles.chartTrack}>
                      <View style={[styles.chartFill, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.chartPercent}>{percent}%</Text>
                  </View>
                );
              })}
            </View>
          </Section>

          <Section title="Советы по экономии">
            <View style={styles.tipsGrid}>
              {[
                "В Астане закладывайте больший бюджет на питание, транспорт и личные расходы.",
                "Алматы обычно ближе к среднему сценарию: ниже Астаны, но выше Усть-Каменогорска.",
                "В Усть-Каменогорске студенческий бюджет заметно выгоднее, особенно по питанию и проезду.",
              ].map((tip) => (
                <View key={tip} style={styles.tipCard}>
                  <Ionicons name="bulb-outline" size={18} color={colors.primary} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Сравнение городов">
            <View style={styles.scenarioRow}>
              {(["economy", "medium", "comfort"] as ExpensePresetId[]).map((preset) => (
                <TouchableOpacity key={preset} style={styles.scenarioCard} onPress={() => expenseStore.applyPreset(preset)}>
                  <Text style={styles.scenarioTitle} numberOfLines={1}>{t(preset)}</Text>
                  <Text style={styles.scenarioValue}>
                    {money(expenseTotal(expenses.allCityValues[preset]))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.84}
            onPress={() => Alert.alert("Расчёт сохранён", "Ваш бюджет будет доступен в родительском кабинете.")}
          >
            <Ionicons name="save-outline" size={18} color={colors.white} />
            <Text style={styles.saveText}>Сохранить расчёт</Text>
          </TouchableOpacity>
        </Stack>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function TotalBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.totalBox}>
      <Text style={styles.totalBoxLabel}>{label}</Text>
      <Text style={styles.totalBoxValue}>{money(value)}</Text>
    </View>
  );
}

function money(value: number | string) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₸";
}

function getDormPresets(presetId: ExpensePresetId, t: (key: TranslationKey) => string) {
  if (presetId === "comfort") {
    return [
      { label: t("dorm1"), value: 10000 },
      { label: t("dorm2"), value: 10000 },
      { label: t("dorm3"), value: 10000 },
    ];
  }
  const vals = presetId === "economy" ? [40000, 60000, 80000] : [30000, 45000, 60000];
  return vals.map((v) => ({ label: money(v), value: v }));
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
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
  headerSpacer: { width: 38 },
  flex: { flex: 1 },
  heroCard: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    padding: 20,
    ...shadows.deep,
  },
  heroKicker: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: typography.family.medium,
    fontSize: 11,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
    marginTop: 8,
  },
  heroValue: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 28,
    marginTop: 2,
  },
  presets: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
  },
  presetButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 11,
    ...shadows.soft,
  },
  presetButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  presetTextActive: { color: colors.white },
  cityNote: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    padding: 12,
    ...shadows.soft,
  },
  cityNoteText: {
    color: colors.muted,
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  categoryList: { gap: 12 },
  categoryCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    ...shadows.soft,
  },
  categoryHead: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
  },
  categoryTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  categoryMeta: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    marginTop: 2,
  },
  inputWrap: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    minWidth: 88,
    paddingHorizontal: 8,
  },
  input: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
    paddingVertical: 8,
    textAlign: "right",
  },
  sliderTrack: {
    backgroundColor: colors.secondary,
    borderRadius: 7,
    height: 9,
    marginTop: 12,
    overflow: "hidden",
  },
  sliderFill: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    height: 9,
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 10,
  },
  stepButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 13,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  quickButton: {
    backgroundColor: colors.secondary,
    borderRadius: 13,
    flex: 1,
    paddingVertical: 8,
  },
  quickText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 11,
    textAlign: "center",
  },
  totalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  totalBox: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    width: "48%",
    ...shadows.soft,
  },
  totalBoxLabel: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 11,
  },
  totalBoxValue: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 14,
    ...shadows.soft,
  },
  chartLead: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  chartRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  chartLabel: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 11,
    width: 86,
  },
  chartTrack: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    flex: 1,
    height: 8,
    overflow: "hidden",
  },
  chartFill: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 8,
  },
  chartPercent: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 11,
    width: 34,
  },
  tipsGrid: { gap: 9 },
  tipCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 13,
    ...shadows.soft,
  },
  tipText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  scenarioRow: {
    flexDirection: "row",
    gap: 8,
  },
  scenarioCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    padding: 12,
    ...shadows.soft,
  },
  scenarioTitle: {
    color: colors.muted,
    fontFamily: typography.family.medium,
    fontSize: 10,
  },
  scenarioValue: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 13,
    marginTop: 5,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    ...shadows.card,
  },
  saveText: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 14,
  },
});
