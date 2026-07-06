import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootTabParamList = {
  Home: undefined;
  Specialties: undefined;
  Admission: undefined;
  Hub: undefined;
  Settings: undefined;
};

export type InfoKind = "about" | "dorm" | "labs" | "parents" | "city" | "faq";

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
