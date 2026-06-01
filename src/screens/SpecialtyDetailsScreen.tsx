import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { ReactNode } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { RootStackParamList } from "../../App";
import {
  categoryLabels,
  specialties,
  type Specialty,
  type SpecialtyCategory,
} from "../data/specialties";
import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { useI18n } from "../i18n";
import { admissionStore, useAdmission } from "../lib/documents-store";
import { colors, shadows, typography } from "../theme";

type SalaryRange = {
  junior: string;
  middle: string;
  senior: string;
};

type CareerProfile = {
  opportunities: string[];
  skills: string[];
  employers: string[];
  demand: "high" | "medium" | "low";
  prospects: string;
  growth: string;
};

const salaryByCategory: Record<SpecialtyCategory, SalaryRange> = {
  IT: {
    junior: "250 000 – 450 000 ₸",
    middle: "600 000 – 1 200 000 ₸",
    senior: "1 300 000 – 2 500 000+ ₸",
  },
  engineering: {
    junior: "220 000 – 380 000 ₸",
    middle: "450 000 – 850 000 ₸",
    senior: "900 000 – 1 600 000 ₸",
  },
  energy: {
    junior: "230 000 – 400 000 ₸",
    middle: "500 000 – 900 000 ₸",
    senior: "950 000 – 1 700 000 ₸",
  },
  construction: {
    junior: "220 000 – 380 000 ₸",
    middle: "450 000 – 850 000 ₸",
    senior: "900 000 – 1 500 000 ₸",
  },
  industry: {
    junior: "250 000 – 450 000 ₸",
    middle: "550 000 – 1 000 000 ₸",
    senior: "1 100 000 – 1 900 000 ₸",
  },
  business: {
    junior: "200 000 – 350 000 ₸",
    middle: "400 000 – 800 000 ₸",
    senior: "850 000 – 1 600 000 ₸",
  },
  environment: {
    junior: "200 000 – 340 000 ₸",
    middle: "380 000 – 750 000 ₸",
    senior: "800 000 – 1 400 000 ₸",
  },
};

const workplacesByCategory: Record<SpecialtyCategory, string[]> = {
  IT: [
    "IT-компании, банки, телеком, госцифровизация и международные remote-команды.",
    "Продуктовые команды, стартапы, интеграторы и внутренние IT-отделы крупных предприятий.",
  ],
  engineering: [
    "Машиностроительные заводы, сервисные компании, R&D-лаборатории и производственные цеха.",
    "Предприятия автоматизации, робототехнические центры и инженерные бюро.",
  ],
  energy: [
    "Электростанции, подстанции, энергосетевые компании и промышленные предприятия.",
    "Проекты по энергоэффективности, солнечной и ветровой энергетике.",
  ],
  construction: [
    "Проектные организации, строительные компании, девелоперы и городская инфраструктура.",
    "BIM-команды, дорожные проекты, геодезические службы и строительный надзор.",
  ],
  industry: [
    "Металлургические комбинаты, горнодобывающие предприятия, нефтегазовые компании.",
    "Лаборатории качества, технологические отделы и производственные площадки.",
  ],
  business: [
    "Банки, логистические компании, промышленные предприятия и консалтинговые команды.",
    "Отделы планирования, закупок, аналитики, продаж и управления проектами.",
  ],
  environment: [
    "Промышленные предприятия, экологические лаборатории, HSE-службы и проектные организации.",
    "Компании, которым нужны специалисты по безопасности, охране труда и ESG.",
  ],
};

const skillsByCategory: Record<SpecialtyCategory, string[]> = {
  IT: ["Аналитическое мышление", "Программирование", "Работа с данными", "Английский для документации"],
  engineering: ["Техническое мышление", "CAD/CAE", "Работа с оборудованием", "Производственная дисциплина"],
  energy: ["Электротехника", "Расчёты систем", "Техника безопасности", "Работа с нормативами"],
  construction: ["Проектирование", "BIM/CAD", "Сметы и нормы", "Коммуникация на объекте"],
  industry: ["Технологические процессы", "Контроль качества", "Промышленная безопасность", "Работа с сырьём"],
  business: ["Финансовая грамотность", "Excel/BI", "Переговоры", "Управление процессами"],
  environment: ["Оценка рисков", "Экологический контроль", "Охрана труда", "Работа с регламентами"],
};

const careerProfiles: Record<string, CareerProfile> = {
  "software-engineering": {
    opportunities: ["Frontend Developer", "Backend Developer", "Mobile Developer", "Fullstack Developer", "QA Engineer", "Data Analyst"],
    skills: ["JavaScript/TypeScript", "React и React Native", "Node.js и API", "Базы данных", "Git и командная разработка", "Тестирование"],
    employers: ["Kaspi.kz", "Halyk Bank", "Freedom Holding", "Kolesa Group", "EPAM Kazakhstan", "Documentolog"],
    demand: "high",
    prospects: "Спрос растёт за счёт цифровизации банков, госуслуг, промышленности и образования.",
    growth: "Высокий рост: сильные выпускники могут быстро перейти от junior к middle за 1–2 года.",
  },
  "artificial-intelligence": {
    opportunities: ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "AI Researcher", "Computer Vision Engineer", "NLP Engineer"],
    skills: ["Python", "Machine Learning", "Deep Learning", "Computer Vision", "Data pipelines", "MLOps"],
    employers: ["NITEC", "Kaspi.kz", "Halyk Bank", "BTS Digital", "Astana Hub startups", "Research labs"],
    demand: "high",
    prospects: "AI-направления быстро входят в банки, медицину, промышленность, образование и сервисы поддержки клиентов.",
    growth: "Очень высокий рост: рынок только формируется, поэтому сильные специалисты особенно ценятся.",
  },
  "information-systems": {
    opportunities: ["Business Analyst", "System Analyst", "Database Specialist", "IT Consultant", "ERP Specialist", "Product Analyst"],
    skills: ["SQL", "Бизнес-анализ", "Проектирование систем", "Интеграция сервисов", "Документация", "BI-инструменты"],
    employers: ["1C integrators", "Halyk Bank", "Kcell", "Kazakhtelecom", "ERP-команды предприятий", "Госцифровизация"],
    demand: "high",
    prospects: "Компании постоянно внедряют CRM, ERP, BI и внутренние цифровые сервисы.",
    growth: "Стабильный рост: хороший путь в аналитику, консалтинг и управление IT-продуктами.",
  },
  cybersecurity: {
    opportunities: ["Cybersecurity Analyst", "SOC Engineer", "Pentester", "Information Security Specialist", "Network Security Engineer", "GRC Specialist"],
    skills: ["Сетевые протоколы", "Linux", "SIEM", "Анализ инцидентов", "Криптография", "Безопасная разработка"],
    employers: ["Банки", "Телеком-операторы", "Госорганы", "SOC-центры", "KZ-CERT partners", "Крупные промышленные компании"],
    demand: "high",
    prospects: "Рост киберугроз делает безопасность обязательной частью любой цифровой компании.",
    growth: "Высокий рост: особенно востребованы SOC, pentest и специалисты по защите инфраструктуры.",
  },
  "data-science": {
    opportunities: ["Data Scientist", "BI Analyst", "Data Engineer", "Product Analyst", "Marketing Analyst", "Risk Analyst"],
    skills: ["Python", "SQL", "Статистика", "Power BI/Tableau", "ETL", "Модели прогнозирования"],
    employers: ["Kaspi.kz", "Freedom Bank", "Retail-компании", "Телеком", "Маркетплейсы", "Логистические компании"],
    demand: "high",
    prospects: "Бизнесу нужны специалисты, которые превращают данные в решения по продажам, рискам и продуктам.",
    growth: "Высокий рост: аналитика становится стандартом почти во всех отраслях.",
  },
  "automation-control": {
    opportunities: ["Automation Engineer", "SCADA Engineer", "Control Systems Engineer", "PLC Programmer", "Instrumentation Specialist", "Process Automation Engineer"],
    skills: ["PLC", "SCADA", "Датчики и контроллеры", "Промышленные сети", "Электроприводы", "Техническая диагностика"],
    employers: ["Kazzinc", "Kaz Minerals", "ERG", "КазМунайГаз", "Энергетические предприятия", "Инжиниринговые компании"],
    demand: "high",
    prospects: "Промышленность Восточного Казахстана активно автоматизирует производство и контроль процессов.",
    growth: "Высокий рост: автоматизация снижает издержки, поэтому инженеры нужны заводам и сервисным компаниям.",
  },
  "mechanical-engineering": {
    opportunities: ["Mechanical Engineer", "Design Engineer", "Production Engineer", "Maintenance Engineer", "CAD Engineer", "Process Engineer"],
    skills: ["CAD/CAE", "Материаловедение", "Технологии производства", "Расчёты механизмов", "Контроль качества", "Lean production"],
    employers: ["Машиностроительные заводы", "Kazzinc", "ERG", "Казцинкмаш", "Сервисные компании", "Инженерные бюро"],
    demand: "medium",
    prospects: "Инженеры нужны в производстве, ремонте, проектировании и модернизации оборудования.",
    growth: "Умеренно высокий рост: особенно ценятся специалисты, которые владеют CAD и понимают производство.",
  },
  robotics: {
    opportunities: ["Robotics Engineer", "Automation Specialist", "R&D Engineer", "Robot Programmer", "Service Engineer", "Embedded Developer"],
    skills: ["Мехатроника", "Микроконтроллеры", "ROS", "Сенсоры", "Python/C++", "Промышленные манипуляторы"],
    employers: ["Инжиниринговые компании", "Производственные заводы", "R&D-центры", "Astana Hub startups", "Автоматизация складов", "Сервисные интеграторы"],
    demand: "high",
    prospects: "Роботизация растёт в промышленности, логистике, медицине и сервисе.",
    growth: "Высокий рост: направление перспективное, но требует сильной практической базы.",
  },
  mechatronics: {
    opportunities: ["Mechatronics Engineer", "Embedded Technician", "Service Engineer", "Automation Engineer", "Maintenance Specialist", "Industrial Systems Engineer"],
    skills: ["Механика", "Электроника", "Embedded-системы", "Электроприводы", "Диагностика оборудования", "CAD"],
    employers: ["Kazzinc", "ERG", "КазМунайГаз сервис", "Инжиниринговые компании", "Производственные предприятия", "Сервисные центры"],
    demand: "medium",
    prospects: "Мехатроника востребована там, где техника объединяет механику, электронику и программное управление.",
    growth: "Стабильный рост: сильные специалисты быстро становятся инженерами по автоматизации или сервису.",
  },
  instrumentation: {
    opportunities: ["Instrumentation Engineer", "Metrology Specialist", "QA Engineer", "Control Equipment Engineer", "Calibration Specialist", "Lab Engineer"],
    skills: ["Метрология", "Измерительные приборы", "Схемотехника", "Калибровка", "Контроль качества", "Технические стандарты"],
    employers: ["Промышленные лаборатории", "Энергетические предприятия", "Kazzinc", "КазСтандарт", "Производственные заводы", "Сервисные компании"],
    demand: "medium",
    prospects: "Предприятиям нужны точные измерения, контроль качества и надежная работа приборов.",
    growth: "Стабильный рост: спрос особенно заметен в промышленности, энергетике и лабораториях.",
  },
  "electric-power": {
    opportunities: ["Power Engineer", "Substation Engineer", "Grid Specialist", "Electrical Design Engineer", "Relay Protection Engineer", "Energy Dispatcher"],
    skills: ["Электрические сети", "Подстанции", "Релейная защита", "Электробезопасность", "Энергетические расчёты", "Проектная документация"],
    employers: ["KEGOC", "Казахстанские энергосети", "УК ТЭЦ", "Энергосервисные компании", "Промышленные предприятия", "Проектные институты"],
    demand: "high",
    prospects: "Энергетика остаётся базовой отраслью, а модернизация сетей повышает спрос на инженеров.",
    growth: "Высокий рост: нужны специалисты по сетям, защите, энергоэффективности и новым мощностям.",
  },
  "thermal-power": {
    opportunities: ["Thermal Engineer", "Plant Operator", "Energy Auditor", "Boiler Engineer", "Turbine Specialist", "Heat Supply Engineer"],
    skills: ["Теплотехника", "Котлы и турбины", "Энергоаудит", "Тепловые сети", "Техника безопасности", "Эксплуатация станций"],
    employers: ["ТЭЦ", "Теплосети", "Промышленные предприятия", "Энергосервис", "Проектные организации", "Коммунальные службы"],
    demand: "medium",
    prospects: "Городам и предприятиям нужны специалисты по надежному теплоснабжению и энергоэффективности.",
    growth: "Стабильный рост: особенно востребованы инженеры, умеющие снижать потери энергии.",
  },
  "renewable-energy": {
    opportunities: ["Renewable Energy Engineer", "Solar Engineer", "Wind Project Specialist", "Energy Project Manager", "Energy Storage Specialist", "Sustainability Analyst"],
    skills: ["Солнечные станции", "Ветровая энергетика", "Накопители энергии", "Энергоаудит", "Проектные расчёты", "ESG"],
    employers: ["Qazaq Green companies", "Энергосервис", "Проектные организации", "Solar project developers", "Промышленные предприятия", "Международные проекты"],
    demand: "high",
    prospects: "Переход к чистой энергетике создаёт новые проекты в Казахстане и Центральной Азии.",
    growth: "Высокий рост: рынок молодой, но перспективный для инженеров с практическими навыками.",
  },
  construction: {
    opportunities: ["Civil Engineer", "Site Engineer", "Project Coordinator", "Construction Supervisor", "Estimator", "BIM Specialist"],
    skills: ["Строительные конструкции", "Сметы", "BIM/CAD", "Управление проектами", "Нормативы", "Контроль качества"],
    employers: ["BI Group", "Bazis-A", "Строительные компании ВКО", "Девелоперы", "Проектные организации", "Технадзор"],
    demand: "medium",
    prospects: "Строительство развивается вместе с инфраструктурой, жильём и промышленными объектами.",
    growth: "Стабильный рост: больше ценятся инженеры с BIM, сметами и управлением объектом.",
  },
  architecture: {
    opportunities: ["Architect", "BIM Designer", "Urban Planner", "Interior Architect", "Visualization Specialist", "Project Architect"],
    skills: ["Архитектурная графика", "BIM", "Revit/Archicad", "Композиция", "Градостроительство", "3D-визуализация"],
    employers: ["Архитектурные бюро", "Девелоперы", "Проектные институты", "Дизайн-студии", "Городские управления", "Фриланс-проекты"],
    demand: "medium",
    prospects: "Спрос держится на проектах жилья, общественных пространств и городской среды.",
    growth: "Стабильный рост: портфолио и владение BIM сильно повышают шансы на хорошую работу.",
  },
  geodesy: {
    opportunities: ["Surveyor", "GIS Specialist", "Cartographer", "Geospatial Analyst", "Land Cadastre Specialist", "Drone Mapping Specialist"],
    skills: ["GNSS/GPS", "ГИС", "Картография", "Дроны", "Топосъёмка", "Пространственные данные"],
    employers: ["Кадастровые службы", "Строительные компании", "Дорожные проекты", "Горнодобывающие предприятия", "ГИС-компании", "Госорганы"],
    demand: "medium",
    prospects: "Геодезисты нужны строительству, дорогам, горной отрасли и цифровым картографическим сервисам.",
    growth: "Стабильный рост: дроны и GIS делают профессию технологичнее.",
  },
  "transport-construction": {
    opportunities: ["Road Engineer", "Bridge Engineer", "Infrastructure Specialist", "Transport Planner", "Site Engineer", "Project Engineer"],
    skills: ["Дорожные материалы", "Мосты и тоннели", "Геология", "Сметы", "Проектирование дорог", "Технадзор"],
    employers: ["КазАвтоЖол", "Дорожные компании", "Проектные институты", "Строительные подрядчики", "Акиматы", "Инфраструктурные проекты"],
    demand: "medium",
    prospects: "Инфраструктура дорог, мостов и логистических коридоров требует постоянного обновления.",
    growth: "Стабильный рост: специалисты нужны на крупных региональных и государственных проектах.",
  },
  metallurgy: {
    opportunities: ["Metallurgical Engineer", "Process Engineer", "Quality Specialist", "Smelting Engineer", "Materials Engineer", "Production Supervisor"],
    skills: ["Плавка и литьё", "Обогащение сырья", "Материаловедение", "Контроль качества", "Промышленная безопасность", "Технологические карты"],
    employers: ["Kazzinc", "Kaz Minerals", "ERG", "Ульбинский металлургический завод", "Казцинк", "Лаборатории качества"],
    demand: "high",
    prospects: "Металлургия — ключевая отрасль Восточного Казахстана, поэтому профильные инженеры востребованы.",
    growth: "Высокий рост: опытные технологи и инженеры качества получают сильные карьерные возможности.",
  },
  mining: {
    opportunities: ["Mining Engineer", "Mine Planner", "Safety Engineer", "Geotechnical Engineer", "Drilling and Blasting Engineer", "Production Engineer"],
    skills: ["Открытая и подземная добыча", "Планирование карьеров", "Горная безопасность", "Геотехника", "Взрывные работы", "Производственный контроль"],
    employers: ["Kazzinc", "Kaz Minerals", "ERG", "Горнодобывающие предприятия ВКО", "Сервисные подрядчики", "Проектные организации"],
    demand: "high",
    prospects: "Горная отрасль остаётся одной из сильнейших в регионе и требует инженеров на производство.",
    growth: "Высокий рост: карьерный путь часто ведёт к мастеру участка, инженеру и руководителю смены.",
  },
  "oil-gas": {
    opportunities: ["Petroleum Engineer", "Drilling Engineer", "Pipeline Specialist", "Production Engineer", "Reservoir Technician", "HSE Specialist"],
    skills: ["Бурение", "Разработка месторождений", "Трубопроводы", "Промышленная безопасность", "Геология нефти и газа", "Производственные расчёты"],
    employers: ["КазМунайГаз", "Tengizchevroil contractors", "NCOC contractors", "Сервисные компании", "Трубопроводные операторы", "HSE-службы"],
    demand: "medium",
    prospects: "Нефтегазовая отрасль сохраняет спрос на инженеров, особенно в сервисе, безопасности и эксплуатации.",
    growth: "Стабильный рост: высокий доход возможен при готовности к вахтам и производственной практике.",
  },
  economics: {
    opportunities: ["Economist", "Financial Analyst", "Planning Specialist", "Budget Analyst", "Risk Analyst", "Investment Analyst"],
    skills: ["Финансовый анализ", "Excel/Power BI", "Бюджетирование", "Экономическое моделирование", "Отчётность", "Оценка проектов"],
    employers: ["Банки", "Промышленные предприятия", "Аудиторские компании", "Финансовые отделы", "Госорганизации", "Консалтинг"],
    demand: "medium",
    prospects: "Экономисты нужны компаниям для планирования, анализа эффективности и финансового контроля.",
    growth: "Стабильный рост: сильные аналитические навыки открывают путь в финансы и управленческий анализ.",
  },
  management: {
    opportunities: ["Project Manager", "Operations Manager", "Business Analyst", "HR Manager", "Product Coordinator", "Sales Manager"],
    skills: ["Управление проектами", "Маркетинг", "Переговоры", "Финансы для менеджеров", "Командная работа", "Процессный подход"],
    employers: ["Банки", "Ритейл", "Промышленные предприятия", "Логистика", "Стартапы", "Консалтинговые компании"],
    demand: "medium",
    prospects: "Менеджеры востребованы там, где нужно организовать людей, процессы, продажи и проекты.",
    growth: "Стабильный рост: быстрее растут выпускники с английским, аналитикой и практикой проектов.",
  },
  logistics: {
    opportunities: ["Logistics Manager", "Supply Chain Analyst", "Transport Coordinator", "Warehouse Manager", "Procurement Specialist", "Customs Specialist"],
    skills: ["Supply chain", "Складская логистика", "Транспортное планирование", "Закупки", "Excel/BI", "Международная логистика"],
    employers: ["Транспортные компании", "Маркетплейсы", "Ритейл", "Производственные предприятия", "Складские операторы", "Таможенные брокеры"],
    demand: "high",
    prospects: "Логистика растёт вместе с e-commerce, транзитом, складами и международной торговлей.",
    growth: "Высокий рост: хорошие специалисты быстро переходят в управление цепями поставок.",
  },
  ecology: {
    opportunities: ["Environmental Engineer", "Ecologist", "ESG Specialist", "Environmental Auditor", "Waste Management Specialist", "Lab Specialist"],
    skills: ["Экологический мониторинг", "Очистные технологии", "Экологическое право", "ESG", "Оценка воздействия", "Лабораторный контроль"],
    employers: ["Промышленные предприятия", "Экологические лаборатории", "Проектные организации", "Акиматы", "ESG-команды", "Kazzinc/ERG suppliers"],
    demand: "medium",
    prospects: "Экологические требования усиливаются, поэтому компаниям нужны специалисты по контролю и снижению воздействия.",
    growth: "Стабильный рост: ESG и промышленная экология становятся заметнее в крупных компаниях.",
  },
  "life-safety": {
    opportunities: ["HSE Engineer", "Safety Specialist", "Risk Manager", "Fire Safety Specialist", "Industrial Safety Inspector", "Emergency Planning Specialist"],
    skills: ["Оценка рисков", "Охрана труда", "Пожарная безопасность", "Промышленная безопасность", "Инструктажи", "Расследование инцидентов"],
    employers: ["Промышленные предприятия", "Строительные компании", "Горнодобывающая отрасль", "Нефтегазовый сервис", "HSE-консалтинг", "Госинспекции"],
    demand: "high",
    prospects: "Безопасность обязательна для производства, стройки, энергетики и горной отрасли.",
    growth: "Высокий рост: опытные HSE-специалисты востребованы на крупных объектах и проектах.",
  },
};

function buildLongDescription(specialty: Specialty, category: string) {
  return `${specialty.description} Это направление подходит тем, кто хочет получить прикладную профессию, работать с реальными задачами и видеть результат своей работы. В ВКТУ такая подготовка может быть полезна благодаря техническому профилю университета, близости к промышленности Восточного Казахстана и возможности рано собрать портфолио через проекты, практику и стажировки. Выпускник по направлению «${specialty.title}» может развиваться как в классической казахстанской компании, так и в более современной проектной среде: от junior-специалиста до инженера, аналитика, руководителя направления или предпринимателя. Категория направления: ${category}.`;
}

export function SpecialtyDetailsScreen() {
  const { t } = useI18n();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "SpecialtyDetails">>();
  const admission = useAdmission();
  const specialty = specialties.find((item) => item.id === route.params.id);

  if (!specialty) {
    return null;
  }

  const categoryValue = categoryLabels[specialty.category];
  const category = categoryValue === "IT" ? "IT" : t(categoryValue);
  const career = careerProfiles[specialty.id] ?? {
    opportunities: specialty.careers,
    skills: skillsByCategory[specialty.category],
    employers: workplacesByCategory[specialty.category],
    demand: "medium" as const,
    prospects: "Направление даёт прикладную профессию и понятный карьерный путь после выпуска.",
    growth: "Спрос зависит от портфолио, практики и готовности развивать профессиональные навыки.",
  };
  const salary = salaryByCategory[specialty.category];
  const selected = admission.selectedSpecialty === specialty.title;
  const demandMeta = demandBadgeMeta[career.demand];

  const chooseSpecialty = () => {
    admissionStore.setSelectedSpecialty(specialty.title);
    Alert.alert(t("specialtySavedTitle"), t("specialtySavedText"));
  };

  return (
    <Screen>
      <Stack>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("specialtyDetails")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Image source={specialty.image} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <Text style={styles.title}>{specialty.title}</Text>
            <View style={styles.metaRow}>
              <Pill icon="albums" text={category} />
              <Pill icon="trophy" text={`${specialty.grants} ${t("grantsCount")}`} />
              <Pill icon="time" text={`${specialty.years} ${t("years")}`} />
            </View>
          </View>
        </View>

        <Section title={t("professionAbout")}>
          <View style={styles.textCard}>
            <Text style={styles.longText}>{buildLongDescription(specialty, category)}</Text>
          </View>
        </Section>

        <Section title={t("whatLearn")}>
          <View style={styles.listCard}>
            {specialty.learn.map((item, index) => (
              <View key={item} style={[styles.listRow, index !== specialty.learn.length - 1 && styles.divider]}>
                <Ionicons name="checkmark-circle" size={19} color={colors.primary} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("careerAfterGraduation")}>
          <View style={styles.careerShell}>
            <View style={styles.careerHeader}>
              <View style={styles.careerHeaderIcon}>
                <Ionicons name="trending-up" size={22} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.careerHeaderTitle}>{t("careerAfterGraduation")}</Text>
                <Text style={styles.careerHeaderText}>
                  {t("careerAfterGraduationSub")}
                </Text>
              </View>
            </View>

            <CareerBlock title={t("careerOpportunities")} icon="briefcase">
              <View style={styles.badgeGrid}>
                {career.opportunities.map((item) => (
                  <View key={item} style={styles.careerBadge}>
                    <Ionicons name="briefcase-outline" size={14} color={colors.primary} />
                    <Text style={styles.careerBadgeText}>{item}</Text>
                  </View>
                ))}
              </View>
            </CareerBlock>

            <CareerBlock title={t("salaryEstimate")} icon="cash">
              <View style={styles.salaryCard}>
                <SalaryRow label={t("juniorLevel")} value={salary.junior} />
                <SalaryRow label={t("middleLevel")} value={salary.middle} />
                <SalaryRow label={t("seniorLevel")} value={salary.senior} />
                <Text style={styles.salaryNote}>{t("salaryDisclaimer")}</Text>
              </View>
            </CareerBlock>

            <CareerBlock title={t("skillsTitle")} icon="construct">
              <View style={styles.skillGrid}>
                {career.skills.map((item) => (
                  <View key={item} style={styles.skillPill}>
                    <Text style={styles.skillText}>{item}</Text>
                  </View>
                ))}
              </View>
            </CareerBlock>

            <CareerBlock title={t("employersTitle")} icon="business">
              <View style={styles.employerGrid}>
                {career.employers.map((item) => (
                  <View key={item} style={styles.employerPill}>
                    <Ionicons name="business-outline" size={14} color={colors.primary} />
                    <Text style={styles.employerText}>{item}</Text>
                  </View>
                ))}
              </View>
            </CareerBlock>

            <CareerBlock title={t("demandTitle")} icon="analytics">
              <View style={styles.demandCard}>
                <View style={styles.demandTop}>
                  <Text style={styles.demandLabel}>{t("demandLevel")}</Text>
                  <View style={[styles.demandBadge, { backgroundColor: demandMeta.background }]}>
                    <Text style={[styles.demandBadgeText, { color: demandMeta.color }]}>
                      {t(demandMeta.label)}
                    </Text>
                  </View>
                </View>
                <InfoLine icon="sparkles" label={t("futureProspects")} text={career.prospects} />
                <InfoLine icon="stats-chart" label={t("marketGrowth")} text={career.growth} />
              </View>
            </CareerBlock>
          </View>
        </Section>

        <TouchableOpacity
          style={[styles.applyButton, selected && styles.applyButtonSelected]}
          activeOpacity={0.84}
          onPress={chooseSpecialty}
        >
          <Text style={styles.applyText}>{t("selectSpecialtyButton")}</Text>
          <Ionicons
            name={selected ? "checkmark-circle" : "arrow-forward"}
            size={18}
            color={colors.white}
          />
        </TouchableOpacity>
      </Stack>
    </Screen>
  );
}

const demandBadgeMeta = {
  high: { label: "demandHigh", color: colors.success, background: "#e9f8f0" },
  medium: { label: "demandMedium", color: colors.primary, background: colors.accent },
  low: { label: "demandLow", color: colors.warning, background: "#fff5d8" },
} as const;

function CareerBlock({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: "analytics" | "briefcase" | "business" | "cash" | "construct";
  title: string;
}) {
  return (
    <View style={styles.careerBlock}>
      <View style={styles.careerBlockHead}>
        <View style={styles.careerBlockIcon}>
          <Ionicons name={icon} size={17} color={colors.primary} />
        </View>
        <Text style={styles.careerBlockTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function InfoLine({
  icon,
  label,
  text,
}: {
  icon: "sparkles" | "stats-chart";
  label: string;
  text: string;
}) {
  return (
    <View style={styles.infoLine}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={15} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

function SalaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.salaryRow}>
      <Text style={styles.salaryLabel}>{label}</Text>
      <Text style={styles.salaryValue}>{value}</Text>
    </View>
  );
}

function Pill({ icon, text }: { icon: "albums" | "trophy" | "time"; text: string }) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={13} color={colors.primary} />
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
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
    fontSize: 17,
    textAlign: "center",
  },
  headerSpacer: {
    width: 38,
  },
  flex: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 20,
    overflow: "hidden",
    ...shadows.card,
  },
  heroImage: {
    backgroundColor: colors.secondary,
    height: 190,
    width: "100%",
  },
  heroBody: {
    padding: 16,
  },
  title: {
    color: colors.foreground,
    fontFamily: typography.family.bold,
    fontSize: 22,
    lineHeight: 27,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 13,
  },
  textCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 15,
    ...shadows.soft,
  },
  longText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  pill: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  pillText: {
    color: colors.primary,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  listCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.soft,
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
    padding: 14,
  },
  divider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  listText: {
    color: colors.foreground,
    flex: 1,
    fontFamily: typography.family.medium,
    fontSize: 14,
    lineHeight: 19,
  },
  careerShell: {
    backgroundColor: "#fbfaff",
    borderColor: "#e4ddff",
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 14,
    ...shadows.card,
  },
  careerHeader: {
    alignItems: "center",
    backgroundColor: "#f2efff",
    borderColor: "#dfd7ff",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 13,
  },
  careerHeaderIcon: {
    alignItems: "center",
    backgroundColor: "#e8e1ff",
    borderRadius: 15,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  careerHeaderTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 16,
  },
  careerHeaderText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  careerBlock: {
    gap: 10,
  },
  careerBlockHead: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  careerBlockIcon: {
    alignItems: "center",
    backgroundColor: "#ebe6ff",
    borderRadius: 11,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  careerBlockTitle: {
    color: colors.foreground,
    fontFamily: typography.family.semiBold,
    fontSize: 15,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  careerBadge: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e4ddff",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  careerBadgeText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    ...shadows.soft,
  },
  skillText: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  employerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  employerPill: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...shadows.soft,
  },
  employerText: {
    color: colors.foreground,
    fontFamily: typography.family.regular,
    fontSize: 12,
  },
  workplaceRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  workplaceText: {
    color: colors.foreground,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
  salaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    gap: 10,
    padding: 16,
    ...shadows.card,
  },
  salaryRow: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  salaryLabel: {
    color: "rgba(255,255,255,0.78)",
    flex: 1,
    fontFamily: typography.family.regular,
    fontSize: 12,
  },
  salaryValue: {
    color: colors.white,
    fontFamily: typography.family.semiBold,
    fontSize: 14,
  },
  salaryNote: {
    color: "rgba(255,255,255,0.76)",
    fontFamily: typography.family.regular,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  demandCard: {
    backgroundColor: "#f7fbff",
    borderColor: "#d8e8ff",
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 13,
  },
  demandTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  demandLabel: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 13,
  },
  demandBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  demandBadgeText: {
    fontFamily: typography.family.semiBold,
    fontSize: 11,
  },
  infoLine: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  infoIcon: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "#d8e8ff",
    borderRadius: 12,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  infoLabel: {
    color: colors.foreground,
    fontFamily: typography.family.medium,
    fontSize: 12,
  },
  infoText: {
    color: colors.muted,
    fontFamily: typography.family.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  applyButton: {
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
  applyButtonSelected: {
    backgroundColor: colors.success,
  },
  applyText: {
    color: colors.white,
    fontFamily: typography.family.medium,
    fontSize: 15,
  },
});

