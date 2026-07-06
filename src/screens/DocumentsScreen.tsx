import Ionicons from "react-native-vector-icons/Ionicons";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from "react-native";

import { Screen, Stack } from "../components/Screen";
import { Section } from "../components/Section";
import { colors, shadows, typography } from "../theme";
import { useI18n } from "../i18n";
import {
  useAdmission,
} from "../lib/admission-store";

type FacultyId = "it" | "mechanical" | "architecture" | "business" | "earth";
type FeedFilter = "all" | "urgent" | "study" | "events" | "opportunities";

type Faculty = {
  id: FacultyId;
  shortName: string;
  name: string;
  icon: string;
  room: string;
  nextClass: string;
  deadline: string;
};

const faculties: Faculty[] = [
  { id: "it", shortName: "facultyITShort", name: "Информационные технологии", icon: "laptop-outline", room: "Г-1, 301-318", nextClass: "10:30", deadline: "пятница, 18:00" },
  { id: "mechanical", shortName: "facultyMechShort", name: "Машиностроение", icon: "construct-outline", room: "Б, 112-126", nextClass: "11:20", deadline: "четверг, 17:00" },
  { id: "architecture", shortName: "facultyArchShort", name: "Архитектура и строительство", icon: "business-outline", room: "А, проектные студии", nextClass: "09:40", deadline: "пятница, 16:00" },
  { id: "business", shortName: "facultyBusinessShort", name: "Бизнес и право", icon: "briefcase-outline", room: "В, 204-216", nextClass: "12:10", deadline: "среда, 18:00" },
  { id: "earth", shortName: "facultyEarthShort", name: "Земля и окружающая среда", icon: "leaf-outline", room: "Е, гео-блок", nextClass: "10:00", deadline: "пятница, 15:00" },
];

const filters: { id: FeedFilter; label: string; icon: string; color: string }[] = [
  { id: "all", label: "filterAll", icon: "apps-outline", color: colors.primary },
  { id: "urgent", label: "filterUrgent", icon: "flame-outline", color: colors.destructive },
  { id: "study", label: "filterStudy", icon: "school-outline", color: colors.purple },
  { id: "events", label: "filterEvents", icon: "calendar-outline", color: colors.orange },
  { id: "opportunities", label: "filterOpportunities", icon: "rocket-outline", color: colors.success },
];

export function DocumentsScreen() {
  const { t } = useI18n();
  const admission = useAdmission();
  const [activeFaculty, setActiveFaculty] = useState<FacultyId>("it");
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const faculty = useMemo(
    () => faculties.find((item) => item.id === activeFaculty) ?? faculties[0],
    [activeFaculty],
  );

  const filteredFeed = useMemo(() => {
    const items = [
      {
        id: "1",
        type: "study" as FeedFilter,
        title: t("feedScheduleTitle"),
        desc: t("feedScheduleDesc").replace("{room}", faculty.room).replace("{time}", faculty.nextClass),
        time: "10:30",
      },
      {
        id: "2",
        type: "urgent" as FeedFilter,
        title: t("feedMilitaryTitle"),
        desc: t("feedMilitaryDesc"),
        time: t("filterUrgent"),
      },
      {
        id: "3",
        type: "events" as FeedFilter,
        title: t("feedHackathonTitle"),
        desc: t("feedHackathonDesc"),
        time: "25 мая",
      },
      {
        id: "4",
        type: "opportunities" as FeedFilter,
        title: t("feedInternshipTitle"),
        desc: t("feedInternshipDesc"),
        time: "New",
      },
    ];

    if (activeFilter === "all") return items;
    return items.filter((item) => item.type === activeFilter);
  }, [activeFilter, faculty, t]);

  const handleOpenCampusMap = () => {
    Linking.openURL("https://www.ektu.kz/abouttheuniversity/virtualtours.aspx").catch(() => {
      Alert.alert("Error", "Could not open the map");
    });
  };

  return (
    <Screen>
      <Stack>
        {/* Personalized Greeting */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingTitle}>{t("documentsGreeting")}</Text>
            <Text style={styles.greetingSub}>{t("documentsGreetingSub")}</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
             <Ionicons name="settings-outline" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid - Only visible/active for enrolled students */}
        {admission.applicationStatus === "approved" && (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <ActionCard icon="book" label={t("documentsLms")} sub={t("documentsLmsSub")} color="#F0FDF4" iconColor="#15803D" />
              <ActionCard icon="map" label={t("documentsCampus")} sub={t("documentsCampusSub")} color="#FFF7ED" iconColor="#C2410C" onPress={handleOpenCampusMap} />
            </View>
          </View>
        )}

        {/* Support Grid for Guests */}
        {admission.applicationStatus !== "approved" && (
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <ActionCard icon="help-circle" label={t("documentsLms")} sub={t("documentsLmsSub")} color="#F0FDF4" iconColor="#15803D" />
              <ActionCard icon="map" label={t("documentsCampus")} sub={t("documentsCampusSub")} color="#FFF7ED" iconColor="#C2410C" onPress={handleOpenCampusMap} />
            </View>
          </View>
        )}

        {/* Faculty Selector (Compact & Sticky-like) */}
        <View style={styles.stickySection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.facultyScroll}>
            {faculties.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFaculty(f.id)}
                style={[styles.facultyPill, activeFaculty === f.id && styles.facultyPillActive]}
              >
                <Text style={[styles.facultyPillText, activeFaculty === f.id && styles.facultyPillTextActive]}>
                  {t(f.shortName as any)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feed Categorization Chips */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={[
                  styles.filterChip,
                  activeFilter === f.id && { backgroundColor: f.color, borderColor: f.color }
                ]}
              >
                <Ionicons name={f.icon} size={16} color={activeFilter === f.id ? "#fff" : f.color} />
                <Text style={[styles.filterChipText, activeFilter === f.id && { color: "#fff" }]}>
                  {t(f.label as any)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Feed */}
        <View style={styles.feedContainer}>
          {filteredFeed.map((item) => (
            <FeedCard
              key={item.id}
              type={item.type}
              title={item.title}
              desc={item.desc}
              time={item.time}
            />
          ))}
          {filteredFeed.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Ionicons name="search-outline" size={48} color={colors.muted} />
              <Text style={{ marginTop: 12, color: colors.muted, fontFamily: typography.family.medium }}>
                {t("feedEmpty")}
              </Text>
            </View>
          )}
        </View>


        <View style={{ height: 40 }} />
      </Stack>
    </Screen>
  );
}

function ActionCard({ icon, label, sub, color, iconColor, onPress }: { icon: any; label: string; sub: string; color: string; iconColor: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.white }]} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

function FeedCard({ type, title, desc, time }: { type: FeedFilter; title: string; desc: string; time: string }) {
  const { t } = useI18n();
  const getIcon = () => {
    switch(type) {
      case 'urgent': return { name: 'flame', color: colors.destructive };
      case 'study': return { name: 'school', color: colors.purple };
      case 'events': return { name: 'calendar', color: colors.orange };
      case 'opportunities': return { name: 'rocket', color: colors.success };
      default: return { name: 'information-circle', color: colors.primary };
    }
  };
  const icon = getIcon();

  return (
    <TouchableOpacity style={styles.feedCard} activeOpacity={0.8}>
      <View style={styles.feedCardHeader}>
        <View style={[styles.feedIconWrap, { backgroundColor: icon.color + '15' }]}>
          <Ionicons name={icon.name} size={18} color={icon.color} />
        </View>
        <Text style={styles.feedTime}>{time}</Text>
      </View>
      <Text style={styles.feedTitle}>{title}</Text>
      <Text style={styles.feedDesc} numberOfLines={2}>{desc}</Text>
      <View style={styles.feedFooter}>
        <TouchableOpacity style={styles.feedAction}>
          <Text style={[styles.feedActionText, { color: icon.color }]}>{t("feedMore")}</Text>
          <Ionicons name="chevron-forward" size={12} color={icon.color} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 15,
  },
  greetingTitle: {
    fontSize: 24,
    fontFamily: typography.family.bold,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  flex: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 14,
    color: colors.muted,
    fontFamily: typography.family.regular,
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: typography.family.semiBold,
    color: colors.foreground,
  },
  actionSub: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: typography.family.regular,
    marginTop: 1,
  },
  stickySection: {
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  facultyScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  facultyPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  facultyPillActive: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  facultyPillText: {
    fontSize: 13,
    fontFamily: typography.family.medium,
    color: colors.muted,
  },
  facultyPillTextActive: {
    color: '#fff',
  },
  filterSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: typography.family.medium,
    color: colors.foreground,
  },
  feedContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  feedCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  feedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedTime: {
    fontSize: 12,
    fontFamily: typography.family.medium,
    color: colors.muted,
  },
  feedTitle: {
    fontSize: 16,
    fontFamily: typography.family.bold,
    color: colors.foreground,
    marginBottom: 6,
  },
  feedDesc: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: typography.family.regular,
    lineHeight: 18,
  },
  feedFooter: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedActionText: {
    fontSize: 12,
    fontFamily: typography.family.bold,
  },
});
