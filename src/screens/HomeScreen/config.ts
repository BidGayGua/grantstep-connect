import type { TranslationKey } from "../../i18n";
import type { RootStackParamList, RootTabParamList } from "../../navigation/types";

export type SectionKey = "about" | "specialties" | "grants" | "documents" | "dorm" | "faq";

export const sectionConfig: Array<{
  key: SectionKey;
  icon: string;
  labelKey: TranslationKey;
  navigate: (
    navigateToTab: (screen: keyof RootTabParamList) => void,
    navigateToInfo: (kind: string) => void,
  ) => void;
}> = [
  {
    key: "about",
    icon: "business-outline",
    labelKey: "about",
    navigate: (_, navigateToInfo) => navigateToInfo("about"),
  },
  {
    key: "specialties",
    icon: "school-outline",
    labelKey: "navSpecialties",
    navigate: (navigateToTab) => navigateToTab("Specialties"),
  },
  {
    key: "grants",
    icon: "trophy-outline",
    labelKey: "grants",
    navigate: (navigateToTab) => navigateToTab("Admission"),
  },
  {
    key: "documents",
    icon: "document-text-outline",
    labelKey: "hub",
    navigate: (navigateToTab) => navigateToTab("Hub"),
  },
  {
    key: "dorm",
    icon: "bed-outline",
    labelKey: "dorm",
    navigate: (_, navigateToInfo) => navigateToInfo("dorm"),
  },
  {
    key: "faq",
    icon: "help-circle-outline",
    labelKey: "faq",
    navigate: (_, navigateToInfo) => navigateToInfo("faq"),
  },
];

export const advantageKeys = [
  "advantageScore",
  "advantageGrant",
  "advantageLabs",
  "advantageInternational",
  "advantageJobs",
] as const;

export const parentItems = [
  { title: "parentDorm" as TranslationKey, sub: "parentDormSub" as TranslationKey, icon: "bed-outline" },
  { title: "parentJobs" as TranslationKey, sub: "parentJobsSub" as TranslationKey, icon: "briefcase-outline" },
  { title: "parentDiploma" as TranslationKey, sub: "parentDiplomaSub" as TranslationKey, icon: "reader-outline" },
  { title: "parentSafety" as TranslationKey, sub: "parentSafetySub" as TranslationKey, icon: "shield-checkmark-outline" },
  { title: "parentInternational" as TranslationKey, sub: "parentInternationalSub" as TranslationKey, icon: "globe-outline" },
] as const;

export const expenseCards = [
  {
    icon: "calculator-outline" as const,
    tone: "cyan" as const,
    titleKey: "expenseCalculator" as TranslationKey,
    subKey: "expenseCalculatorSub" as TranslationKey,
    screen: "ExpenseCalculator" as const,
  },
  {
    icon: "school-outline" as const,
    tone: "purple" as const,
    titleKey: "specialtyPickerTitle" as TranslationKey,
    subKey: "specialtyPickerSub" as TranslationKey,
    screen: "SpecialtyPicker" as const,
  },
  {
    icon: "cash-outline" as const,
    tone: "green" as const,
    titleKey: "scholarshipsTitle" as TranslationKey,
    subKey: "scholarshipsSub" as TranslationKey,
    screen: "Scholarships" as const,
  },
  {
    icon: "shield-checkmark-outline" as const,
    tone: "blue" as const,
    titleKey: "militaryTitle" as TranslationKey,
    subKey: "militarySub" as TranslationKey,
    screen: "MilitaryDepartment" as const,
  },
] as const;
