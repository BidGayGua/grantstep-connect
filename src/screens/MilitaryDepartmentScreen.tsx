import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { colors, shadows, typography } from "../theme";

const selectionSteps = [
  { title: "Успеваемость", text: "Учитывается средний балл (GPA) за весь период обучения.", icon: "star" },
  { title: "Физподготовка", text: "Сдача нормативов: бег (100м, 3000м) и подтягивания на перекладине.", icon: "fitness" },
  { title: "Медкомиссия", text: "Прохождение медицинского освидетельствования на годность к воинской службе.", icon: "medkit" },
  { title: "Психотесты", text: "Профессионально-психологическое тестирование в военкомате.", icon: "clipboard" },
];

export function MilitaryDepartmentScreen() {
  const navigation = useNavigation();

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
          <Text style={styles.headerTitle}>Военная кафедра</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark" size={26} color={colors.white} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.heroTitle}>Стань офицером запаса</Text>
            <Text style={styles.heroText}>Подготовка квалифицированных кадров для Вооруженных Сил РК без отрыва от учебы.</Text>
          </View>
        </View>

        <Section title="Условия поступления">
          <View style={styles.infoCard}>
            <Text style={styles.bodyText}>
              Поступление на военную кафедру осуществляется среди студентов <Text style={styles.semiBold}>1-го или 2-го курсов</Text> (в зависимости от программы обучения). Обучение позволяет получить военную специальность параллельно с основной профессией.
            </Text>
          </View>
        </Section>

        <Section title="Этапы отбора">
          <View style={styles.stepsGrid}>
            {selectionSteps.map((step) => (
              <View key={step.title} style={styles.stepItem}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Результат обучения">
          <View style={styles.resultCard}>
            <Ionicons name="ribbon-outline" size={24} color={colors.primary} />
            <Text style={styles.resultText}>
              По окончании университета выпускники получают <Text style={styles.semiBold}>военный билет</Text> одновременно с дипломом. Это дает право на присвоение звания лейтенанта или сержанта запаса и открывает путь к карьере в госорганах и силовых структурах.
            </Text>
          </View>
        </Section>

        <View style={styles.contactFooter}>
          <Text style={styles.contactLabel}>Есть вопросы по военной кафедре?</Text>
          <Text style={styles.contactSub}>Обратитесь в приемную комиссию ВКТУ:</Text>
          <TouchableOpacity
            style={styles.contactLink}
            onPress={() => Linking.openURL("tel:+77232267409")}
          >
            <Ionicons name="call" size={18} color={colors.primary} />
            <Text style={styles.contactValue}>+7 (7232) 26-74-09</Text>
          </TouchableOpacity>
        </View>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
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
    borderRadius: 24,
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    padding: 20,
    ...shadows.card,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 20,
  },
  heroText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    ...shadows.soft,
  },
  bodyText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  semiBold: {
    fontFamily: typography.family.semiBold,
    color: colors.primary,
  },
  stepsGrid: {
    gap: 12,
    marginHorizontal: 20,
  },
  stepItem: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    flexDirection: "row",
    gap: 14,
    padding: 16,
    ...shadows.soft,
  },
  stepIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  stepTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
  },
  stepText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  resultCard: {
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    borderColor: "#dbeafe",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    padding: 18,
  },
  resultText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  contactFooter: {
    backgroundColor: colors.card,
    borderRadius: 24,
    margin: 20,
    padding: 20,
    alignItems: "center",
    ...shadows.soft,
  },
  contactLabel: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
  },
  contactSub: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    marginTop: 4,
  },
  contactLink: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  contactValue: {
    color: colors.primary,
    fontFamily: typography.family.bold,
    fontSize: 16,
  },
});
