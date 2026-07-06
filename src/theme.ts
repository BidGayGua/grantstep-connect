import { Platform } from "react-native";

export const colors = {
  background: "#F7F9FC",
  card: "#ffffff",
  foreground: "#0B1F4D",
  muted: "#64748B",
  label: "#3D63C7",
  primary: "#1E4FC7",
  primaryDeep: "#102C6A",
  primaryGlow: "#3D63C7",
  accent: "#EEF5FF",
  secondary: "#F5F7FB",
  border: "#E4ECF7",
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
      shadowColor: "#0B1F4D",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: "#0B1F4D",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.06,
      shadowRadius: 18,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }),
  deep: Platform.select({
    ios: {
      shadowColor: "#0B1F4D",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
    },
    android: {
      elevation: 7,
    },
    default: {},
  }),
};

const systemFont = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "System",
});

export const typography = {
  family: {
    regular: systemFont,
    medium: systemFont,
    semiBold: systemFont,
    bold: systemFont,
  },
  title: {
    fontFamily: systemFont,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
    fontWeight: "700" as const,
  },
  section: {
    fontFamily: systemFont,
    fontSize: 21,
    lineHeight: 27,
    letterSpacing: -0.2,
    fontWeight: "600" as const,
  },
  cardTitle: {
    fontFamily: systemFont,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.1,
    fontWeight: "600" as const,
  },
  body: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  button: {
    fontFamily: systemFont,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
  meta: {
    fontFamily: systemFont,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400" as const,
  },
};
