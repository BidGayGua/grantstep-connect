import { useRef, type ReactNode } from "react";
import { Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedButton({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.timing(scale, {
      toValue: value,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.94}
      onPress={onPress}
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({});
