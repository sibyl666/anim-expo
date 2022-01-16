import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

// components
import Text from "../Base/Text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { likeActivity } from "../../api/activity/likeActivity";
import { ActivityReplyObject, ActivityUnion, LikeableType } from "../../api/objectTypes";

import { ActivityNavigationProps } from "../../pages/pageProps";
import { useColors } from "../../hooks/useColors";
import { timeSince } from "../commonUtils";

interface ActivityStatsProps {
  replyCount?: number;
  likeCount: number;
  isLiked: boolean;
  activityId: number;
  createdAt: number;
  type: LikeableType;
}

interface LikeObject {
  id: number;
  isLiked: boolean;
  likeCount: number;
}

const ActivityStats = ({ replyCount, likeCount, isLiked, activityId, createdAt, type }: ActivityStatsProps) => {
  const navigation = useNavigation<ActivityNavigationProps>()
  const { color, colors } = useColors();
  const [union, setUnion] = useState<LikeObject>({
    id: activityId,
    isLiked,
    likeCount
  })

  const activityHandler = () => {
    navigation.navigate("Activity", {
      activityId
    })
  }

  const likeHandler = async () => {
    const resp = await likeActivity(activityId, type);
    setUnion(resp);
  }

  return (
    <View style={style.container}>
      <Text style={style.timeText}>{timeSince(new Date(createdAt * 1000))}</Text>

      <View style={style.stats}>
        {replyCount ? (
          <Pressable style={style.stat} onPress={activityHandler}>
            <Icon name="comment" color={colors.text} size={14} />
            <Text style={style.count}>{replyCount || ""}</Text>
          </Pressable>
        ) : (
          <></>
        )}

        <Pressable style={style.stat} onPress={likeHandler}>
          <Icon name="heart" color={union.isLiked ? color : colors.text} size={14} />
          <Text style={style.count}>{union.likeCount || ""}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 10,
  },
  stats: {
    flexDirection: "row",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },
  count: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
    marginLeft: 2,
  },
  timeText: {
    flex: 1,
    fontSize: 12,
  },
});

export default ActivityStats;
