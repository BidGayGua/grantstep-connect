import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n, type Language } from "../i18n";
import type { RootStackParamList } from "../navigation/types";
import { colors, shadows, typography } from "../theme";

const { width } = Dimensions.get("window");
const SECTION_PADDING = 20;
const GRID_GAP = 12;
const COLUMN_WIDTH = (width - SECTION_PADDING * 2 - GRID_GAP) / 2;

// --- Data ---
const fastFacts = [
  { id: "1", ru: { label: "Обучение", value: "от 350к ₸/год" }, kk: { label: "Оқу", value: "350к ₸/жыл бастап" }, en: { label: "Education", value: "from 350k ₸/year" }, icon: "school-outline", color: "#C7D2FE" },
  { id: "2", ru: { label: "Общежитие", value: "10 000 ₸/мес" }, kk: { label: "Жатақхана", value: "10 000 ₸/ай" }, en: { label: "Dormitory", value: "10 000 ₸/month" }, icon: "bed-outline", color: "#A7F3D0" },
  { id: "3", ru: { label: "Работа", value: "96% успех" }, kk: { label: "Жұмыс", value: "96% сәттілік" }, en: { label: "Employment", value: "96% success" }, icon: "briefcase-outline", color: "#FDE68A" },
  { id: "4", ru: { label: "Военная каф.", value: "Есть" }, kk: { label: "Әскери каф.", value: "Бар" }, en: { label: "Military", value: "Available" }, icon: "shield-outline", color: "#FBCFE8" },
];

const dormFeatures = [
  { icon: "people-outline", ru: { title: "Размещение", desc: "Комнаты на 2-4 человека с современным ремонтом." }, kk: { title: "Орналастыру", desc: "Заманауи жөндеуден өткен 2-4 адамдық бөлмелер." }, en: { title: "Accommodation", desc: "Rooms for 2-4 people with modern renovation." } },
  { icon: "bed-outline", ru: { title: "Мебель", desc: "Кровать, шкаф, рабочий стол и полки уже в комнате." }, kk: { title: "Жиһаз", desc: "Кереует, шкаф, жұмыс үстелі және сөрелер бөлмеде бар." }, en: { title: "Furniture", desc: "Bed, wardrobe, desk and shelves are already in the room." } },
  { icon: "wifi-outline", ru: { title: "Интернет", desc: "Бесплатный высокоскоростной Wi-Fi на всей территории." }, kk: { title: "Интернет", desc: "Барлық аумақта тегін жоғары жылдамдықты Wi-Fi." }, en: { title: "Internet", desc: "Free high-speed Wi-Fi throughout the territory." } },
  { icon: "shield-checkmark-outline", ru: { title: "Безопасность", desc: "Охрана 24/7, видеонаблюдение и вход по картам." }, kk: { title: "Қауіпсіздік", desc: "24/7 күзет, бейнебақылау және картамен кіру." }, en: { title: "Security", desc: "24/7 security, video surveillance and card entry." } },
  { icon: "cafe-outline", ru: { title: "Быт", desc: "Кухни, прачечные и душевые на каждом этаже." }, kk: { title: "Тұрмыс", desc: "Әр қабатта ас үйлер, кір жуатын орындар және душ бөлмелері." }, en: { title: "Facilities", desc: "Kitchens, laundries and showers on each floor." } },
  { icon: "walk-outline", ru: { title: "Локация", desc: "Всего 5-10 минут пешком до учебных корпусов." }, kk: { title: "Орналасуы", desc: "Оқу корпустарына дейін небәрі 5-10 минуттық жаяу жол." }, en: { title: "Location", desc: "Only 5-10 minutes walk to the academic buildings." } },
];

const whyEktu = [
  { icon: "ribbon-outline", ru: { title: "Гос. статус", desc: "Ведущий технический вуз с 65-летней историей." }, kk: { title: "Мемлекеттік мәртебе", desc: "65 жылдық тарихы бар жетекші техникалық жоғары оқу орны." }, en: { title: "State Status", desc: "Leading technical university with 65 years of history." } },
  { icon: "flask-outline", ru: { title: "Лаборатории", desc: "60+ лабораторий мирового уровня для практики." }, kk: { title: "Зертханалар", desc: "Тәжірибе үшін 60+ әлемдік деңгейдегі зертханалар." }, en: { title: "Laboratories", desc: "60+ world-class laboratories for practice." } },
  { icon: "trending-up-outline", ru: { title: "Карьера", desc: "Партнерство с гигантами: Kazzinc, Kazatomprom." }, kk: { title: "Мансап", desc: "Kazzinc, Kazatomprom сияқты алпауыттармен серіктестік." }, en: { title: "Career", desc: "Partnership with giants: Kazzinc, Kazatomprom." } },
  { icon: "medal-outline", ru: { title: "Рейтинг", desc: "Входит в ТОП-10 лучших вузов Казахстана." }, kk: { title: "Рейтинг", desc: "Қазақстанның үздік 10 жоғары оқу орнының қатарына кіреді." }, en: { title: "Ranking", desc: "Included in the TOP 10 best universities in Kazakhstan." } },
];

const internationalData = [
  { ru: { title: "Erasmus+", desc: "Гранты на обучение в Европе (Германия, Польша, Литва)." }, kk: { title: "Erasmus+", desc: "Еуропада (Германия, Польша, Литва) оқуға арналған гранттар." }, en: { title: "Erasmus+", desc: "Grants for studying in Europe (Germany, Poland, Lithuania)." } },
  { ru: { title: "Двойной диплом", desc: "Диплом ВКТУ + диплом зарубежного вуза-партнера." }, kk: { title: "Қос диплом", desc: "ВКТУ дипломы + шетелдік серіктес жоғары оқу орнының дипломы." }, en: { title: "Double Degree", desc: "EKTU diploma + diploma from a foreign partner university." } },
  { ru: { title: "Летние школы", desc: "Краткосрочные стажировки в США, Китае и Корее." }, kk: { title: "Жазғы мектептер", desc: "АҚШ, Қытай және Кореядағы қысқа мерзімді тағылымдамалар." }, en: { title: "Summer Schools", desc: "Short-term internships in the USA, China and Korea." } },
];

const militaryInfo = [
  { ru: { title: "Звание", desc: "Присваивается звание лейтенанта или сержанта запаса." }, kk: { title: "Шен", desc: "Запастағы лейтенант немесе сержант шені беріледі." }, en: { title: "Rank", desc: "The rank of lieutenant or reserve sergeant is awarded." } },
  { ru: { title: "Отсрочка", desc: "Студенты получают освобождение от призыва в армию." }, kk: { title: "Кейінге қалдыру", desc: "Студенттер әскерге шақырудан босатылады." }, en: { title: "Deferment", desc: "Students receive an exemption from military conscription." } },
  { ru: { title: "Условия", desc: "Прием на 1 или 2 курсе на основе конкурса." }, kk: { title: "Шарттары", desc: "Конкурс негізінде 1 немесе 2 курста қабылдау." }, en: { title: "Conditions", desc: "Admission in the 1st or 2nd year based on a competition." } },
];

const timeline = [
  { step: "1", ru: { title: "Подать заявку", desc: "Зарегистрироваться в базе абитуриентов." }, kk: { title: "Өтініш беру", desc: "Талапкерлер базасына тіркелу." }, en: { title: "Apply", desc: "Register in the applicant database." } },
  { step: "2", ru: { title: "Сдать ЕНТ", desc: "Набрать проходной балл (от 50 баллов)." }, kk: { title: "ҰБТ тапсыру", desc: "Өту балын жинау (50 балдан бастап)." }, en: { title: "Pass UNT", desc: "Score the passing mark (from 50 points)." } },
  { step: "3", ru: { title: "Конкурс грантов", desc: "Подать документы на грант в середине июля." }, kk: { title: "Гранттар конкурсы", desc: "Шілде айының ортасында грантқа құжат тапсыру." }, en: { title: "Grant Competition", desc: "Submit documents for a grant in mid-July." } },
  { step: "4", ru: { title: "Зачисление", desc: "Увидеть фамилию в списке в начале августа." }, kk: { title: "Оқуға қабылдау", desc: "Тамыз айының басында тізімнен фамилияңызды көру." }, en: { title: "Enrollment", desc: "See your name on the list in early August." } },
  { step: "5", ru: { title: "Заселение", desc: "Получить место в общежитии до 1 сентября." }, kk: { title: "Қоныстану", desc: "1 қыркүйекке дейін жатақханадан орын алу." }, en: { title: "Move-in", desc: "Get a place in the dormitory by September 1." } },
];

const jobPartners = ["Kazzinc", "Kazatomprom", "BI Group", "Serebro", "Ульбинский МЗ", "ERG", "ТМК", "Казцинк-Шахтострой"];

const expenses = [
  { id: "food", ru: { label: "Питание" }, kk: { label: "Тамақтану" }, en: { label: "Food" }, price: 60000, icon: "restaurant-outline" },
  { id: "transport", ru: { label: "Проезд" }, kk: { label: "Жол ақысы" }, en: { label: "Transport" }, price: 5000, icon: "bus-outline" },
  { id: "leisure", ru: { label: "Досуг" }, kk: { label: "Бос уақыт" }, en: { label: "Leisure" }, price: 20000, icon: "ticket-outline" },
];

const specialties = [
  { ru: { title: "IT и Программирование", desc: "Разработка ПО, ИИ, Big Data и CyberSec." }, kk: { title: "IT және бағдарламалау", desc: "БҚ әзірлеу, ЖИ, Big Data және CyberSec." }, en: { title: "IT and Programming", desc: "SW Development, AI, Big Data and CyberSec." } },
  { ru: { title: "Робототехника", desc: "Автоматизация и управление сложными системами." }, kk: { title: "Робототехника", desc: "Күрделі жүйелерді автоматтандыру және басқару." }, en: { title: "Robotics", desc: "Automation and control of complex systems." } },
  { ru: { title: "Архитектура и Строительство", desc: "Современное проектирование и BIM." }, kk: { title: "Сәулет және құрылыс", desc: "Заманауи жобалау және BIM." }, en: { title: "Architecture & Construction", desc: "Modern design and BIM." } },
  { ru: { title: "Зеленая Энергетика", desc: "ВИЭ и экологически чистые технологии." }, kk: { title: "Жасыл энергетика", desc: "ЖЭК және экологиялық таза технологиялар." }, en: { title: "Green Energy", desc: "RES and eco-friendly technologies." } },
];

const faq = [
  { ru: { q: "Сколько стоит обучение?", a: "Стоимость варьируется от 350 000 до 600 000 ₸ в год в зависимости от специальности." }, kk: { q: "Оқу құны қанша?", a: "Құны мамандыққа байланысты жылына 350 000-нан 600 000 ₸-ге дейін өзгереді." }, en: { q: "How much is tuition?", a: "The cost varies from 350,000 to 600,000 ₸ per year depending on the major." } },
  { ru: { q: "Гарантируете ли вы работу?", a: "Мы предоставляем базу практик и проводим ярмарки вакансий. 96% выпускников трудоустроены." }, kk: { q: "Жұмысқа орналасуға кепілдік бересіз бе?", a: "Біз тәжірибе базасын ұсынамыз және бос жұмыс орындары жәрмеңкелерін өткіземіз. Түлектердің 96% жұмысқа орналасқан." }, en: { q: "Do you guarantee a job?", a: "We provide an internship base and hold job fairs. 96% of graduates are employed." } },
  { ru: { q: "Безопасно ли в общежитии?", a: "Да, действует строгий пропускной режим, 24/7 дежурит охрана и воспитатели." }, kk: { q: "Жатақханада қауіпсіз бе?", a: "Иә, қатаң өткізу режимі жұмыс істейді, 24/7 күзет пен тәрбиешілер кезекшілік етеді." }, en: { q: "Is it safe in the dormitory?", a: "Yes, there is a strict access regime, 24/7 security and educators are on duty." } },
];

const contactsData = [
  { icon: "call-outline", ru: { label: "Приемная комиссия" }, kk: { label: "Қабылдау комиссиясы" }, en: { label: "Admissions Office" }, value: "+7 (707) 285-50-12", type: "tel" },
  { icon: "logo-whatsapp", ru: { label: "WhatsApp" }, kk: { label: "WhatsApp" }, en: { label: "WhatsApp" }, value: "+7 (707) 640-00-54", type: "wa" },
  { icon: "location-outline", ru: { label: "Приемная комиссия" }, kk: { label: "Қабылдау комиссиясы" }, en: { label: "Admissions" }, value: "ул. Серикбаева, 19", type: "map" },
];

const admissionDocs = [
  { id: "1", ru: "Аттестат или диплом (оригинал)", kk: "Аттестат немесе диплом (түпнұсқа)", en: "Certificate or diploma (original)" },
  { id: "2", ru: "Удостоверение личности (копия)", kk: "Жеке куәлік (көшірме)", en: "ID card (copy)" },
  { id: "3", ru: "Мед. справка формы 075/у", kk: "075/у нысанындағы мед. анықтама", en: "Medical certificate 075/u" },
  { id: "4", ru: "6 фотографий размером 3х4", kk: "3х4 өлшемді 6 фотосурет", en: "6 photos (3x4 size)" },
  { id: "5", ru: "Сертификат ЕНТ", kk: "ҰБТ сертификаты", en: "UNT certificate" },
  { id: "6", ru: "Приписное свидетельство (для юношей)", kk: "Тіркеу куәлігі (жігіттер үшін)", en: "Registration certificate (for boys)" },
];

export function ParentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language, t } = useI18n();
  const lang = language as Language;

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [includeDorm, setIncludeDorm] = useState(true);

  const totalMonthly = expenses.reduce((sum, item) => sum + item.price, 0) + (includeDorm ? 10000 : 0);

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleContact = (type: string, value: string) => {
    let url = "";
    if (type === "tel") url = `tel:${value.replace(/[^\d+]/g, "")}`;
    if (type === "wa") url = `https://wa.me/${value.replace(/[^\d+]/g, "")}`;
    if (type === "map") {
      const encodedAddr = encodeURIComponent(value);
      url = Platform.select({
        ios: `maps:0,0?q=${encodedAddr}`,
        android: `geo:0,0?q=${encodedAddr}`,
        default: `https://www.google.com/maps/search/?api=1&query=${encodedAddr}`,
      });
    }
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <Screen>
      <Stack>
        {/* 1. HERO */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <LinearGradient
            colors={["#1E4FC7", "#102C6A"]}
            style={styles.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHero}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>{t("parentsHeroTitle")}</Text>
            <Text style={styles.heroSub}>{t("parentsHeroSub")}</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.heroButton} onPress={() => handleContact("wa", "+77076400054")}>
                <Text style={styles.heroButtonText}>{t("parentsConsultation")}</Text>
                <Ionicons name="logo-whatsapp" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 2. QUICK STATS - GRID LAYOUT */}
        <Section>
          <View style={styles.fastFactsGrid}>
            {fastFacts.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(200 + index * 100).duration(500)}
                style={[styles.factCard, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon as any} size={22} color={colors.primaryDeep} />
                <Text style={styles.factValue}>{item[lang]?.value || item.ru.value}</Text>
                <Text style={styles.factLabel}>{item[lang]?.label || item.ru.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Section>

        {/* 3. DORMITORY - THE MAIN FOCUS */}
        <Section title={t("parentsDormTitle")}>
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
            <View style={styles.dormHeader}>
              <Ionicons name="home" size={24} color={colors.primary} />
              <Text style={styles.dormHeaderText}>{t("parentsDormHeader")}</Text>
            </View>
            <Text style={styles.cardDesc}>{t("parentsDormDesc")}</Text>

            <View style={styles.featuresGrid}>
              {dormFeatures.map((f, idx) => (
                <Animated.View
                  key={idx}
                  entering={FadeInDown.delay(400 + idx * 100).duration(500)}
                  style={styles.featureItem}
                >
                  <View style={styles.featureIconBox}>
                    <Ionicons name={f.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{f[lang]?.title || f.ru.title}</Text>
                    <Text style={styles.featureDesc}>{f[lang]?.desc || f.ru.desc}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate("Info", { kind: "dorm" })}
            >
              <Text style={styles.detailButtonText}>{t("parentsDormMore")}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </Section>

        {/* 4. WHY CHOOSE US */}
        <Section title={t("parentsWhyChooseTitle")}>
          <View style={styles.grid}>
            {whyEktu.map((item, idx) => (
              <Animated.View key={idx} entering={FadeInDown.delay(400 + idx * 100).duration(600)} style={styles.whyCard}>
                <View style={styles.whyIconBox}>
                  <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={styles.whyTitle}>{item[lang]?.title || item.ru.title}</Text>
                <Text style={styles.whyDesc}>{item[lang]?.desc || item.ru.desc}</Text>
              </Animated.View>
            ))}
          </View>
        </Section>

        {/* 5. EMPLOYMENT & PARTNERS */}
        <Section title={t("parentsJobTitle")}>
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.card}>
            <View style={styles.statsRow}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.statsValue}>96%</Text>
                <Text style={styles.statsLabel}>{t("parentsSuccessStart")}</Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={{ alignItems: "center" }}>
                <Text style={styles.statsValue}>250+</Text>
                <Text style={styles.statsLabel}>{t("parentsPartners")}</Text>
              </View>
              <View style={{ alignItems: "center", marginLeft: 15 }}>
                <Text style={styles.statsValue}>140к+</Text>
                <Text style={styles.statsLabel}>{t("parentsAvgSalary")}</Text>
              </View>
            </View>
            <Text style={[styles.cardTitleInside, { marginTop: 20 }]}>{t("parentsKeyEmployers")}</Text>
            <View style={styles.partnersFlow}>
              {jobPartners.map((p) => (
                <View key={p} style={styles.partnerTag}>
                  <Text style={styles.partnerTagText}>{p}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </Section>

        {/* 5.1 FINANCIAL CALCULATOR */}
        <Section title={t("parentsBudgetTitle")}>
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.card}>
            <Text style={styles.cardDesc}>{t("parentsBudgetDesc")}</Text>

            {expenses.map((item) => (
              <View key={item.id} style={styles.expenseItem}>
                <View style={styles.expenseIcon}>
                  <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                </View>
                <Text style={styles.expenseLabel}>{item[lang]?.label || item.ru.label}</Text>
                <Text style={styles.expensePrice}>~{item.price.toLocaleString()} ₸</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.dormToggle}
              onPress={() => setIncludeDorm(!includeDorm)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={includeDorm ? "checkbox" : "square-outline"}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.dormToggleText}>{t("parentsDormInc")}</Text>
            </TouchableOpacity>

            <LinearGradient colors={["#F8FAFC", "#F1F5F9"]} style={styles.totalBox}>
              <Text style={styles.totalBoxLabel}>{t("parentsTotalEst")}</Text>
              <Text style={styles.totalBoxValue}>
                {totalMonthly.toLocaleString()} ₸ / {t("parentsMonth")}
              </Text>
            </LinearGradient>
          </Animated.View>
        </Section>

        {/* 6. OPPORTUNITIES - VERTICAL STACK */}
        <Section title={t("parentsOppTitle")}>
          <View style={styles.verticalStack}>
            {/* International */}
            <Animated.View entering={FadeInDown.delay(700).duration(600)} style={[styles.premiumCard, { backgroundColor: "#F0F9FF" }]}>
              <View style={styles.wideCardHeader}>
                <Ionicons name="earth" size={24} color="#0369A1" />
                <Text style={[styles.wideCardTitle, { color: "#0369A1" }]}>{t("parentsIntlTitle")}</Text>
              </View>
              {internationalData.map((item, i) => (
                <View key={i} style={styles.wideCardItem}>
                  <Text style={styles.wideCardItemTitle}>{item[lang]?.title || item.ru.title}</Text>
                  <Text style={styles.wideCardItemDesc}>{item[lang]?.desc || item.ru.desc}</Text>
                </View>
              ))}
            </Animated.View>
            {/* Military */}
            <Animated.View entering={FadeInDown.delay(800).duration(600)} style={[styles.premiumCard, { backgroundColor: "#F0FDF4" }]}>
              <View style={styles.wideCardHeader}>
                <Ionicons name="shield-half" size={24} color="#15803D" />
                <Text style={[styles.wideCardTitle, { color: "#15803D" }]}>{t("parentsMilTitle")}</Text>
              </View>
              {militaryInfo.map((item, i) => (
                <View key={i} style={styles.wideCardItem}>
                  <Text style={styles.wideCardItemTitle}>{item[lang]?.title || item.ru.title}</Text>
                  <Text style={styles.wideCardItemDesc}>{item[lang]?.desc || item.ru.desc}</Text>
                </View>
              ))}
            </Animated.View>
          </View>
        </Section>

        {/* 7. ADMISSION PROCESS */}
        <Section title={t("parentsAdmTitle")}>
          <View style={styles.timelineContainer}>
            {timeline.map((item, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(800 + index * 100).duration(600)}
                style={styles.timelineItem}
              >
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot}>
                    <Text style={styles.timelineStepText}>{item.step}</Text>
                  </View>
                  {index !== timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={styles.timelineTitle}>{item[lang]?.title || item.ru.title}</Text>
                  <Text style={styles.timelineDesc}>{item[lang]?.desc || item.ru.desc}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Section>

        {/* 7.1 DOCUMENTS CHECKLIST */}
        <Section title={t("parentsDocsTitle")}>
          <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.card}>
            <Text style={styles.cardDesc}>{t("parentsDocsDesc")}</Text>
            {admissionDocs.map((doc, idx) => (
              <Animated.View
                key={doc.id}
                entering={FadeInDown.delay(1000 + idx * 50).duration(400)}
              >
                <TouchableOpacity
                  style={styles.checkItem}
                  onPress={() => toggleDoc(doc.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, checkedDocs.includes(doc.id) && styles.checkboxActive]}>
                    {checkedDocs.includes(doc.id) && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text style={[styles.checkText, checkedDocs.includes(doc.id) && styles.checkTextDone]}>
                    {doc[lang] || doc.ru}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(checkedDocs.length / admissionDocs.length) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {t("parentsReadiness")} {Math.round((checkedDocs.length / admissionDocs.length) * 100)}%
              </Text>
            </View>
          </Animated.View>
        </Section>

        {/* 8. SPECIALTIES */}
        <Section title={t("parentsSpecTitle")}>
          <View style={styles.grid}>
            {specialties.map((item, idx) => (
              <Animated.View
                key={idx}
                entering={FadeInDown.delay(1000 + idx * 100).duration(600)}
                style={styles.specCard}
              >
                <Text style={styles.specTitle}>{item[lang]?.title || item.ru.title}</Text>
                <Text style={styles.specDesc}>{item[lang]?.desc || item.ru.desc}</Text>
              </Animated.View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate("Tabs", { screen: "Specialties" } as any)}
          >
            <Text style={styles.outlineButtonText}>{t("parentsSpecMore")}</Text>
          </TouchableOpacity>
        </Section>

        {/* 9. SECURITY & CONTROL */}
        <Section title={t("parentsSecurityTitle")}>
          <Animated.View entering={FadeInDown.delay(1100).duration(600)} style={styles.card}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: "#FEF2F2" }]}>
                <Ionicons name="shield-checkmark" size={20} color="#DC2626" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{t("parentsSecurityControl")}</Text>
                <Text style={styles.featureDesc}>{t("parentsSecurityControlDesc")}</Text>
              </View>
            </View>
            <View style={[styles.featureItem, styles.dividerTop]}>
              <View style={[styles.featureIconBox, { backgroundColor: "#FDF2F8" }]}>
                <Ionicons name="people" size={20} color="#BE185D" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{t("parentsMentors")}</Text>
                <Text style={styles.featureDesc}>{t("parentsMentorsDesc")}</Text>
              </View>
            </View>
          </Animated.View>
        </Section>

        {/* 10. FAQ */}
        <Section title={t("parentsFaqTitle")}>
          <Animated.View entering={FadeInDown.delay(1200).duration(600)} style={styles.card}>
            {faq.map((item, idx) => (
              <Animated.View
                key={idx}
                entering={FadeInDown.delay(1300 + idx * 100).duration(500)}
                style={[styles.faqItem, idx !== faq.length - 1 && styles.faqSeparator]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={styles.faqHeader}
                >
                  <Text style={styles.faqQuestion}>{item[lang]?.q || item.ru.q}</Text>
                  <Ionicons
                    name={openFaq === idx ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
                {openFaq === idx && (
                  <Text style={styles.faqAnswer}>{item[lang]?.a || item.ru.a}</Text>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        </Section>

        {/* 11. CONTACTS */}
        <Section title={t("parentsContactTitle")}>
          <Animated.View entering={FadeInDown.delay(1300).duration(600)} style={styles.card}>
            {contactsData.map((c, idx) => (
              <Animated.View
                key={idx}
                entering={FadeInDown.delay(1400 + idx * 100).duration(500)}
              >
                <TouchableOpacity
                  style={[styles.contactItem, idx !== contactsData.length - 1 && styles.dividerTop]}
                  onPress={() => handleContact(c.type, c.value)}
                >
                  <View style={styles.contactIconBox}>
                    <Ionicons name={c.icon as any} size={22} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactLabel}>{c[lang]?.label || c.ru.label}</Text>
                    <Text style={styles.contactValue}>{c.value}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </Section>

        <View style={{ height: 40 }} />
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 24, paddingVertical: 32, borderRadius: 16, marginHorizontal: SECTION_PADDING, marginBottom: 8, ...shadows.card },
  backButtonHero: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  heroTitle: { color: "white", fontSize: 28, fontFamily: typography.family.bold, lineHeight: 36 },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 12, lineHeight: 24, fontFamily: typography.family.regular },
  heroActions: { flexDirection: "row", marginTop: 28 },
  heroButton: { backgroundColor: "white", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 10, ...shadows.soft },
  heroButtonText: { color: colors.primary, fontFamily: typography.family.bold, fontSize: 16 },
  fastFactsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  factCard: { padding: 16, borderRadius: 16, width: COLUMN_WIDTH, gap: 4, ...shadows.soft, marginBottom: 12 },
  factValue: { fontFamily: typography.family.bold, fontSize: 15, color: colors.foreground, marginTop: 8 },
  factLabel: { fontSize: 12, fontFamily: typography.family.regular, color: colors.muted },
  card: { backgroundColor: "white", borderRadius: 16, padding: 20, ...shadows.soft, borderWidth: 1, borderColor: colors.border },
  cardDesc: { fontSize: 14, color: colors.muted, marginBottom: 20, lineHeight: 22, fontFamily: typography.family.regular },
  dormHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  dormHeaderText: { fontSize: 18, fontFamily: typography.family.bold, color: colors.foreground },
  featuresGrid: { gap: 16 },
  featureItem: { flexDirection: "row", gap: 16 },
  featureIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 16, fontFamily: typography.family.bold, color: colors.foreground },
  featureDesc: { fontSize: 13, color: colors.muted, marginTop: 2, lineHeight: 18, fontFamily: typography.family.regular },
  detailButton: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F1F5F9", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  detailButtonText: { color: colors.primary, fontFamily: typography.family.bold, fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  whyCard: { backgroundColor: "white", borderRadius: 16, padding: 16, width: COLUMN_WIDTH, ...shadows.soft, borderWidth: 1, borderColor: colors.border, marginBottom: GRID_GAP },
  whyIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#F0F9FF", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  whyTitle: { fontFamily: typography.family.bold, fontSize: 14, color: colors.foreground, marginBottom: 4 },
  whyDesc: { fontSize: 12, fontFamily: typography.family.regular, color: colors.muted, lineHeight: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  statsValue: { fontSize: 24, fontFamily: typography.family.bold, color: colors.primary },
  statsLabel: { fontSize: 10, color: colors.muted, textAlign: "center", fontFamily: typography.family.medium },
  statsDivider: { width: 1, height: 30, backgroundColor: "#E2E8F0" },
  cardTitleInside: { fontSize: 16, fontFamily: typography.family.bold, color: colors.foreground, marginBottom: 12 },
  partnersFlow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  partnerTag: { backgroundColor: "#F8FAFC", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  partnerTagText: { fontSize: 12, color: colors.foreground, fontFamily: typography.family.medium },
  verticalStack: { gap: 16 },
  premiumCard: { width: "100%", borderRadius: 16, padding: 20, ...shadows.soft },
  wideCardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  wideCardTitle: { fontSize: 18, fontFamily: typography.family.bold },
  wideCardItem: { marginBottom: 12 },
  wideCardItemTitle: { fontSize: 14, fontFamily: typography.family.bold, color: colors.foreground },
  wideCardItemDesc: { fontSize: 12, color: colors.muted, marginTop: 2, fontFamily: typography.family.regular },
  timelineContainer: { paddingHorizontal: 0 },
  timelineItem: { flexDirection: "row", gap: 16 },
  timelineLeft: { alignItems: "center", width: 32 },
  timelineDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", zIndex: 2 },
  timelineStepText: { color: "white", fontFamily: typography.family.bold, fontSize: 14 },
  timelineLine: { width: 2, flex: 1, backgroundColor: "#E2E8F0", marginVertical: -4 },
  timelineRight: { flex: 1, paddingBottom: 28 },
  timelineTitle: { fontSize: 17, fontFamily: typography.family.bold, color: colors.foreground },
  timelineDesc: { fontSize: 14, color: colors.muted, marginTop: 4, lineHeight: 20, fontFamily: typography.family.regular },
  checkItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  checkboxActive: { backgroundColor: colors.primary },
  checkText: { fontSize: 15, color: colors.foreground, fontFamily: typography.family.medium },
  checkTextDone: { color: colors.muted, textDecorationLine: "line-through" },
  progressContainer: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  progressBarBg: { height: 8, backgroundColor: "#F1F5F9", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 4 },
  progressLabel: { fontSize: 12, color: colors.muted, marginTop: 8, textAlign: "right", fontFamily: typography.family.medium },
  expenseItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  expenseIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center", marginRight: 12 },
  expenseLabel: { flex: 1, fontSize: 14, color: colors.foreground, fontFamily: typography.family.medium },
  expensePrice: { fontSize: 14, color: colors.foreground, fontFamily: typography.family.bold },
  dormToggle: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8, paddingVertical: 8 },
  dormToggleText: { fontSize: 14, color: colors.foreground, fontFamily: typography.family.medium },
  totalBox: { marginTop: 16, padding: 16, borderRadius: 12, alignItems: "center" },
  totalBoxLabel: { fontSize: 12, color: colors.muted, fontFamily: typography.family.regular },
  totalBoxValue: { fontSize: 20, color: colors.primary, fontFamily: typography.family.bold, marginTop: 4 },
  specCard: { backgroundColor: "white", borderRadius: 16, padding: 16, width: COLUMN_WIDTH, ...shadows.soft, borderWidth: 1, borderColor: colors.border, marginBottom: GRID_GAP },
  specTitle: { fontSize: 15, fontFamily: typography.family.bold, color: colors.foreground, marginBottom: 4 },
  specDesc: { fontSize: 12, color: colors.muted, lineHeight: 16, fontFamily: typography.family.regular },
  outlineButton: { marginTop: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, alignItems: "center" },
  outlineButtonText: { color: colors.primary, fontFamily: typography.family.bold, fontSize: 15 },
  dividerTop: { borderTopWidth: 1, borderTopColor: "#F1F5F9", marginTop: 16, paddingTop: 16 },
  faqItem: { paddingVertical: 14 },
  faqSeparator: { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16 },
  faqQuestion: { flex: 1, fontSize: 15, fontFamily: typography.family.semiBold, color: colors.foreground },
  faqAnswer: { marginTop: 12, fontSize: 14, color: colors.muted, lineHeight: 22, fontFamily: typography.family.regular },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 14 },
  contactIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center" },
  contactLabel: { fontSize: 12, color: colors.muted, fontFamily: typography.family.regular },
  contactValue: { fontSize: 15, color: colors.foreground, fontFamily: typography.family.bold, marginTop: 1 },
});
