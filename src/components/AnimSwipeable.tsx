import { memo } from "react";
import { StyleSheet, ViewProps, View } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";

import { springConfig } from "../constants/reanimated";

interface AnimSwipeableProps extends ViewProps {
  children: JSX.Element;
  options: () => JSX.Element;
}

type AnimContext = {
  startX: number;
};

const AnimSwipeable = ({ children, options, ...rest }: AnimSwipeableProps) => {
  const { width } = useSafeAreaFrame();
  const x = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, AnimContext>({
    onStart: ({ translationX }, context) => {
      context.startX = translationX;
    },
    onActive: ({ translationX }, { startX }) => {
      x.value = translationX + startX;
    },
    onEnd: () => {
      if (Math.abs(x.value) > width / 3) {
        x.value = -(width / 3);
      } else {
        x.value = 0;
      }
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(x.value, springConfig) }],
  }), []);

  return (
    <View>
      <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-10, 10]}>
        <Animated.View style={[animatedStyle, { ...(rest.style as {}) }]}>{children}</Animated.View>
      </PanGestureHandler>

      <Animated.View style={[style.options, { width: width / 3 -10 }]}>{options()}</Animated.View>
    </View>
  );
};

const style = StyleSheet.create({
  options: {
    position: "absolute",
    top: 3,
    right: 5,
    bottom: 3,
    zIndex: -10,
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default memo(AnimSwipeable);
