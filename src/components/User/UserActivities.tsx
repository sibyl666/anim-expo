import React, { memo, Suspense, useCallback, useRef, useState } from "react";
import { FlatListProps, ListRenderItem, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";

import { ActivityUnion } from "../../api/objectTypes";
import { getActivities } from "../../api/user/getActivities";
import { delActivity } from "../../api/activity/delActivity";

import { getActivityElement } from "../Activity/getActivityElement";

import ActivityCreate from "../Activity/ActivityCreate";
import AnimItemSeparator from "../AnimItemSeparator";
import AnimSwipeable from "../AnimSwipeable";
import Loading from "../AnimLoading";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { usePromise } from "../../hooks/usePromise";

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<ActivityUnion>>(FlatList);

interface UserActivitiesProps {
  activitiesReader: () => ActivityUnion[];
  Header?: JSX.Element,
  userId: number;
}

const UserActivities = ({ activitiesReader, userId, Header }: UserActivitiesProps) => {
  const storeUser = useSelector((state: RootState) => state.user.user);
  const [activities, setActivities] = useState(() => activitiesReader());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const page = useRef(1);

  const addActivity = (activity: ActivityUnion) => {
    setActivities(activities => [activity, ...activities]);
  };

  const delActivityHandler = async (index: number, id: number) => {
    await delActivity(id);

    setActivities(activities => [
      ...activities.slice(0, index),
      ...activities.slice(index + 1),
    ]);
  };

  const refreshHandler = async () => {
    setIsRefreshing(true);
    const activities = await getActivities(userId, 1);
    setActivities(activities);
    page.current = 2;
    setIsRefreshing(false);
  }

  const onEndHandler = async () => {
    page.current++;
    const resp = await getActivities(userId, page.current);
    setActivities(activities => [...activities, ...resp]);
  };

  const options = (index: number, itemId: number) => {
    return (
      <Icon
        onPress={() => delActivityHandler(index, itemId)}
        name="delete"
        color="white"
        size={60}
        style={styles.icon}
      />
    );
  };

  const renderItem: ListRenderItem<ActivityUnion> = ({ item, index }) => {
    const element = getActivityElement(item, item.type);

    if (storeUser?.id == userId || ("messenger" in item && item.messenger.id)) {
      return <AnimSwipeable options={() => options(index, item.id)}>{element}</AnimSwipeable>;
    }

    return element;
  };

  return (
    <>
      <AnimatedFlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        ItemSeparatorComponent={AnimItemSeparator}
        ListHeaderComponent={Header || <></>}
        refreshing={isRefreshing}
        onRefresh={refreshHandler}
        onEndReached={onEndHandler}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ paddingBottom: 26 }}
        overScrollMode="never"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />

      <ActivityCreate activityCallback={addActivity} recipientId={storeUser?.id !== userId ? userId : undefined} />
    </>
  );
};


const UserActivitiesSuspense = ({ userId, Header }: { userId: number, Header?: JSX.Element }) => {
  const [activitiesReader] = usePromise(getActivities, userId, 1);

  return (
    <Suspense fallback={<Loading />}>
      <UserActivities activitiesReader={activitiesReader} Header={Header} userId={userId} />
    </Suspense>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#f43f5e",
    borderRadius: 6,
  },
});

export default memo(UserActivitiesSuspense);
