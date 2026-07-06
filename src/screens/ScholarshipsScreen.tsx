import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { colors, shadows, typography } from "../theme";

const paymentOptions = [
  {
    title: "По семестрам",
    text: "Разделите годовую стоимость на две части: оплата перед началом осеннего и весеннего семестров.",
    icon: "calendar-outline",
  },
  {
    title: "Ежемесячная рассрочка",
    text: "Университет предоставляет возможность гибкой помесячной оплаты в течение учебного года по согласованию.",
    icon: "hourglass-outline",
  },
];

const grants = [
  {
    title: "Внутренние гранты ВКТУ",
    text: "Выделяются за высокие баллы ЕНТ и победы в предметных олимпиадах университета.",
    icon: "trophy-outline",
  },
  {
    title: "Скидки за отличную учебу",
    text: "Студенты, закрывающие сессии на «отлично», могут претендовать на снижение стоимости обучения.",
    icon: "star-outline",
  },
];

const paymentMethods = [
  { name: "Kaspi.kz", detail: "Раздел «Платежи» → «Образование» → «ВКТУ»", icon: "qr-code-outline" },
  { name: "Halyk Homebank", detail: "Оплата по реквизитам или через QR-код в приложении", icon: "card-outline" },
];

export function ScholarshipsScreen() {
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
          <Text style={styles.headerTitle}>Стоимость обучения</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="cash-outline" size={26} color={colors.white} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.heroTitle}>Инвестиция в будущее</Text>
            <Text style={styles.heroText}>Узнайте о стоимости, доступных грантах и удобных способах оплаты обучения в ВКТУ.</Text>
          </View>
        </View>

        <Section title="Варианты оплаты">
          <View style={styles.grid}>
            {paymentOptions.map((item) => (
              <View key={item.title} style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.infoTitle}>{item.title}</Text>
                  <Text style={styles.infoText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Гранты и скидки">
          <View style={styles.list}>
            {grants.map((item) => (
              <View key={item.title} style={styles.listCard}>
                <View style={styles.listIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Способы оплаты">
          <View style={styles.paymentCard}>
            <Text style={styles.paymentHint}>Вы можете быстро оплатить обучение через мобильные приложения банков:</Text>
            {paymentMethods.map((method, index) => (
              <View key={method.name} style={[styles.paymentRow, index !== 0 && styles.divider]}>
                <Ionicons name={method.icon} size={22} color={colors.primary} />
                <View style={styles.flex}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  <Text style={styles.paymentDetail}>{method.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <View style={styles.contactFooter}>
          <Text style={styles.contactTitle}>Остались вопросы по оплате?</Text>
          <Text style={styles.contactSub}>Свяжитесь с приемной комиссией для уточнения деталей:</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL("tel:+77232267409")}
            activeOpacity={0.82}
          >
            <Ionicons name="call" size={18} color={colors.white} />
            <Text style={styles.contactButtonText}>+7 (7232) 26-74-09</Text>
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
    backgroundColor: "#10b981",
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
  grid: { gap: 12, marginHorizontal: 20 },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    flexDirection: "row",
    gap: 14,
    padding: 16,
    ...shadows.soft,
  },
  infoIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  infoTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
  },
  infoText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  list: { gap: 10, marginHorizontal: 20 },
  listCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    ...shadows.soft,
  },
  listIcon: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  listTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  listText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 16,
    ...shadows.soft,
  },
  paymentHint: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    marginBottom: 12,
  },
  paymentRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  divider: { borderTopColor: colors.border, borderTopWidth: 1 },
  paymentName: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  paymentDetail: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    marginTop: 2,
  },
  contactFooter: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    margin: 20,
    padding: 20,
    ...shadows.card,
  },
  contactTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 18,
  },
  contactSub: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  contactButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
  },
  contactButtonText: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
});
