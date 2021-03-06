import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "../../hooks/useColors";

import ActivityUser from "./ActivityUser";
import ActivityStats from "./ActivityStats";
import Markdown from "../../plugins/Markdown";

import { TextActivityObject } from "../../api/objectTypes";

interface TextActivityProps {
  activity: TextActivityObject;
}

const ActivityText = ({ activity }: TextActivityProps) => {
  const { colors } = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <ActivityUser user={activity.user} createdAt={activity.createdAt} />
      <Markdown>
        {activity.text}
      </Markdown>
      
      <ActivityStats
        {...activity}
        type="ACTIVITY"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // minHeight: 120,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    elevation: 1,
  },
});

export default memo(ActivityText);
