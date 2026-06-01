import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { RootStackParamList } from "../../App";
import {
  categoryLabels,
  specialties,
  type Specialty,
  type SpecialtyCategory,
} from "../data/specialties";
import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { useI18n, type TranslationKey } from "../i18n";
import { colors, shadows } from "../theme";

type CategoryFilter = "all" | SpecialtyCategory;

const categories: CategoryFilter[] = [
  "all",
  "IT",
  "engineering",
  "energy",
  "construction",
  "industry",
  "business",
  "environment",
];

const filterLabels: Record<CategoryFilter, TranslationKey | "IT"> = {
  all: "all",
  ...categoryLabels,
};

const getLabel = (value: TranslationKey | "IT", t: (key: TranslationKey) => string) =>
  value === "IT" ? "IT" : t(value);

export function SpecialtiesScreen() {
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return specialties.filter((specialty) => {
      const categoryText = getLabel(categoryLabels[specialty.category], t);
      const matchesCategory = category === "all" || specialty.category === category;
      const matchesSearch =
        normalized.length === 0 ||
        specialty.title.toLowerCase().includes(normalized) ||
        categoryText.toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [category, query, t]);

  const openDetails = (specialty: Specialty) => {
    navigation.navigate("SpecialtyDetails", { id: specialty.id });
  };

  return (
    <Screen>
      <Stack>
        <ScreenHeader title={t("specialtiesTitle")} subtitle={t("specialtiesSub")} />

        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("searchSpecialty")}
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
            <Ionicons name="options" size={18} color={colors.muted} />
          </View>
        </View>

        <View style={styles.categoryScroller}>
          <View style={styles.categoryRow}>
            {categories.map((item) => {
              const active = item === category;
              const label = getLabel(filterLabels[item], t);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.82}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.countRow}>
          <Text style={styles.sectionTitle}>
            {category === "all"
              ? t("allDirections")
              : filterLabels[category] === "IT"
                ? "IT"
                : getLabel(filterLabels[category], t)}
          </Text>
          <Text style={styles.countText}>
            {filtered.length} {t("found")}
          </Text>
        </View>

        <View style={styles.list}>
          {filtered.map((specialty) => {
            const categoryLabel = getLabel(categoryLabels[specialty.category], t);
            return (
              <TouchableOpacity
                key={specialty.id}
                style={styles.card}
                onPress={() => openDetails(specialty)}
                activeOpacity={0.86}
              >
                <Image source={specialty.image} style={styles.cardImage} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {specialty.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Meta icon="trophy" value={`${specialty.grants} ${t("grantsCount")}`} />
                    <Meta icon="time" value={`${specialty.years} ${t("years")}`} />
                    <Meta icon="albums" value={categoryLabel} />
                  </View>
                  {specialty.tag ? (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{specialty.tag}</Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.82}
                    onPress={() => openDetails(specialty)}
                  >
                    <Text style={styles.moreText}>{t("more")}</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.cta}>
          <Ionicons name="sparkles" size={22} color="rgba(255,255,255,0.86)" />
          <Text style={styles.ctaTitle}>{t("chooseHelpTitle")}</Text>
          <Text style={styles.ctaText}>{t("chooseHelpText")}</Text>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.84}>
            <Text style={styles.ctaButtonText}>{t("chooseSpecialty")}</Text>
          </TouchableOpacity>
        </View>
      </Stack>
    </Screen>
  );
}

function Meta({
  icon,
  value,
}: {
  icon: "trophy" | "time" | "albums";
  value: string;
}) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={12} color={colors.primary} />
      <Text style={styles.metaText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 20,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    color: colors.foreground,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  categoryScroller: {
    paddingHorizontal: 20,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.white,
  },
  countRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "500",
  },
  countText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "500",
  },
  list: {
    gap: 12,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 10,
    ...shadows.soft,
  },
  cardImage: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    height: 108,
    width: 96,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: colors.foreground,
    fontSize: 15,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  meta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
  },
  metaText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "500",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "600",
  },
  moreButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    flexDirection: "row",
    gap: 4,
    marginTop: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  moreText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  cta: {
    backgroundColor: colors.primaryDeep,
    borderRadius: 22,
    marginHorizontal: 20,
    padding: 20,
    ...shadows.deep,
  },
  ctaTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 8,
  },
  ctaText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: 14,
    paddingVertical: 12,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "500",
  },
});

