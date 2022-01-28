import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LibraryScreenProps } from "../props";

import { useTabBarStyle } from "../../hooks/useTabBarStyle";
import { useSelector } from "react-redux";

import { RootState } from "../../store";
import LibraryPage from "./LibraryPage";

const Tab = createMaterialTopTabNavigator();

const Library = ({
  route: {
    params: { userId, padd },
  },
}: LibraryScreenProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { tabBarIndicatorStyle, tabBarStyle } = useTabBarStyle(padd); 

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: tabBarStyle,
        tabBarIndicatorStyle: tabBarIndicatorStyle,
      }}
    >
      <Tab.Screen name="Anime" component={LibraryPage} initialParams={{ userId: userId || user?.id, type: "ANIME" }} />
      <Tab.Screen name="Manga" component={LibraryPage} initialParams={{ userId: userId || user?.id, type: "MANGA" }} />
    </Tab.Navigator>
  );
};

export default Library;
