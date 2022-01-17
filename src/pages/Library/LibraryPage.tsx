import React, { Suspense, useEffect } from "react";
import { FlatList, FlatListProps, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { LibraryPageParamList } from "../pageProps";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import { MediaListCollectionObject, MediaListObject, MediaType } from "../../api/objectTypes";
import { getEntries } from "../../api/library/getEntries";

import { timingConfig } from "../../constants/reanimated";
import { usePromise } from "../../hooks/usePromise";

import MediaCategories from "../../components/Media/MediaCategories";
import MediaCard from "../../components/Media/MediaCard";
import Loading from "../../components/AnimLoading";

import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../../store";
import { setCategories } from "../../store/animeCategoriesSlice";

interface LibraryPage {
  libraryReader: () => MediaListCollectionObject;
  refresh: () => void;
  type: MediaType;
}

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<MediaListObject>>(FlatList);

const LibraryPage = ({ libraryReader, refresh, type }: LibraryPage) => {
  const categories = type == "ANIME"
    ? useSelector((state: RootState) => state.animeCategories.categories)
    : useSelector((state: RootState) => state.mangaCategories.categories)
    
  const findEntries = (category: string) => {
    return listCollection.lists.find(list => {
      return list.name == category;
    })
  }
  
  const listCollection = libraryReader();
  const dispatch = useDispatch<RootDispatch>();
  const entries = findEntries(categories[0])?.entries;
  const opacity = useSharedValue(1);

  useEffect(() => {
    const newCategories = listCollection.lists.map(list => list.name)
    newCategories.forEach((newCategory, index) => {
      if (categories.includes(newCategory)) return;

      // new category that not in store
      newCategories.splice(index, 0, newCategory);
      
      dispatch(setCategories(
        newCategories
      ))
    })
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingHorizontal: 6,
      opacity: withTiming(opacity.value, timingConfig),
    };
  }, []);

  return (
    <View style={style.container}>
      <MediaCategories type={type} />
      <AnimatedFlatList
        data={entries}
        renderItem={({ item }) => <MediaCard editCallback={refresh} item={item.media} progress={item.progress} />}
        keyExtractor={item => item.media.id.toString()}
        getItemLayout={(_, index) => ({
          index,
          length: 250,
          offset: index * 250,
        })}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        style={animatedStyle}
      />
    </View>
  );
};

const LibraryPageSuspense = ({
  route: {
    params: { userId, type },
  },
}: BottomTabScreenProps<LibraryPageParamList, "Anime" | "Manga">) => {
  const [libraryReader, libraryUpdater] = usePromise(getEntries, userId, type);

  const refresh = () => {
    libraryUpdater(userId, type);
  };

  return (
    <Suspense fallback={<Loading />}>
      <LibraryPage libraryReader={libraryReader} refresh={refresh} type={type} />
    </Suspense>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LibraryPageSuspense;
