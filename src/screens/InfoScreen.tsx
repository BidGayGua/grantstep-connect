import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import type { RootStackParamList } from "../navigation/types";
import img7 from "../assets/7.jpeg";
import img8 from "../assets/8.jpeg";
import img9 from "../assets/9.jpeg";
import img10 from "../assets/10.jpeg";
import img13 from "../assets/13.jpg";
import img15 from "../assets/15.jpg";
import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n, type Language } from "../i18n";
import { colors, shadows, typography } from "../theme";

const siteUrl = "https://ektu.kz/";

interface DormFacility {
  icon: string;
  title: string;
}

interface StudentLifeItem {
  icon: string;
  title: string;
  text: string;
}

interface InfoContent {
  aboutTitle: string;
  aboutHero: string;
  aboutLead: string;
  official: string;
  history: string;
  stats: string;
  why: string;
  gallery: string;
  life: string;
  ready: string;
  readyText: string;
  chooseSpecialty: string;
  submitDocs: string;
  dormTitle: string;
  dormHeroTitle: string;
  dormHeroText: string;
  dormNewHome: string;
  dormAdvantage1Title: string;
  dormAdvantage1Text: string;
  dormAdvantage2Title: string;
  dormAdvantage2Text: string;
  dormAdvantage3Title: string;
  dormAdvantage3Text: string;
  dormCalcTitle: string;
  dormCalcType: string;
  dormCalc2Bed: string;
  dormCalc3Bed: string;
  dormCalcPeriod: string;
  dormCalcSemester: string;
  dormCalcYear: string;
  dormTotalLabel: string;
  dormTotalNotice: string;
  dormFooterTitle: string;
  dormFooterText: string;
  dormSafetyTitle: string;
  dormSafety1Title: string;
  dormSafety1Text: string;
  dormSafety2Title: string;
  dormSafety2Text: string;
  dormDocsTitle: string;
  dormDocsLead: string;
  dormDoc1: string;
  dormDoc2: string;
  dormDoc3: string;
  dormDoc4: string;
  dormDoc5: string;
  dormStepsTitle: string;
  dormSteps: string[];
  dormAmenitiesTitle: string;
  dormVirtualTour: string;
  dormFacilities: DormFacility[];
  dormReady: string;
  dormReadyText: string;
  faqTitle: string;
  faqLead: string;
  searchPlaceholder: string;
  categories: string[];
  popular: string;
  help: string;
  call: string;
  write: string;
  openSite: string;
  studentLife: StudentLifeItem[];
  faqData: [string, string, string][];
}

const content: Record<Language, InfoContent> = {
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
    dormTitle: "Условия проживания",
    dormHeroTitle: "Дома студентов ВКТУ",
    dormHeroText: "Премиальный комфорт и современная экосистема для вашей успешной учебы.",
    dormNewHome: "Ваш новый дом",
    dormAdvantage1Title: "Элитный комфорт",
    dormAdvantage1Text: "Новая эргономичная мебель, ортопедические матрасы, свежий ремонт и продуманное зонирование.",
    dormAdvantage2Title: "Умный кампус",
    dormAdvantage2Text: "Высокоскоростной Wi-Fi на всей территории, современные прачечные самообслуживания.",
    dormAdvantage3Title: "Кулинарные зоны",
    dormAdvantage3Text: "Просторные кухни с индукционными плитами, микроволновками и индивидуальными зонами.",
    dormCalcTitle: "Рассчитать стоимость проживания",
    dormCalcType: "Тип размещения",
    dormCalc2Bed: "2-местная",
    dormCalc3Bed: "3-местная",
    dormCalcPeriod: "Период проживания",
    dormCalcSemester: "Семестр (5 мес.)",
    dormCalcYear: "Учебный год (10 мес.)",
    dormTotalLabel: "Итого к оплате:",
    dormTotalNotice: "* цена актуальна на 2024-2025 учебный год",
    dormSafetyTitle: "Безопасность и контроль",
    dormSafety1Title: "Круглосуточная охрана 24/7",
    dormSafety1Text: "Профессиональная служба безопасности и видеонаблюдение во всех корпусах.",
    dormSafety2Title: "Пропускная система",
    dormSafety2Text: "Вход в Дом студентов осуществляется строго по индивидуальным бесконтактным картам.",
    dormFooterTitle: "Остались вопросы?",
    dormFooterText: "Обратитесь в Ситуационный центр ВКТУ:",
    dormDocsTitle: "Необходимые документы",
    dormDocsLead: "Для заселения необходимо подготовить пакет документов и подать заявление через портал вуза.",
    dormDoc1: "Заявление (через личный кабинет)",
    dormDoc2: "Копия удостоверения личности",
    dormDoc3: "Медицинская справка 075/у",
    dormDoc4: "Фото 3х4 (4 штуки)",
    dormDoc5: "Подтверждение льгот (при наличии)",
    dormStepsTitle: "Как получить место?",
    dormSteps: [
      "Подача заявления онлайн",
      "Рассмотрение комиссии",
      "Получение направления",
      "Оплата проживания",
      "Заселение в корпус",
    ],
    dormAmenitiesTitle: "Удобства и сервис",
    dormVirtualTour: "Виртуальный тур",
    dormFacilities: [
      { icon: "wifi", title: "Free Wi-Fi" },
      { icon: "shirt", title: "Прачечные" },
      { icon: "library", title: "Коворкинги" },
      { icon: "fitness", title: "Спортзалы" },
      { icon: "shield-checkmark", title: "Безопасность" },
      { icon: "restaurant", title: "Кухни" },
    ],
    dormReady: "Приемная комиссия ВКТУ",
    dormReadyText: "Подайте электронное заявление на общежитие онлайн или свяжитесь с нами напрямую для консультации.",
    faqTitle: "FAQ",
    faqLead: "Быстрые ответы на вопросы абитуриентов и родителей.",
    searchPlaceholder: "Введите вопрос...",
    categories: ["Все", "Поступление", "Гранты", "Документы", "Общежитие", "ЕНТ", "Специальности"],
    popular: "Популярные вопросы",
    help: "Нужна помощь?",
    call: "Позвонить",
    write: "Написать",
    openSite: "Открыть сайт",
    studentLife: [
      { icon: "calendar", title: "Мероприятия", text: "Форумы, конференции, конкурсы и карьерные встречи." },
      { icon: "people", title: "Клубы", text: "Студенческие объединения по интересам и проектам." },
      { icon: "fitness", title: "Спорт", text: "Секции, турниры и активная кампусная жизнь." },
      { icon: "heart", title: "Волонтерство", text: "Социальные проекты и помощь городскому сообществу." },
    ],
    faqData: [
      ["Поступление", "Какие документы нужны для поступления?", "Удостоверение личности, аттестат с приложением, сертификат ЕНТ, медицинская справка 075у и 4 фото 3x4."],
      ["Гранты", "Как получить внутренний грант ВКТУ?", "Внутренние гранты присуждаются на основе баллов ЕНТ и достижений в олимпиадах университета."],
      ["Общежитие", "Как подать заявку на общежитие?", "Заявка подается через личный кабинет студента или в отделе размещения после зачисления."],
      ["ЕНТ", "Какой проходной балл в 2024 году?", "Для технических специальностей пороговый балл составляет 50, включая не менее 5 баллов по каждому предмету."],
      ["Документы", "Можно ли подать документы онлайн?", "Да, через портал eGov или информационную систему университета в период приемной кампании."],
      ["Специальности", "Есть ли в ВКТУ двойной диплом?", "Да, университет сотрудничает с вузами Германии, России и Китая по программам двойного диплома."],
      ["Общежитие", "Сколько стоит проживание в общежитии?", "Стандартная стоимость проживания составляет 10 000 тенге в месяц. Для студентов из многодетных семей и первокурсников из южных/западных регионов Казахстана действует льготная цена — 5 000 тенге в месяц. Студенты-сироты и лица с инвалидностью освобождаются от оплаты."],
      ["Гранты", "Как работает Сельская квота (Ауыл квотасы)?", "Для абитуриентов из сельской местности выделяется до 30% от общего количества государственных грантов на технические и IT-специальности. Конкурс для таких кандидатов проводится отдельно, что повышает шансы на поступление."],
      ["Поступление", "Что делать, если не хватило баллов на госгрант?", "Вы можете подать заявление на внутренний Грант Ректора ВКТУ, претендовать на целевые гранты местных акиматов (образовательные гранты от региона) или заключить договор на финансирование обучения от крупных промышленных компаний-партнеров вуза."],
    ],
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
    dormTitle: "Тұру жағдайлары",
    dormHeroTitle: "ВКТУ студенттер үйлері",
    dormHeroText: "Сіздің сәтті оқуыңыз үшін премиум жайлылық пен заманауи экожүйе.",
    dormNewHome: "Сіздің жаңа үйіңіз",
    dormAdvantage1Title: "Элиталық жайлылық",
    dormAdvantage1Text: "Жаңа эргономикалық жиһаз, ортопедиялық матрацтар, жаңа жөндеу және ойластырылған аймақтар.",
    dormAdvantage2Title: "Ақылды кампус",
    dormAdvantage2Text: "Барлық аумақта жоғары жылдамдықты Wi-Fi, заманауи өзіне-өзі қызмет көрсету кір жуу орындары.",
    dormAdvantage3Title: "Аспаздық аймақтар",
    dormAdvantage3Text: "Индукциялық плиталары, микротолқынды пештері бар кең асүйлер және жеке аймақтар.",
    dormCalcTitle: "Тұру құнын есептеу",
    dormCalcType: "Орналастыру түрі",
    dormCalc2Bed: "2-орындық",
    dormCalc3Bed: "3-орындық",
    dormCalcPeriod: "Тұру мерзімі",
    dormCalcSemester: "Семестр (5 ай)",
    dormCalcYear: "Оқу жылы (10 ай)",
    dormTotalLabel: "Төлеуге барлығы:",
    dormTotalNotice: "* баға 2024-2025 оқу жылына өзекті",
    dormSafetyTitle: "Қауіпсіздік және бақылау",
    dormSafety1Title: "Тәулік бойы күзет 24/7",
    dormSafety1Text: "Кәсіби күзет қызметі және барлық корпустарда бейнебақылау.",
    dormSafety2Title: "Өткізу жүйесі",
    dormSafety2Text: "Студенттер үйіне кіру қатаң түрде жеке контактісіз карталар арқылы жүзеге асырылады.",
    dormFooterTitle: "Сұрақтарыңыз бар ма?",
    dormFooterText: "ВКТУ Ситуациялық орталығына хабарласыңыз:",
    dormDocsTitle: "Қажетті құжаттар",
    dormDocsLead: "Қоныстану үшін құжаттар пакетін дайындап, жоғары оқу орнының порталы арқылы өтініш беру қажет.",
    dormDoc1: "Өтініш (жеке кабинет арқылы)",
    dormDoc2: "Жеке куәлік көшірмесі",
    dormDoc3: "075/у медициналық анықтамасы",
    dormDoc4: "3х4 фото (4 дана)",
    dormDoc5: "Жеңілдіктерді растау (бар болса)",
    dormStepsTitle: "Орынды қалай алуға болады?",
    dormSteps: [
      "Өтінішті онлайн беру",
      "Комиссияның қарауы",
      "Жолдама алу",
      "Тұру ақысын төлеу",
      "Корпусқа қоныстану",
    ],
    dormAmenitiesTitle: "Ыңғайлылық пен сервис",
    dormVirtualTour: "Виртуалды тур",
    dormFacilities: [
      { icon: "wifi", title: "Free Wi-Fi" },
      { icon: "shirt", title: "Кір жуу орындары" },
      { icon: "library", title: "Коворкингтер" },
      { icon: "fitness", title: "Спортзалдар" },
      { icon: "shield-checkmark", title: "Қауіпсіздік" },
      { icon: "restaurant", title: "Асүйлер" },
    ],
    dormReady: "ВКТУ қабылдау комиссиясы",
    dormReadyText: "Жатақханаға электронды өтінішті онлайн беріңіз немесе кеңес алу үшін бізге тікелей хабарласыңыз.",
    faqTitle: "FAQ",
    faqLead: "Талапкерлер мен ата-аналарға арналған жылдам жауаптар.",
    searchPlaceholder: "Сұрақ енгізіңіз...",
    categories: ["Барлығы", "Қабылдау", "Гранттар", "Құжаттар", "Жатақхана", "ҰБТ", "Мамандықтар"],
    popular: "Танымал сұрақтар",
    help: "Көмек керек пе?",
    call: "Қоңырау шалу",
    write: "Жазу",
    openSite: "Сайтты ашу",
    studentLife: [
      { icon: "calendar", title: "Іс-шаралар", text: "Форумдар, конференциялар, конкурстар және мансаптық кездесулер." },
      { icon: "people", title: "Клубтар", text: "Мүдделер мен жобалар бойынша студенттік бірлестіктер." },
      { icon: "fitness", title: "Спорт", text: "Секциялар, турнирлер және белсенді кампус өмірі." },
      { icon: "heart", title: "Волонтерлік", text: "Әлеуметтік жобалар және қала қоғамдастығына көмек." },
    ],
    faqData: [
      ["Қабылдау", "Оқуға түсу үшін қандай құжаттар қажет?", "Жеке куәлік, қосымшасы бар аттестат, ҰБТ сертификаты, 075у медициналық анықтамасы және 4 фото 3x4."],
      ["Гранттар", "ВКТУ-дың ішкі грантын қалай алуға болады?", "Ішкі гранттар ҰБТ ұпайлары мен университет олимпиадаларындағы жетістіктер негізінде беріледі."],
      ["Жатақхана", "Жатақханаға қалай өтініш беруге болады?", "Өтініш студенттің жеке кабинеті арқылы немесе оқуға түскеннен кейін орналастыру бөлімінде беріледі."],
      ["ҰБТ", "2024 жылы шекті балл қанша?", "Техникалық мамандықтар үшін шекті балл 50, соның ішінде әр пәннен кемінде 5 балл."],
      ["Құжаттар", "Құжаттарды онлайн тапсыруға бола ма?", "Иә, eGov порталы немесе қабылдау науқаны кезінде университеттің ақпараттық жүйесі арқылы."],
      ["Мамандықтар", "ВКТУ-да қос диплом бар ма?", "Иә, университет Германия, Ресей және Қытай жоғары оқу орындарымен қос диплом бағдарламалары бойынша жұмыс істейді."],
      ["Жатақхана", "Жатақханада тұру құны қанша?", "Тұрудың стандартты құны айына 10 000 теңгені құрайды. Көпбалалы отбасылардан шыққан студенттер мен Қазақстанның оңтүстік/батыс өңірлерінен келген бірінші курс студенттері үшін 5 000 теңге көлемінде жеңілдік бағасы қарастырылған. Жетім студенттер мен мүгедектігі бар адамдар төлемнен босатылады."],
      ["Гранттар", "Ауыл квотасы қалай жұмыс істейді?", "Ауылдық жерлерден келген талапкерлер үшін техникалық және IT-мамандықтарға мемлекеттік гранттардың жалпы санының 30%-ына дейін бөлінеді. Мұндай үміткерлер үшін конкурс бөлек өткізіледі, бұл оқуға түсу мүмкіндігін арттырады."],
      ["Қабылдау", "Егер мемлекеттік грантқа балл жетпесе не істеу керек?", "Сіз ВКТУ Ректорының ішкі грантына өтініш бере аласыз, жергілікті әкімдіктердің нысаналы гранттарына (аймақтық білім беру гранттары) үміткер бола аласыз немесе жоғары оқу орнының ірі өнеркәсіптік серіктес компанияларынан оқуды қаржыландыруға келісімшарт жасай аласыз."],
    ],
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
    dormTitle: "Living Conditions",
    dormHeroTitle: "EKTU Students' Houses",
    dormHeroText: "Premium comfort and modern ecosystem for your successful studies.",
    dormNewHome: "Your new home",
    dormAdvantage1Title: "Elite Comfort",
    dormAdvantage1Text: "New ergonomic furniture, orthopedic mattresses, fresh renovation and smart zoning.",
    dormAdvantage2Title: "Smart Campus",
    dormAdvantage2Text: "High-speed Wi-Fi throughout the territory, modern self-service laundries.",
    dormAdvantage3Title: "Culinary Zones",
    dormAdvantage3Text: "Spacious kitchens with induction hobs, microwaves and individual zones.",
    dormCalcTitle: "Calculate Living Cost",
    dormCalcType: "Accommodation Type",
    dormCalc2Bed: "2-bed room",
    dormCalc3Bed: "3-bed room",
    dormCalcPeriod: "Living Period",
    dormCalcSemester: "Semester (5 months)",
    dormCalcYear: "Academic Year (10 months)",
    dormTotalLabel: "Total to pay:",
    dormTotalNotice: "* price valid for 2024-2025 academic year",
    dormSafetyTitle: "Safety and Control",
    dormSafety1Title: "24/7 Security",
    dormSafety1Text: "Professional security service and video surveillance in all buildings.",
    dormSafety2Title: "Access System",
    dormSafety2Text: "Entry to the Students' House is strictly by individual contactless cards.",
    dormFooterTitle: "Have questions?",
    dormFooterText: "Contact the EKTU Situation Center:",
    dormDocsTitle: "Required Documents",
    dormDocsLead: "To move in, you need to prepare a package of documents and submit an application through the university portal.",
    dormDoc1: "Application (via personal account)",
    dormDoc2: "Copy of ID card",
    dormDoc3: "Medical certificate 075/u",
    dormDoc4: "3x4 photos (4 pcs.)",
    dormDoc5: "Confirmation of benefits (if any)",
    dormStepsTitle: "How to get a room?",
    dormSteps: [
      "Online application",
      "Committee review",
      "Receive referral",
      "Accommodation payment",
      "Moving in",
    ],
    dormAmenitiesTitle: "Amenities & Service",
    dormVirtualTour: "Virtual Tour",
    dormFacilities: [
      { icon: "wifi", title: "Free Wi-Fi" },
      { icon: "shirt", title: "Laundries" },
      { icon: "library", title: "Coworkings" },
      { icon: "fitness", title: "Gyms" },
      { icon: "shield-checkmark", title: "Security" },
      { icon: "restaurant", title: "Kitchens" },
    ],
    dormReady: "EKTU Admissions Office",
    dormReadyText: "Submit an online application for the dormitory or contact us directly for a consultation.",
    faqTitle: "FAQ",
    faqLead: "Fast answers for applicants and parents.",
    searchPlaceholder: "Enter your question...",
    categories: ["All", "Admission", "Grants", "Documents", "Dormitory", "UNT", "Specialties"],
    popular: "Popular questions",
    help: "Still need help?",
    call: "Call",
    write: "Write",
    openSite: "Open site",
    studentLife: [
      { icon: "calendar", title: "Events", text: "Forums, conferences, competitions and career meetings." },
      { icon: "people", title: "Clubs", text: "Student associations based on interests and projects." },
      { icon: "fitness", title: "Sports", text: "Sections, tournaments and active campus life." },
      { icon: "heart", title: "Volunteering", text: "Social projects and help for the urban community." },
    ],
    faqData: [
      ["Admission", "What documents are needed for admission?", "ID card, certificate with supplement, UNT certificate, medical certificate 075u and 4 photos 3x4."],
      ["Grants", "How to get an EKTU internal grant?", "Internal grants are awarded based on UNT scores and achievements in university Olympiads."],
      ["Dormitory", "How to apply for a dormitory?", "Application is submitted via student portal or at the accommodation department after admission."],
      ["UNT", "What is the threshold score in 2024?", "For technical specialties, the threshold is 50, with at least 5 points in each subject."],
      ["Documents", "Can documents be submitted online?", "Yes, via eGov portal or the university information system during the admission period."],
      ["Specialties", "Does EKTU have double degree programs?", "Yes, the university cooperates with universities in Germany, Russia and China for double degree programs."],
      ["Dormitory", "How much does it cost to live in the dormitory?", "The standard cost of living is 10,000 tenge per month. For students from large families and freshmen from southern/western regions of Kazakhstan, there is a discounted price of 5,000 tenge per month. Orphan students and persons with disabilities are exempt from payment."],
      ["Grants", "How does the Rural Quota work?", "For applicants from rural areas, up to 30% of the total number of state grants for technical and IT specialties are allocated. The competition for such candidates is held separately, which increases the chances of admission."],
      ["Admission", "What to do if there are not enough points for a state grant?", "You can apply for the internal EKTU Rector's Grant, claim target grants from local administrations (regional educational grants), or conclude an agreement for financing studies from large industrial partner companies of the university."],
    ],
  },
} as const;

const history = [
  { year: "1958", ru: "Основание университета", kk: "Университеттің негізі қалануы", en: "University foundation" },
  { year: "1980", ru: "Развитие инженерных направлений", kk: "Инженерлік бағыттардың дамуы", en: "Engineering programs growth" },
  { year: "2000", ru: "Международное сотрудничество", kk: "Халықаралық ынтымақтастық", en: "International cooperation" },
  { year: "2020+", ru: "Цифровая трансформация и современные лаборатории", kk: "Цифрлық трансформация және заманауи зертханалар", en: "Digital transformation and modern labs" },
] as const;

const stats = [
  { icon: "people", value: "7 500+", ru: "Студенты", kk: "Студенттер", en: "Students" },
  { icon: "person", value: "500+", ru: "Преподаватели", kk: "Оқытушылар", en: "Teachers" },
  { icon: "business", value: "5", ru: "Факультеты", kk: "Факультеттер", en: "Faculties" },
  { icon: "library", value: "30+", ru: "Кафедры", kk: "Кафедралар", en: "Departments" },
  { icon: "globe", value: "20+", ru: "Международные программы", kk: "Халықаралық бағдарламалар", en: "International programs" },
  { icon: "trophy", value: "ТОП-10", ru: "в Казахстане", kk: "Қазақстанда", en: "Top 10 in Kazakhstan" },
] as const;

const galleryImages = [img7, img8, img9, img10, img13, img15];

export function InfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Info" | any>>();
  const { language } = useI18n();

  const kind = route.params?.kind || "about";
  const c = content[language as Language] || content.ru;

  if (kind === "dorm") {
    return <DormScreen navigation={navigation} c={c} />;
  }

  if (kind === "faq") {
    return <FaqScreen c={c} />;
  }

  return (
    <Screen>
      <Stack>
        <HeaderBack title={c.aboutTitle} />
        <Animated.View entering={FadeInDown.duration(600)}>
          <Hero
            image={img8}
            title={c.aboutHero}
            text={c.aboutLead}
            button={c.official}
            onButtonPress={() => Linking.openURL(siteUrl)}
          />
        </Animated.View>

        <Section title={c.history}>
          <View style={styles.timeline}>
            {history.map((item, i) => (
              <Animated.View
                key={item.year}
                entering={FadeInDown.delay(200 + i * 100).duration(600)}
                style={styles.timelineCard}
              >
                <Text style={styles.timelineYear}>{item.year}</Text>
                <Text style={styles.timelineText}>{item[language as Language] || item.ru}</Text>
              </Animated.View>
            ))}
          </View>
        </Section>

        <Section title={c.stats}>
          <View style={styles.statsGrid}>
            {stats.map((item, i) => (
              <Animated.View
                key={item.ru}
                entering={FadeInDown.delay(400 + i * 50).duration(600)}
                style={styles.statCard}
              >
                <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                <Text style={statValueStyle()}>{item.value}</Text>
                <Text style={styles.statLabel}>{item[language as Language] || item.ru}</Text>
              </Animated.View>
            ))}
          </View>
        </Section>

        <Gallery title={c.gallery} images={galleryImages} />

        <Section title={c.life}>
          <View style={styles.lifeGrid}>
            {c.studentLife.map((item, i) => (
              <Animated.View
                key={item.title}
                entering={FadeInDown.delay(600 + i * 100).duration(600)}
                style={styles.lifeCard}
              >
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                <Text style={styles.lifeTitle}>{item.title}</Text>
                <Text style={styles.lifeText}>{item.text}</Text>
              </Animated.View>
            ))}
          </View>
        </Section>

        <Animated.View entering={FadeInDown.delay(800).duration(600)}>
          <Cta
            title={c.ready}
            text={c.readyText}
            primary={c.chooseSpecialty}
            secondary={c.submitDocs}
            onPrimary={() => navigation.navigate("Tabs", { screen: "Specialties" } as any)}
            onSecondary={() => Linking.openURL(siteUrl)}
          />
        </Animated.View>
        <View style={{ height: 20 }} />
      </Stack>
    </Screen>
  );
}

function statValueStyle() {
  return styles.statValue;
}

function DormScreen({
  navigation,
  c,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  c: InfoContent;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Screen contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
      <Stack>
        <HeaderBack title={c.dormTitle} onBack={() => navigation.goBack()} />
        <Animated.View entering={FadeInDown.duration(600)}>
          <Hero
            image={img8}
            title={c.dormHeroTitle}
            text={c.dormHeroText}
            button={c.dormVirtualTour}
            onButtonPress={() => Linking.openURL("https://ektu.kz/virtualtour/index.html")}
          />
        </Animated.View>

        <Section title={c.dormNewHome}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.advantageScroll}
          >
            {[
              { title: c.dormAdvantage1Title, text: c.dormAdvantage1Text, icon: "star", img: img15 },
              { title: c.dormAdvantage2Title, text: c.dormAdvantage2Text, icon: "flash", img: img13 },
              { title: c.dormAdvantage3Title, text: c.dormAdvantage3Text, icon: "restaurant", img: img10 },
            ].map((item, i) => (
              <Animated.View
                key={i}
                entering={FadeInRight.delay(200 + i * 150).duration(600)}
                style={styles.advantageCard}
              >
                <Image source={item.img} style={styles.advantageImage} />
                <View style={styles.advantageContent}>
                  <View style={styles.advantageHeader}>
                    <View style={styles.advantageIconBg}>
                      <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.advantageTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.advantageText}>{item.text}</Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </Section>

        <Section title={c.dormAmenitiesTitle || "Amenities"}>
          <View style={styles.facilitiesGrid}>
            {(c.dormFacilities).map((f, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(300 + i * 50).duration(500)}
                style={styles.facilityItem}
              >
                <View style={styles.facilityIcon}>
                  <Ionicons name={f.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={styles.facilityTitle}>{f.title}</Text>
              </Animated.View>
            ))}
          </View>
        </Section>

        <Section title="Стоимость проживания">
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.textCard}>
            <Text style={styles.bodyText}>
              Стандартная стоимость проживания в общежитиях ВКТУ составляет 10 000 тенге в месяц. Для студентов из многодетных семей, а также для первокурсников из южных и западных регионов Казахстана действует льготная цена — 5 000 тенге в месяц.
            </Text>
          </Animated.View>
        </Section>

        <Section title={c.dormStepsTitle || "Steps"}>
          <View style={styles.stepsCard}>
            {c.dormSteps.map((step: string, i: number) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(400 + i * 100).duration(500)}
                style={styles.stepRow}
              >
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
                {i < c.dormSteps.length - 1 && <View style={styles.stepConnector} />}
              </Animated.View>
            ))}
          </View>
        </Section>

        <Section title={c.dormSafetyTitle}>
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.safetyCardInfo}>
            <View style={styles.safetyRow}>
              <View style={styles.safetyIconCircle}>
                <Ionicons name="shield-checkmark" size={24} color={colors.success} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.safetyTitle}>{c.dormSafety1Title}</Text>
                <Text style={styles.safetyText}>
                  {c.dormSafety1Text}
                </Text>
              </View>
            </View>
            <View style={[styles.safetyRow, styles.dividerTop]}>
              <View style={styles.safetyIconCircle}>
                <Ionicons name="card-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.safetyTitle}>{c.dormSafety2Title}</Text>
                <Text style={styles.safetyText}>
                  {c.dormSafety2Text}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Section>

        <Section title={c.dormDocsTitle}>
          <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.textCard}>
            <Text style={styles.bodyText}>{c.dormDocsLead}</Text>
            {[c.dormDoc1, c.dormDoc2, c.dormDoc3, c.dormDoc4, c.dormDoc5].map((doc, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(800 + i * 100).duration(500)}
                style={styles.dormFeature}
              >
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.featureText}>{doc}</Text>
              </Animated.View>
            ))}
          </Animated.View>
        </Section>

        <Animated.View entering={FadeInDown.delay(800).duration(600)}>
          <Cta
            title={c.dormReady}
            text={c.dormReadyText}
            primary={c.submitDocs}
            secondary={c.call}
            onPrimary={() => Linking.openURL(siteUrl)}
            onSecondary={() => Linking.openURL("tel:+77072855012")}
          />
        </Animated.View>
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
    return c.faqData.filter((item) => {
      const categoryMatch = category === 0 || item[0] === selected;
      const textMatch = !normalized || `${item[1]} ${item[2]}`.toLowerCase().includes(normalized);
      return categoryMatch && textMatch;
    });
  }, [c.categories, c.faqData, category, query]);

  return (
    <Screen>
      <Stack>
        <HeaderBack title={c.faqTitle} />
        <Animated.Text entering={FadeInDown.duration(600)} style={styles.faqLead}>{c.faqLead}</Animated.Text>
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder={c.searchPlaceholder} placeholderTextColor={colors.muted} style={styles.searchInput} />
        </Animated.View>

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
                <Animated.View
                  key={item[1]}
                  entering={FadeInDown.delay(200 + index * 50).duration(600)}
                  style={styles.accordionItem}
                >
                  <TouchableOpacity onPress={() => setOpen(opened ? null : index)} style={styles.accordionHead} activeOpacity={0.82}>
                    <Text style={styles.accordionQuestion}>{item[1]}</Text>
                    <Ionicons name={opened ? "chevron-up" : "chevron-down"} size={18} color={colors.primary} />
                  </TouchableOpacity>
                  {opened ? <Text style={styles.accordionAnswer}>{item[2]}</Text> : null}
                </Animated.View>
              );
            })}
          </View>
        </Section>

        <Section title={c.popular}>
          <View style={styles.popularGrid}>
            {c.faqData.slice(0, 4).map((item, i) => (
              <Animated.View key={item[1]} entering={FadeInRight.delay(400 + i * 100).duration(600)}>
                <TouchableOpacity style={styles.popularCard} activeOpacity={0.84}>
                  <Ionicons name="flame" size={18} color={colors.primary} />
                  <Text style={styles.popularText}>{item[1]}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Section>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.helpCard}>
          <Text style={styles.helpTitle}>{c.help}</Text>
          <ContactLine icon="call" label="Приемная комиссия" value="+7 (707) 285-50-12" />
          <ContactLine icon="mail" label="Email" value="admission@ektu.kz" />
          <ContactLine icon="globe" label="Официальный сайт" value="ektu.kz" />
          <View style={styles.helpButtons}>
            <SmallButton label={c.call} icon="call" onPress={() => Linking.openURL("tel:+77072855012")} />
            <SmallButton label={c.write} icon="mail" onPress={() => Linking.openURL("mailto:admission@ektu.kz")} />
            <SmallButton label={c.openSite} icon="open" onPress={() => Linking.openURL(siteUrl)} />
          </View>
        </Animated.View>
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

function Hero({
  image,
  title,
  text,
  button,
  onButtonPress,
}: {
  image: number;
  title: string;
  text: string;
  button?: string;
  onButtonPress?: () => void;
}) {
  return (
    <View style={styles.heroWrap}>
      <ImageBackground source={image} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroText}>{text}</Text>
          {button ? (
            <TouchableOpacity
              style={styles.heroButton}
              onPress={onButtonPress || (() => Linking.openURL(siteUrl))}
              activeOpacity={0.84}
            >
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
          <Animated.View
            key={index}
            entering={FadeInRight.delay(500 + index * 100).duration(600)}
          >
            <Image source={image} style={styles.galleryImage} />
          </Animated.View>
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
    paddingTop: 4,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40,
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
    borderRadius: 32,
    minHeight: 240,
    justifyContent: "flex-end",
    overflow: "hidden",
    ...shadows.card,
  },
  heroImage: { borderRadius: 32 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,43,137,0.55)",
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
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
    backgroundColor: colors.white,
    borderRadius: 24,
    flexDirection: "row",
    gap: 16,
    padding: 20,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    width: "48.5%",
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
  gallery: { gap: 10, paddingRight: 20 },
  galleryImage: {
    borderRadius: 18,
    height: 132,
    width: 210,
  },
  lifeGrid: { gap: 10 },
  lifeCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderRadius: 32,
    marginHorizontal: 20,
    padding: 24,
    ...shadows.card,
    backgroundColor: colors.primary,
  },
  ctaTitle: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 22,
    textAlign: 'center',
  },
  ctaText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  ctaButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  ctaPrimary: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flex: 1,
    paddingVertical: 15,
    ...shadows.soft,
  },
  ctaPrimaryText: {
    color: colors.primary,
    fontFamily: typography.family.bold,
    fontSize: 15,
    textAlign: "center",
  },
  ctaSecondary: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    flex: 1,
    paddingVertical: 15,
  },
  ctaSecondaryText: {
    color: colors.white,
    fontFamily: typography.family.bold,
    fontSize: 15,
    textAlign: "center",
  },
  textCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    gap: 12,
    padding: 20,
    marginHorizontal: 20,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bodyText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  dormFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  featureText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 14,
  },
  safetyCardInfo: {
    backgroundColor: colors.white,
    borderRadius: 28,
    marginHorizontal: 20,
    overflow: "hidden",
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  safetyRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  safetyTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  safetyText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  dividerTop: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  helpCardFooter: {
    backgroundColor: colors.card,
    borderRadius: 24,
    margin: 20,
    padding: 20,
    alignItems: "center",
    ...shadows.soft,
  },
  helpTitleLight: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 17,
  },
  helpTextLight: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 13,
    marginTop: 4,
  },
  contactButtonLight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 14,
  },
  contactButtonTextLight: {
    color: colors.primary,
    fontFamily: typography.family.bold,
    fontSize: 15,
  },
  faqLead: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
  accordion: { gap: 10, paddingHorizontal: 20 },
  accordionItem: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: "hidden",
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
  popular: { paddingHorizontal: 20 },
  popularGrid: { gap: 9 },
  popularCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
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
  advantageScroll: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 10,
  },
  advantageCard: {
    width: 280,
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: "hidden",
    borderColor: colors.border,
    borderWidth: 1,
    ...shadows.soft,
  },
  advantageImage: {
    width: "100%",
    height: 140,
  },
  advantageContent: {
    padding: 16,
  },
  advantageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  advantageIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  advantageTitle: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.foreground,
  },
  advantageText: {
    fontSize: 13,
    fontFamily: typography.family.regular,
    color: colors.muted,
    lineHeight: 18,
  },
  safetyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  footerInfo: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerInfoTitle: {
    fontSize: 18,
    fontFamily: typography.family.bold,
    color: colors.foreground,
  },
  footerInfoText: {
    fontSize: 14,
    fontFamily: typography.family.regular,
    color: colors.muted,
    marginTop: 4,
    textAlign: "center",
  },
  footerPhone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 16,
  },
  footerPhoneText: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.primary,
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
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
  },
  facilityItem: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "48%",
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  facilityIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  facilityTitle: {
    fontSize: 12,
    fontFamily: typography.family.semiBold,
    color: colors.foreground,
    flex: 1,
  },
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    marginHorizontal: 20,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
    position: "relative",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.family.bold,
  },
  stepText: {
    fontSize: 14,
    fontFamily: typography.family.medium,
    color: colors.foreground,
    flex: 1,
  },
  stepConnector: {
    position: "absolute",
    left: 15,
    top: 40,
    width: 2,
    height: 24,
    backgroundColor: colors.border,
    zIndex: 1,
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
});
