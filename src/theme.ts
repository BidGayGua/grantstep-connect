import { Platform } from "react-native";

export const colors = {
  background: "#fbfdff",
  card: "#ffffff",
  foreground: "#0F235A",
  muted: "#35508E",
  label: "#3D63C7",
  primary: "#1E4FC7",
  primaryDeep: "#102C6A",
  primaryGlow: "#3D63C7",
  accent: "#edf4ff",
  secondary: "#f4f7fd",
  border: "#dfe8f6",
  success: "#2f9d62",
  warning: "#a26a00",
  destructive: "#d14343",
  white: "#ffffff",
  purple: "#6154d8",
  cyan: "#0794c8",
  orange: "#d9781f",
};

export const gradients = {
  primary: ["#172f78", "#3860d4"] as const,
  hero: ["#142963", "#203f9a", "#4c75e6"] as const,
};

export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: "#203c91",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: "#203c91",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.2,
      shadowRadius: 36,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  deep: Platform.select({
    ios: {
      shadowColor: "#142963",
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.3,
      shadowRadius: 46,
    },
    android: {
      elevation: 12,
    },
    default: {},
  }),
};

export const typography = {
  family: {
    regular: "Manrope_400Regular",
    medium: "Manrope_500Medium",
    semiBold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 32,
    lineHeight: 38,
  },
  section: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 20,
    lineHeight: 26,
  },
  cardTitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    fontFamily: "Manrope_500Medium",
    fontSize: 15,
    lineHeight: 20,
  },
  meta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
};
