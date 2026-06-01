import "react-native-gesture-handler";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, type NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Text, TextInput } from "react-native";

import { I18nProvider, useI18n } from "./src/i18n";
import { PremiumIcon } from "./src/components/PremiumIcon";
import { AdmissionScreen } from "./src/screens/AdmissionScreen";
import { DocumentsScreen } from "./src/screens/DocumentsScreen";
import { ExpenseCalculatorScreen } from "./src/screens/ExpenseCalculatorScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { InfoScreen, type InfoKind } from "./src/screens/InfoScreen";
import { ParentsScreen } from "./src/screens/ParentsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import {
  MilitaryDepartmentScreen,
  ScholarshipScreen,
} from "./src/screens/SimpleInfoListScreen";
import { SpecialtyDetailsScreen } from "./src/screens/SpecialtyDetailsScreen";
import { SpecialtyPickerScreen } from "./src/screens/SpecialtyPickerScreen";
import { SpecialtiesScreen } from "./src/screens/SpecialtiesScreen";
import { colors, shadows } from "./src/theme";

export type RootTabParamList = {
  Home: undefined;
  Specialties: undefined;
  Admission: undefined;
  Documents: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  Info: { kind: InfoKind };
  ExpenseCalculator: undefined;
  Parents: undefined;
  SpecialtyPicker: undefined;
  Scholarships: undefined;
  MilitaryDepartment: undefined;
  SpecialtyDetails: { id: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
let defaultFontsConfigured = false;

const tabIcons: Record<
  keyof RootTabParamList,
  ComponentProps<typeof Ionicons>["name"]
> = {
  Home: "home",
  Specialties: "school",
  Admission: "map",
  Documents: "document-text",
  Profile: "person",
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!defaultFontsConfigured) {
    defaultFontsConfigured = true;
    const textComponent = Text as typeof Text & { defaultProps?: { style?: object } };
    const inputComponent = TextInput as typeof TextInput & { defaultProps?: { style?: object } };
    textComponent.defaultProps = {
      ...(textComponent.defaultProps ?? {}),
      style: [{ fontFamily: "Manrope_400Regular" }, textComponent.defaultProps?.style],
    };
    inputComponent.defaultProps = {
      ...(inputComponent.defaultProps ?? {}),
      style: [{ fontFamily: "Manrope_400Regular" }, inputComponent.defaultProps?.style],
    };
  }

  return (
    <I18nProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabsNavigator} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="ExpenseCalculator" component={ExpenseCalculatorScreen} />
          <Stack.Screen name="Parents" component={ParentsScreen} />
          <Stack.Screen name="SpecialtyPicker" component={SpecialtyPickerScreen} />
          <Stack.Screen name="Scholarships" component={ScholarshipScreen} />
          <Stack.Screen name="MilitaryDepartment" component={MilitaryDepartmentScreen} />
          <Stack.Screen name="SpecialtyDetails" component={SpecialtyDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nProvider>
  );
}

function TabsNavigator() {
  const { t } = useI18n();

  const tabLabels: Record<keyof RootTabParamList, string> = {
    Home: t("navHome"),
    Specialties: t("navSpecialties"),
    Admission: t("navAdmission"),
    Documents: t("navDocuments"),
    Profile: t("navProfile"),
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: tabLabels[route.name],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 78,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: "rgba(255,255,255,0.98)",
          ...shadows.soft,
        },
          tabBarLabelStyle: {
            fontFamily: "Manrope_500Medium",
            fontSize: 10,
          },
        tabBarIcon: ({ color, focused }) =>
          focused ? (
            <PremiumIcon name={tabIcons[route.name]} size={30} iconSize={15} tone="blue" />
          ) : (
            <Ionicons name={tabIcons[route.name]} size={21} color={color} />
          ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Specialties" component={SpecialtiesScreen} />
      <Tab.Screen name="Admission" component={AdmissionScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
