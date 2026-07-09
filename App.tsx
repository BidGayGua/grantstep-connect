import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";

import { I18nProvider } from "./src/i18n";
import { AdmissionScreen } from "./src/screens/AdmissionScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { ExpenseCalculatorScreen } from "./src/screens/ExpenseCalculatorScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { InfoScreen } from "./src/screens/InfoScreen";
import { ParentsScreen } from "./src/screens/ParentsScreen";
import {
  MilitaryDepartmentScreen,
  ScholarshipScreen,
} from "./src/screens/SimpleInfoListScreen";
import { SpecialtyDetailsScreen } from "./src/screens/SpecialtyDetailsScreen";
import { SpecialtyPickerScreen } from "./src/screens/SpecialtyPickerScreen";
import { SpecialtiesScreen } from "./src/screens/SpecialtiesScreen";
import { colors } from "./src/theme";
import { TabsNavigator } from "./src/navigation/TabsNavigator";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
let defaultFontsConfigured = false;

const systemFont = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "System",
});

export default function App() {
  if (!defaultFontsConfigured) {
    defaultFontsConfigured = true;
    const textComponent = Text as typeof Text & { defaultProps?: { style?: object } };
    const inputComponent = TextInput as typeof TextInput & { defaultProps?: { style?: object } };
    textComponent.defaultProps = {
      ...(textComponent.defaultProps ?? {}),
      style: [{ fontFamily: systemFont }, textComponent.defaultProps?.style],
    };
    inputComponent.defaultProps = {
      ...(inputComponent.defaultProps ?? {}),
      style: [{ fontFamily: systemFont }, inputComponent.defaultProps?.style],
    };
  }

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <I18nProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={TabsNavigator} />
              <Stack.Screen name="Auth" component={AuthScreen} />
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
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unexpected startup error",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GrantStep startup error", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
          <Text style={styles.fallbackTitle}>GrantStep</Text>
          <Text style={styles.fallbackText}>App could not start.</Text>
          <Text style={styles.fallbackDetails}>{this.state.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  fallbackTitle: {
    color: colors.foreground,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  fallbackText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
  },
  fallbackDetails: {
    color: colors.destructive,
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
  },
});
