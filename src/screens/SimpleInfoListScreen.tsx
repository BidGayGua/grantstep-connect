import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PremiumIcon } from "../components/PremiumIcon";
import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n } from "../i18n";
import { colors, shadows, typography } from "../theme";

const scholarshipCards = [
  ["Государственная стипендия", "Для студентов на гранте с успешной академической успеваемостью.", "Грант, отсутствие академических долгов", "от 41 898 ₸"],
  ["Повышенная стипендия", "Для отличников и активных студентов с сильными результатами.", "GPA выше среднего, активность", "до +50%"],
  ["Президентская стипендия", "Для студентов с особыми достижениями в учебе и науке.", "Конкурс, научные публикации", "индивидуально"],
  ["Социальная поддержка", "Помощь студентам из социально уязвимых категорий.", "Подтверждающие документы", "по программе"],
] as const;

const scholarshipFaq = [
  ["Кто получает государственную стипендию?", "Студенты на гранте, которые выполняют академические требования и не имеют задолженностей."],
  ["Можно ли получать повышенную стипендию?", "Да, при высокой успеваемости, активности и выполнении условий конкретной программы."],
  ["Нужны ли документы для социальной поддержки?", "Да, потребуется подтвердить категорию официальными документами."],
] as const;

const militaryFaq = [
  ["Когда можно поступить?", "Обучение начинается со 2 курса по утвержденному графику университета."],
  ["Нужна ли медицинская комиссия?", "Да, медицинская комиссия является одним из обязательных этапов отбора."],
  ["Какие документы нужны?", "Заявление, удостоверение личности, справки, фото и документы по требованиям кафедры."],
] as const;

export function ScholarshipScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();
  const [score, setScore] = useState(85);
  const [science, setScience] = useState(false);
  const [olympiad, setOlympiad] = useState(false);
  const [social, setSocial] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const amount = useMemo(() => {
    let base = score >= 90 ? 63000 : score >= 75 ? 42000 : 0;
    if (science) base += 12000;
    if (olympiad) base += 15000;
    if (social) base += 10000;
    return base;
  }, [olympiad, science, score, social]);

  return (
    <Screen>
      <Stack>
        <Header title={t("scholarshipsTitle")} onBack={() => navigation.goBack()} />
        <Hero
          title={t("scholarshipsTitle")}
          subtitle="Финансовые возможности и программы поддержки студентов ВКТУ"
          icon="cash-outline"
          tone="green"
        />

        <View style={styles.statsGrid}>
          {["Государственная", "Повышенная", "Международные", "Социальная"].map((item, index) => (
            <View key={item} style={styles.statCard}>
              <PremiumIcon name={["cash-outline", "trophy-outline", "globe-outline", "heart-outline"][index] as never} size={42} iconSize={18} tone={index === 1 ? "green" : "blue"} />
              <Text style={styles.statText}>{item}</Text>
            </View>
          ))}
        </View>

        <Section title="Виды стипендий">
          <View style={styles.cardList}>
            {scholarshipCards.map((item) => (
              <View key={item[0]} style={styles.detailCard}>
                <Text style={styles.cardTitle}>{item[0]}</Text>
                <Text style={styles.cardText}>{item[1]}</Text>
                <InfoPair label="Eligibility" value={item[2]} />
                <InfoPair label="Amount" value={item[3]} />
                <TouchableOpacity style={styles.lightButton}>
                  <Text style={styles.lightButtonText}>Подробнее</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Калькулятор стипендии">
          <View style={styles.calculatorCard}>
            <Text style={styles.calcLabel}>Средний балл: {score}</Text>
            <View style={styles.scoreRow}>
              {[70, 80, 90, 95].map((value) => (
                <TouchableOpacity key={value} onPress={() => setScore(value)} style={[styles.scoreChip, score === value && styles.scoreChipActive]}>
                  <Text style={[styles.scoreChipText, score === value && styles.scoreChipTextActive]}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Toggle label="Научная деятельность" value={science} onPress={() => setScience(!science)} />
            <Toggle label="Олимпиады" value={olympiad} onPress={() => setOlympiad(!olympiad)} />
            <Toggle label="Социальная категория" value={social} onPress={() => setSocial(!social)} />
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Предполагаемая стипендия</Text>
              <Text style={styles.resultValue}>{money(amount)} ₸ / месяц</Text>
              <Text style={styles.resultNote}>Бонусы считаются ориентировочно для планирования.</Text>
            </View>
          </View>
        </Section>

        <Accordion title="Частые вопросы" items={scholarshipFaq} open={openFaq} setOpen={setOpenFaq} />

        <Section title="Полезные ссылки">
          <View style={styles.linkGrid}>
            {["Scholarship programs", "Official resources", "Support contacts"].map((item) => (
              <View key={item} style={styles.linkCard}>
                <Ionicons name="link-outline" size={18} color={colors.primary} />
                <Text style={styles.linkText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Узнать подробнее</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </Stack>
    </Screen>
  );
}

export function MilitaryDepartmentScreen() {
  const navigation = useNavigation();
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Screen>
      <Stack>
        <Header title={t("militaryTitle")} onBack={() => navigation.goBack()} />
        <Hero
          title={t("militaryTitle")}
          subtitle="Военная подготовка студентов ВКТУ"
          icon="shield-checkmark-outline"
          tone="blue"
        />

        <Section title="О программе">
          <View style={styles.textCard}>
            <Text style={styles.bodyText}>
              Военная кафедра помогает студентам получить дополнительную подготовку, развить дисциплину, лидерство и прикладные навыки. Обучение начинается со 2 курса. Срок обучения: Лейтенант — 2.5 года, Сержант — 1.5 года.
            </Text>
          </View>
        </Section>

        <Section title="Кто может поступить">
          <View style={styles.statsGrid}>
            {["Студенты ВКТУ", "Медицинская годность", "Хорошая успеваемость", "Конкурсный отбор"].map((item) => (
              <View key={item} style={styles.statCard}>
                <PremiumIcon name="checkmark-circle-outline" size={42} iconSize={18} tone="blue" />
                <Text style={styles.statText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Этапы поступления">
          <View style={styles.timelineCard}>
            {["Подача документов", "Медицинская комиссия", "Тестирование", "Конкурсный отбор", "Зачисление"].map((item, index) => (
              <View key={item} style={styles.timelineRow}>
                <View style={styles.timelineNumber}><Text style={styles.timelineNumberText}>{index + 1}</Text></View>
                <Text style={styles.timelineText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Преимущества">
          <View style={styles.cardList}>
            {["Лейтенант — 2.5 года", "Сержант — 1.5 года", "Военная подготовка", "Преимущества при трудоустройстве"].map((item) => (
              <View key={item} style={styles.benefitCard}>
                <PremiumIcon name="ribbon-outline" size={40} iconSize={18} tone="blue" />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Документы">
          <View style={styles.listCard}>
            {["Заявление", "Удостоверение личности", "Фото 3x4", "Медицинские справки", "Справка об обучении"].map((item) => (
              <View key={item} style={styles.listRow}>
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Accordion title="FAQ" items={militaryFaq} open={openFaq} setOpen={setOpenFaq} />

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Подать заявку</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </Stack>
    </Screen>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.82}>
        <Ionicons name="arrow-back" size={20} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function Hero({ title, subtitle, icon, tone }: { title: string; subtitle: string; icon: "cash-outline" | "shield-checkmark-outline"; tone: "blue" | "green" }) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.flex}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroText}>{subtitle}</Text>
      </View>
      <PremiumIcon name={icon} size={64} iconSize={28} tone={tone} />
    </View>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPair}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Toggle({ label, value, onPress }: { label: string; value: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onPress} activeOpacity={0.82}>
      <Text style={styles.toggleText}>{label}</Text>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleDot, value && styles.toggleDotActive]} />
      </View>
    </TouchableOpacity>
  );
}

function Accordion({
  items,
  open,
  setOpen,
  title,
}: {
  items: readonly (readonly [string, string])[];
  open: number | null;
  setOpen: (index: number | null) => void;
  title: string;
}) {
  return (
    <Section title={title}>
      <View style={styles.accordion}>
        {items.map((item, index) => {
          const active = open === index;
          return (
            <View key={item[0]} style={styles.accordionItem}>
              <TouchableOpacity style={styles.accordionHead} onPress={() => setOpen(active ? null : index)}>
                <Text style={styles.accordionQuestion}>{item[0]}</Text>
                <Ionicons name={active ? "chevron-up" : "chevron-down"} size={18} color={colors.primary} />
              </TouchableOpacity>
              {active ? <Text style={styles.accordionAnswer}>{item[1]}</Text> : null}
            </View>
          );
        })}
      </View>
    </Section>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
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
  headerSpacer: { width: 38 },
  flex: { flex: 1 },
  heroCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    padding: 20,
    ...shadows.card,
  },
  heroTitle: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 24,
  },
  heroText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 9,
    padding: 13,
    width: "48%",
    ...shadows.soft,
  },
  statText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  cardList: { gap: 10 },
  detailCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 15,
    ...shadows.soft,
  },
  cardTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 16,
  },
  cardText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  infoPair: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 10,
  },
  infoLabel: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 11,
  },
  infoValue: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
    marginTop: 2,
  },
  lightButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  lightButtonText: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  calculatorCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 15,
    ...shadows.soft,
  },
  calcLabel: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 8,
  },
  scoreChip: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    flex: 1,
    paddingVertical: 10,
  },
  scoreChipActive: {
    backgroundColor: colors.primary,
  },
  scoreChipText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 12,
    textAlign: "center",
  },
  scoreChipTextActive: {
    color: colors.white,
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  toggle: {
    backgroundColor: colors.secondary,
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 3,
    width: 46,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleDot: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  toggleDotActive: {
    alignSelf: "flex-end",
  },
  resultBox: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 14,
  },
  resultLabel: {
    color: "rgba(255,255,255,0.74)",
    fontFamily: typography.family.regular,
    fontSize: 12,
  },
  resultValue: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 24,
    marginTop: 4,
  },
  resultNote: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: typography.family.regular,
    fontSize: 11,
    marginTop: 4,
  },
  accordion: { gap: 10 },
  accordionItem: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  accordionHead: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  accordionQuestion: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  accordionAnswer: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  linkGrid: { gap: 9 },
  linkCard: {
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
  linkText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  textCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 15,
    ...shadows.soft,
  },
  bodyText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 15,
    ...shadows.soft,
  },
  timelineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
  },
  timelineNumber: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  timelineNumberText: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 12,
  },
  timelineText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  benefitCard: {
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
  benefitText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  listCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 9,
    padding: 14,
    ...shadows.soft,
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  listText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 14,
  },
});
