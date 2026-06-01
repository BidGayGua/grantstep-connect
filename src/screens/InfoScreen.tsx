import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { RootStackParamList } from "../../App";
import campus from "../assets/campus.jpg";
import dorm from "../assets/dorm.jpg";
import labs from "../assets/spec-ai.jpg";
import architecture from "../assets/spec-architecture.jpg";
import energy from "../assets/spec-energy.jpg";
import isImage from "../assets/spec-is.jpg";
import metallurgy from "../assets/spec-metallurgy.jpg";
import software from "../assets/spec-software.jpg";
import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n, type Language, type TranslationKey } from "../i18n";
import { colors, shadows, typography } from "../theme";

export type InfoKind = "about" | "dorm" | "labs" | "parents" | "city" | "faq";

const siteUrl = "https://ektu.kz/";
const galleryImages = [campus, labs, architecture, energy, isImage, metallurgy, software];
const dormGallery = [dorm, campus, architecture, labs, energy];

const content = {
  ru: {
    aboutTitle: "О ВКТУ",
    aboutHero: "Восточно-Казахстанский технический университет имени Д. Серикбаева",
    aboutLead:
      "Технический университет с сильной инженерной школой, современными лабораториями и практической подготовкой для промышленности, IT и инфраструктуры Казахстана.",
    official: "Перейти на официальный сайт",
    history: "История университета",
    stats: "Ключевые показатели",
    why: "Почему выбирают ВКТУ",
    gallery: "Фотогалерея",
    life: "Студенческая жизнь",
    ready: "Готовы поступать?",
    readyText: "Выберите направление и начните подготовку документов прямо сейчас.",
    chooseSpecialty: "Выбрать специальность",
    submitDocs: "Подать документы",
    dormTitle: "Общежитие",
    dormLead:
      "Общежития ВКТУ помогают студентам жить рядом с учебным корпусом, экономить бюджет и быстрее адаптироваться к университетской среде.",
    aboutDorm: "О общежитии",
    roomTypes: "Типы комнат",
    available: "Что доступно студентам",
    howGetPlace: "Как получить место",
    dormMap: "Карта общежитий",
    dormFaq: "Частые вопросы",
    dormCta: "Подать заявку на общежитие",
    faqTitle: "FAQ",
    faqLead: "Быстрые ответы на вопросы абитуриентов и родителей.",
    searchPlaceholder: "Введите вопрос...",
    categories: ["Все", "Поступление", "Гранты", "Документы", "Общежитие", "ЕНТ", "Специальности"],
    popular: "Популярные вопросы",
    help: "Нужна помощь?",
    call: "Позвонить",
    write: "Написать",
    openSite: "Открыть сайт",
  },
  kk: {
    aboutTitle: "ВКТУ туралы",
    aboutHero: "Д. Серікбаев атындағы Шығыс Қазақстан техникалық университеті",
    aboutLead:
      "Инженерлік мектебі мықты, заманауи зертханалары бар және Қазақстан өнеркәсібі, IT және инфрақұрылымы үшін тәжірибелік дайындық беретін техникалық университет.",
    official: "Ресми сайтқа өту",
    history: "Университет тарихы",
    stats: "Негізгі көрсеткіштер",
    why: "Неліктен ВКТУ таңдайды",
    gallery: "Фотогалерея",
    life: "Студенттік өмір",
    ready: "Оқуға түсуге дайынсыз ба?",
    readyText: "Бағытты таңдап, құжат дайындауды қазір бастаңыз.",
    chooseSpecialty: "Мамандық таңдау",
    submitDocs: "Құжат тапсыру",
    dormTitle: "Жатақхана",
    dormLead:
      "ВКТУ жатақханалары студенттерге оқу корпусына жақын тұруға, бюджет үнемдеуге және университет ортасына тез бейімделуге көмектеседі.",
    aboutDorm: "Жатақхана туралы",
    roomTypes: "Бөлме түрлері",
    available: "Студенттерге қолжетімді",
    howGetPlace: "Орынды қалай алуға болады",
    dormMap: "Жатақханалар картасы",
    dormFaq: "Жиі сұрақтар",
    dormCta: "Жатақханаға өтініш беру",
    faqTitle: "FAQ",
    faqLead: "Талапкерлер мен ата-аналарға арналған жылдам жауаптар.",
    searchPlaceholder: "Сұрақ енгізіңіз...",
    categories: ["Барлығы", "Қабылдау", "Гранттар", "Құжаттар", "Жатақхана", "ҰБТ", "Мамандықтар"],
    popular: "Танымал сұрақтар",
    help: "Көмек керек пе?",
    call: "Қоңырау шалу",
    write: "Жазу",
    openSite: "Сайтты ашу",
  },
  en: {
    aboutTitle: "About EKTU",
    aboutHero: "D. Serikbayev East Kazakhstan Technical University",
    aboutLead:
      "A technical university with strong engineering education, modern laboratories and practical training for Kazakhstan's industry, IT and infrastructure.",
    official: "Open official website",
    history: "University history",
    stats: "Key indicators",
    why: "Why students choose EKTU",
    gallery: "Photo gallery",
    life: "Student life",
    ready: "Ready to apply?",
    readyText: "Choose a direction and start preparing documents today.",
    chooseSpecialty: "Choose specialty",
    submitDocs: "Submit documents",
    dormTitle: "Dormitory",
    dormLead:
      "EKTU dormitories help students live close to campus, manage expenses and adapt faster to university life.",
    aboutDorm: "About the dormitory",
    roomTypes: "Room types",
    available: "Available to students",
    howGetPlace: "How to get a place",
    dormMap: "Dormitory map",
    dormFaq: "Common questions",
    dormCta: "Apply for dormitory",
    faqTitle: "FAQ",
    faqLead: "Fast answers for applicants and parents.",
    searchPlaceholder: "Enter your question...",
    categories: ["All", "Admission", "Grants", "Documents", "Dormitory", "UNT", "Specialties"],
    popular: "Popular questions",
    help: "Still need help?",
    call: "Call",
    write: "Write",
    openSite: "Open site",
  },
} as const;

const history = [
  ["1958", "Основание университета", "University foundation"],
  ["1980", "Развитие инженерных направлений", "Engineering programs growth"],
  ["2000", "Международное сотрудничество", "International cooperation"],
  ["2020+", "Цифровая трансформация и современные лаборатории", "Digital transformation and modern labs"],
] as const;

const stats = [
  { icon: "people", value: "9 000+", ru: "Студенты", en: "Students" },
  { icon: "person", value: "600+", ru: "Преподаватели", en: "Teachers" },
  { icon: "business", value: "6", ru: "Факультеты", en: "Faculties" },
  { icon: "library", value: "30+", ru: "Кафедры", en: "Departments" },
  { icon: "globe", value: "40+", ru: "Международные программы", en: "International programs" },
  { icon: "trophy", value: "100+", ru: "Достижения", en: "Achievements" },
] as const;

const aboutReasons = [
  "Инженерное образование",
  "IT направления",
  "Международные программы",
  "Бесплатное обучение при гранте",
  "Бесплатное общежитие",
  "Современные лаборатории",
];

const studentLife = [
  { icon: "calendar", title: "Мероприятия", text: "Форумы, конференции, конкурсы и карьерные встречи." },
  { icon: "people", title: "Клубы", text: "Студенческие объединения по интересам и проектам." },
  { icon: "fitness", title: "Спорт", text: "Секции, турниры и активная кампусная жизнь." },
  { icon: "heart", title: "Волонтерство", text: "Социальные проекты и помощь городскому сообществу." },
] as const;

const roomTypes = [
  { title: "2-местная", image: dorm, capacity: "2", text: "Комфортный вариант для спокойной учебы и личного пространства." },
  { title: "3-местная", image: campus, capacity: "3", text: "Практичный формат с балансом цены, общения и удобства." },
  { title: "4-местная", image: architecture, capacity: "4", text: "Доступный вариант для грантников и активной студенческой жизни." },
] as const;

const amenities = ["Wi-Fi", "Прачечная", "Кухня", "Учебные комнаты", "Комнаты отдыха", "Охрана", "Видеонаблюдение"];
const dormSteps = ["Подать документы", "Получить грант", "Подать заявку", "Получить место", "Заселиться"];
const dorms = ["Общежитие №1", "Общежитие №2", "Общежитие №3"];

const faqData = [
  ["Поступление", "Сколько грантов выделяется?", "ВКТУ ежегодно получает большое количество государственных грантов. Точное число зависит от года и образовательной программы."],
  ["ЕНТ", "Какой минимальный балл ЕНТ?", "Минимальный порог для поступления в технические направления обычно начинается от 50 баллов, но требования могут отличаться."],
  ["Поступление", "Можно ли поступить после колледжа?", "Да, выпускники колледжей могут поступать по профильным направлениям и уточнять условия в приёмной комиссии."],
  ["Поступление", "Можно ли перевестись?", "Да, перевод возможен при наличии академической разницы и свободных мест на выбранной программе."],
  ["Общежитие", "Как получить общежитие?", "Нужно подать документы, подтвердить статус грантника или льготную категорию и оформить заявку на место."],
  ["Документы", "Какие документы нужны?", "Обычно нужны удостоверение личности, аттестат, фото 3x4, медицинская справка и сертификат ЕНТ."],
  ["Поступление", "Когда начинается прием документов?", "Приёмная кампания обычно стартует летом. Актуальные даты лучше проверять на официальном сайте ВКТУ."],
  ["Документы", "Можно ли подать онлайн?", "Да, часть действий можно выполнить онлайн, а оригиналы документов предоставить по регламенту приёмной комиссии."],
  ["Специальности", "Есть ли международные программы?", "Да, университет развивает академическую мобильность, стажировки и международное сотрудничество."],
  ["Поступление", "Есть ли военная кафедра?", "Информацию о военной подготовке нужно уточнять в университете, так как условия могут меняться."],
] as const;

type InfoContent = (typeof content)[Language];

export function InfoScreen() {
  const { t, language } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Info">>();
  const kind = route.params.kind;
  const c = content[language];

  if (kind === "about") return <AboutScreen c={c} language={language} navigation={navigation} />;
  if (kind === "dorm") return <DormScreen c={c} navigation={navigation} />;
  if (kind === "faq") return <FaqScreen c={c} />;

  const fallbackTitle: Record<Exclude<InfoKind, "about" | "dorm" | "faq">, TranslationKey> = {
    labs: "labs",
    parents: "parentsTitle",
    city: "city",
  };

  return (
    <Screen>
      <Stack>
        <HeaderBack title={t(fallbackTitle[kind])} onBack={() => navigation.goBack()} />
        <View style={styles.simpleCard}>
          <Image source={kind === "labs" ? labs : campus} style={styles.simpleImage} />
          <Text style={styles.simpleTitle}>{t(fallbackTitle[kind])}</Text>
          <Text style={styles.simpleText}>{t(kind === "labs" ? "advantageLabs" : "aboutLead")}</Text>
        </View>
      </Stack>
    </Screen>
  );
}

function AboutScreen({
  c,
  language,
  navigation,
}: {
  c: InfoContent;
  language: Language;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  return (
    <Screen>
      <Stack>
        <HeaderBack title={c.aboutTitle} onBack={() => navigation.goBack()} />
        <Hero image={campus} title={c.aboutHero} text={c.aboutLead} button={c.official} />

        <Section title={c.history}>
          <View style={styles.timeline}>
            {history.map((item) => (
              <View key={item[0]} style={styles.timelineCard}>
                <Text style={styles.timelineYear}>{item[0]}</Text>
                <Text style={styles.timelineText}>{language === "en" ? item[2] : item[1]}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={c.stats}>
          <View style={styles.statsGrid}>
            {stats.map((item) => (
              <View key={item.ru} style={styles.statCard}>
                <Ionicons name={item.icon as never} size={22} color={colors.primary} />
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{language === "en" ? item.en : item.ru}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={c.why}>
          <View style={styles.reasonGrid}>
            {aboutReasons.map((item, index) => (
              <TouchableOpacity key={item} style={styles.reasonCard} activeOpacity={0.84}>
                <View style={styles.reasonIcon}>
                  <Ionicons name={["construct", "code-slash", "globe", "trophy", "bed", "flask"][index] as never} size={19} color={colors.primary} />
                </View>
                <Text style={styles.reasonText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Gallery title={c.gallery} images={galleryImages} />

        <Section title={c.life}>
          <View style={styles.lifeGrid}>
            {studentLife.map((item) => (
              <View key={item.title} style={styles.lifeCard}>
                <Ionicons name={item.icon as never} size={21} color={colors.primary} />
                <Text style={styles.lifeTitle}>{item.title}</Text>
                <Text style={styles.lifeText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Cta
          title={c.ready}
          text={c.readyText}
          primary={c.chooseSpecialty}
          secondary={c.submitDocs}
          onPrimary={() => navigation.navigate("Tabs", { screen: "Specialties" })}
          onSecondary={() => navigation.navigate("Tabs", { screen: "Documents" })}
        />
      </Stack>
    </Screen>
  );
}

function DormScreen({
  c,
  navigation,
}: {
  c: InfoContent;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  return (
    <Screen>
      <Stack>
        <HeaderBack title={c.dormTitle} onBack={() => navigation.goBack()} />
        <Hero image={dorm} title={c.dormTitle} text={c.dormLead} />

        <Section title={c.aboutDorm}>
          <View style={styles.textCard}>
            <Text style={styles.bodyText}>{c.dormLead}</Text>
            <Text style={styles.bodyText}>Приоритет получают грантники, иногородние студенты и обучающиеся с подтверждёнными социальными основаниями.</Text>
          </View>
        </Section>

        <Section title={c.roomTypes}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
            {roomTypes.map((room) => (
              <View key={room.title} style={styles.roomCard}>
                <Image source={room.image} style={styles.roomImage} />
                <Text style={styles.roomTitle}>{room.title}</Text>
                <Text style={styles.roomMeta}>{room.capacity} студента</Text>
                <Text style={styles.roomText}>{room.text}</Text>
              </View>
            ))}
          </ScrollView>
        </Section>

        <Section title={c.available}>
          <View style={styles.amenityGrid}>
            {amenities.map((item, index) => (
              <View key={item} style={styles.amenityCard}>
                <Ionicons name={["wifi", "shirt", "restaurant", "book", "cafe", "shield-checkmark", "videocam"][index] as never} size={20} color={colors.primary} />
                <Text style={styles.amenityText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={c.howGetPlace}>
          <View style={styles.stepsCard}>
            {dormSteps.map((item, index) => (
              <View key={item} style={styles.stepRow}>
                <View style={styles.stepCircle}><Text style={styles.stepNumber}>{index + 1}</Text></View>
                <Text style={styles.stepText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Gallery title={c.gallery} images={dormGallery} />

        <Section title={c.dormMap}>
          <View style={styles.dormMap}>
            {dorms.map((item, index) => (
              <View key={item} style={styles.dormMapCard}>
                <Ionicons name="location" size={19} color={colors.primary} />
                <View style={styles.flex}>
                  <Text style={styles.dormName}>{item}</Text>
                  <Text style={styles.dormAddress}>Кампус ВКТУ · корпус {index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title={c.dormFaq}>
          <View style={styles.faqMiniCard}>
            {["Кому дают место в первую очередь?", "Можно ли жить весь учебный год?", "Есть ли Wi-Fi и кухня?"].map((q) => (
              <View key={q} style={styles.miniQuestion}>
                <Ionicons name="help-circle" size={18} color={colors.primary} />
                <Text style={styles.miniQuestionText}>{q}</Text>
              </View>
            ))}
          </View>
        </Section>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.84}>
          <Text style={styles.primaryButtonText}>{c.dormCta}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </Stack>
    </Screen>
  );
}

function FaqScreen({ c }: { c: InfoContent }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const selected = c.categories[category];
    const normalized = query.trim().toLowerCase();
    return faqData.filter((item) => {
      const categoryMatch = category === 0 || item[0] === selected;
      const textMatch = !normalized || `${item[1]} ${item[2]}`.toLowerCase().includes(normalized);
      return categoryMatch && textMatch;
    });
  }, [c.categories, category, query]);

  return (
    <Screen>
      <Stack>
        <HeaderBack title={c.faqTitle} />
        <Text style={styles.faqLead}>{c.faqLead}</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder={c.searchPlaceholder} placeholderTextColor={colors.muted} style={styles.searchInput} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {c.categories.map((item, index) => (
            <TouchableOpacity key={item} onPress={() => setCategory(index)} style={[styles.tab, category === index && styles.tabActive]} activeOpacity={0.82}>
              <Text style={[styles.tabText, category === index && styles.tabTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Section title={c.faqTitle}>
          <View style={styles.accordion}>
            {filtered.map((item, index) => {
              const opened = open === index;
              return (
                <View key={item[1]} style={styles.accordionItem}>
                  <TouchableOpacity onPress={() => setOpen(opened ? null : index)} style={styles.accordionHead} activeOpacity={0.82}>
                    <Text style={styles.accordionQuestion}>{item[1]}</Text>
                    <Ionicons name={opened ? "chevron-up" : "chevron-down"} size={18} color={colors.primary} />
                  </TouchableOpacity>
                  {opened ? <Text style={styles.accordionAnswer}>{item[2]}</Text> : null}
                </View>
              );
            })}
          </View>
        </Section>

        <Section title={c.popular}>
          <View style={styles.popularGrid}>
            {faqData.slice(0, 4).map((item) => (
              <TouchableOpacity key={item[1]} style={styles.popularCard} activeOpacity={0.84}>
                <Ionicons name="flame" size={18} color={colors.primary} />
                <Text style={styles.popularText}>{item[1]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>{c.help}</Text>
          <ContactLine icon="call" label="Приемная комиссия" value="+7 (7232) 26-74-09" />
          <ContactLine icon="mail" label="Email" value="admission@ektu.kz" />
          <ContactLine icon="globe" label="Официальный сайт" value="ektu.kz" />
          <View style={styles.helpButtons}>
            <SmallButton label={c.call} icon="call" onPress={() => Linking.openURL("tel:+77232267409")} />
            <SmallButton label={c.write} icon="mail" onPress={() => Linking.openURL("mailto:admission@ektu.kz")} />
            <SmallButton label={c.openSite} icon="open" onPress={() => Linking.openURL(siteUrl)} />
          </View>
        </View>
      </Stack>
    </Screen>
  );
}

function HeaderBack({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigation = useNavigation();
  return (
    <View style={styles.backHeader}>
      <TouchableOpacity style={styles.backButton} onPress={() => (onBack ? onBack() : navigation.goBack())} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={20} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.backTitle}>{title}</Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

function Hero({ image, title, text, button }: { image: number; title: string; text: string; button?: string }) {
  return (
    <View style={styles.heroWrap}>
      <ImageBackground source={image} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroText}>{text}</Text>
          {button ? (
            <TouchableOpacity style={styles.heroButton} onPress={() => Linking.openURL(siteUrl)} activeOpacity={0.84}>
              <Text style={styles.heroButtonText}>{button}</Text>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
}

function Gallery({ title, images }: { title: string; images: number[] }) {
  return (
    <Section title={title}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.galleryImage} />
        ))}
      </ScrollView>
    </Section>
  );
}

function Cta({
  title,
  text,
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  title: string;
  text: string;
  primary: string;
  secondary: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <View style={styles.ctaCard}>
      <Text style={styles.ctaTitle}>{title}</Text>
      <Text style={styles.ctaText}>{text}</Text>
      <View style={styles.ctaButtons}>
        <TouchableOpacity style={styles.ctaPrimary} onPress={onPrimary} activeOpacity={0.84}>
          <Text style={styles.ctaPrimaryText}>{primary}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaSecondary} onPress={onSecondary} activeOpacity={0.84}>
          <Text style={styles.ctaSecondaryText}>{secondary}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ContactLine({ icon, label, value }: { icon: "call" | "mail" | "globe"; label: string; value: string }) {
  return (
    <View style={styles.contactLine}>
      <Ionicons name={icon} size={17} color={colors.primary} />
      <View style={styles.flex}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </View>
  );
}

function SmallButton({ label, icon, onPress }: { label: string; icon: "call" | "mail" | "open"; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.smallButton} onPress={onPress} activeOpacity={0.84}>
      <Ionicons name={icon} size={15} color={colors.primary} />
      <Text style={styles.smallButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backHeader: {
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
  backTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 16,
  },
  backSpacer: { width: 38 },
  flex: { flex: 1 },
  heroWrap: { paddingHorizontal: 20 },
  hero: {
    borderRadius: 24,
    height: 250,
    justifyContent: "flex-end",
    overflow: "hidden",
    ...shadows.card,
  },
  heroImage: { borderRadius: 24 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,43,137,0.55)",
  },
  heroContent: { padding: 18 },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 24,
    lineHeight: 29,
  },
  heroText: {
    color: "rgba(255,255,255,0.88)",
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  heroButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 17,
    flexDirection: "row",
    gap: 7,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  heroButtonText: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  timeline: { gap: 10 },
  timelineCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 13,
    padding: 14,
    ...shadows.soft,
  },
  timelineYear: {
    color: colors.primary,
    fontFamily: typography.family.bold,
    fontSize: 18,
    width: 58,
  },
  timelineText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    width: "48%",
    ...shadows.soft,
  },
  statValue: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 21,
    marginTop: 9,
  },
  statLabel: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 11,
    marginTop: 2,
  },
  reasonGrid: { gap: 9 },
  reasonCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
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
  reasonText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 14,
  },
  gallery: { gap: 10, paddingRight: 20 },
  galleryImage: {
    borderRadius: 18,
    height: 132,
    width: 210,
  },
  lifeGrid: { gap: 10 },
  lifeCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    ...shadows.soft,
  },
  lifeTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
    marginTop: 8,
  },
  lifeText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 18,
    ...shadows.card,
  },
  ctaTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 22,
  },
  ctaText: {
    color: "rgba(255,255,255,0.78)",
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  ctaButtons: {
    flexDirection: "row",
    gap: 9,
    marginTop: 14,
  },
  ctaPrimary: {
    backgroundColor: colors.white,
    borderRadius: 15,
    flex: 1,
    paddingVertical: 11,
  },
  ctaPrimaryText: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 12,
    textAlign: "center",
  },
  ctaSecondary: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 15,
    flex: 1,
    paddingVertical: 11,
  },
  ctaSecondaryText: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 12,
    textAlign: "center",
  },
  textCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 9,
    padding: 15,
    ...shadows.soft,
  },
  bodyText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  horizontal: { gap: 10, paddingRight: 20 },
  roomCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    width: 210,
    ...shadows.soft,
  },
  roomImage: { height: 105, width: "100%" },
  roomTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  roomMeta: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingTop: 2,
  },
  roomText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    padding: 12,
  },
  amenityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  amenityCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    gap: 7,
    minHeight: 78,
    justifyContent: "center",
    width: "31.5%",
    ...shadows.soft,
  },
  amenityText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 11,
    textAlign: "center",
  },
  stepsCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 14,
    ...shadows.soft,
  },
  stepRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  stepCircle: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 13,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  stepNumber: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 12,
  },
  stepText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  dormMap: { gap: 10 },
  dormMapCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    padding: 14,
    ...shadows.soft,
  },
  dormName: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  dormAddress: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    marginTop: 2,
  },
  faqMiniCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 14,
    ...shadows.soft,
  },
  miniQuestion: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  miniQuestionText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
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
  faqLead: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    ...shadows.soft,
  },
  searchInput: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 14,
    paddingVertical: 13,
  },
  tabs: {
    gap: 8,
    paddingHorizontal: 20,
  },
  tab: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  tabTextActive: { color: colors.white },
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
    lineHeight: 19,
  },
  accordionAnswer: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    lineHeight: 19,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  popularGrid: { gap: 9 },
  popularCard: {
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
  popularText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  helpCard: {
    backgroundColor: colors.primaryDeep,
    borderRadius: 24,
    gap: 12,
    marginHorizontal: 20,
    padding: 17,
    ...shadows.card,
  },
  helpTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 20,
  },
  contactLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  contactLabel: {
    color: "rgba(255,255,255,0.64)",
    fontFamily: typography.family.regular,
    fontSize: 11,
  },
  contactValue: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 13,
    marginTop: 1,
  },
  helpButtons: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    flex: 1,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    paddingVertical: 10,
  },
  smallButtonText: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 11,
  },
  simpleCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 20,
    overflow: "hidden",
    ...shadows.card,
  },
  simpleImage: { height: 180, width: "100%" },
  simpleTitle: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 22,
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  simpleText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 21,
    padding: 16,
  },
});
