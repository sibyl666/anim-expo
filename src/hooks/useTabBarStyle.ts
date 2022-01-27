import { StyleProp, ViewStyle } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "./useColors";

export const useTabBarStyle = (pgCount: number = 1) => {
  const { color } = useColors();
  const { width } = useSafeAreaFrame();
  const { top } = useSafeAreaInsets();

  const tabWidth = width / pgCount - 10;
  const indicatorWidth = 60;

  const tabBarStyle: StyleProp<ViewStyle> = {
    position: "absolute",
    left: 10,
    right: 10,
    top: 10 + top,
    borderRadius: 10,
    overflow: "hidden",
  }

  const tabBarIndicatorStyle: StyleProp<ViewStyle> = {
    backgroundColor: color,
    width: indicatorWidth,
    left: (tabWidth - indicatorWidth) / 2,
    borderRadius: 1000,
  }

  const sceneContainerStyle: StyleProp<ViewStyle> = {
    paddingTop: 10 + top + 44,
  }

  return {
    tabBarStyle,
    tabBarIndicatorStyle,
    sceneContainerStyle,
  }
}
