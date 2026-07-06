import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, RootTabParamList, InfoKind } from "../../navigation/types";

export function useHomeNavigation() {
  const navigation = useNavigation<any>();

  // Ищем самый верхний навигатор (Stack), чтобы выйти за пределы вкладок
  const getRootNavigation = () => {
    let parent = navigation.getParent();
    while (parent?.getParent()) {
      parent = parent.getParent();
    }
    return parent || navigation;
  };

  const navigateToTab = (screen: keyof RootTabParamList) => {
    // Вкладки открываем обычным способом
    navigation.navigate(screen);
  };

  const navigateToInfo = (kind: InfoKind) => {
    // Для экранов Info (About, Dorm, FAQ) используем корневой навигатор
    const root = getRootNavigation();
    root.navigate("Info", { kind });
  };

  const navigateToStack = (screen: keyof RootStackParamList) => {
    const root = getRootNavigation();
    root.navigate(screen);
  };

  return { navigateToTab, navigateToInfo, navigateToStack };
}
