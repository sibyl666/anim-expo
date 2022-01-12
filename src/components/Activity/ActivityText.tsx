import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "../../hooks/useColors";

import AnimRenderHtml from "../AnimRenderHtml";
import ActivityUser from "./ActivityUser";
import ActivityStats from "./ActivityStats";

import { TextActivityObject } from "../../api/objectTypes";

interface TextActivityProps {
  activity: TextActivityObject;
}

const TextActivity = ({ activity }: TextActivityProps) => {
  const { colors } = useColors();

  return (
    <View style={[style.container, { backgroundColor: colors.card }]}>
      <ActivityUser activity={activity} />
      <AnimRenderHtml source={{ html: activity.text }} />
      <ActivityStats activity={activity} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    minHeight: 120,
    padding: 10,
  },
});

export default memo(TextActivity);
