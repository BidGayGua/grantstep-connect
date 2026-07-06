import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { RootStackParamList } from "../navigation/types";
import { faculties, specialties, type Specialty } from "../data/specialties";
import { Screen } from "../components/Screen";
import { colors, shadows, typography } from "../theme";
import { useI18n } from "../i18n";

export function SpecialtiesScreen() {
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("all");

  const filteredData = useMemo(() => {
    return specialties.filter((item) => {
      const matchesFaculty = selectedFacultyId === "all" || item.facultyId === selectedFacultyId;
      const translatedTitle = t(item.titleKey).toLowerCase();
      const matchesSearch =
        translatedTitle.includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase());
      return matchesFaculty && matchesSearch;
    });
  }, [selectedFacultyId, query, t]);

  const renderSpecialty = ({ item }: { item: Specialty }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("SpecialtyDetails", { id: item.id })}
    >
      <Image
        source={typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.codeText}>{item.code}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{t(item.titleKey)}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.learnMore}>{t("more")}</Text>
          <Ionicons name="arrow-forward" size={12} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("navSpecialties")}</Text>
        <Text style={styles.headerSubtitle}>{t("specialtiesSub")}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={colors.muted}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterWrapper}>
        <Text style={styles.filterTitle}>{t("facultiesTitle")}</Text>
        <View style={styles.filterGrid}>
          {faculties.map((faculty) => {
            const isActive = selectedFacultyId === faculty.id;
            return (
              <TouchableOpacity
                key={faculty.id}
                onPress={() => setSelectedFacultyId(faculty.id)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {t(faculty.shortTitleKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderSpecialty}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>{t("noResults")}</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.foreground,
  },
  filterWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 12,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: "48%",
    overflow: "hidden",
    ...shadows.soft,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#E2E8F0",
  },
  cardContent: {
    padding: 12,
  },
  codeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  learnMore: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    width: "100%",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.muted,
    fontWeight: "500",
  },
});

