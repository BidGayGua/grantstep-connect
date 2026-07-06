import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, StyleSheet, Platform } from "react-native";

import { HomeScreen } from "../screens/HomeScreen";
import { AdmissionScreen } from "../screens/AdmissionScreen";
import { DocumentsScreen } from "../screens/DocumentsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SpecialtiesScreen } from "../screens/SpecialtiesScreen";
import { colors, typography } from "../theme";
import { useI18n } from "../i18n";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, React.ComponentProps<typeof Ionicons>["name"]> = {
  Home: "home-outline",
  Specialties: "school-outline",
  Admission: "map-outline",
  Hub: "grid-outline",
  Settings: "settings-outline",
};

export function TabsNavigator() {
  const { t } = useI18n();

  const tabLabels: Record<keyof RootTabParamList, string> = {
    Home: t("navHome"),
    Specialties: t("navSpecialties"),
    Admission: t("navAdmission"),
    Hub: t("hub"),
    Settings: t("settings"),
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          position: "relative",
          borderBottomWidth: 0,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 4,
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? tabIcons[route.name].replace("-outline", "") : tabIcons[route.name]}
            size={23}
            color={color}
          />
        ),
        tabBarLabel: tabLabels[route.name],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Specialties" component={SpecialtiesScreen} />
      <Tab.Screen name="Admission" component={AdmissionScreen} />
      <Tab.Screen name="Hub" component={DocumentsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  tabLabel: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: typography.family.semiBold,
    letterSpacing: -0.1,
    marginTop: -2,
  },
});
