import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootTabParamList = {
  Home: undefined;
  Specialties: undefined;
  Admission: undefined;
  Checklist: undefined;
  Settings: undefined;
};

export type InfoKind = "about" | "dorm" | "labs" | "parents" | "city" | "faq";

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  Info: { kind: InfoKind };
  Auth: undefined;
  ExpenseCalculator: undefined;
  Parents: undefined;
  SpecialtyPicker: undefined;
  Scholarships: undefined;
  MilitaryDepartment: undefined;
  SpecialtyDetails: { id: string };
};
