import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { Screen, Stack } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { useI18n } from "../i18n";
import { authStore } from "../lib/auth-store";
import { colors, shadows, typography } from "../theme";

type AuthMode = "login" | "register";

export function AuthScreen() {
  const { t } = useI18n();
  const navigation = useNavigation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) return;
    if (password.length < 6) {
        setError(t("passwordPlaceholder"));
        return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (mode === "login") {
        await authStore.signIn(email, password);
      } else {
        await authStore.signUp(email, password);
      }
      navigation.goBack();
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Stack>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <ScreenHeader title={mode === "login" ? t("login") : t("register")} />
          </View>

          <View style={styles.card}>
            <View style={styles.tabs}>
              <TouchableOpacity
                onPress={() => setMode("login")}
                style={[styles.tab, mode === "login" && styles.tabActive]}
              >
                <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                  {t("login")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("register")}
                style={[styles.tab, mode === "register" && styles.tabActive]}
              >
                <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                  {t("register")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("email")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("emailPlaceholder")}
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("password")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("passwordPlaceholder")}
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {mode === "login" ? t("login") : t("register")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "register" : "login")}
            style={styles.switchMode}
          >
            <Text style={styles.switchModeText}>
              {mode === "login" ? t("dontHaveAccount") : t("alreadyHaveAccount")}
            </Text>
          </TouchableOpacity>
        </Stack>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 12,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 24,
    ...shadows.card,
    overflow: "hidden",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  tabText: {
    ...typography.body,
    fontFamily: typography.family.medium,
    color: colors.muted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  form: {
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    ...typography.meta,
    color: colors.foreground,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...typography.body,
    color: colors.foreground,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    ...shadows.soft,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.white,
  },
  errorText: {
    ...typography.meta,
    color: colors.destructive,
    textAlign: "center",
  },
  switchMode: {
    alignItems: "center",
    marginTop: 10,
  },
  switchModeText: {
    ...typography.body,
    color: colors.primary,
    fontFamily: typography.family.medium,
  },
});
