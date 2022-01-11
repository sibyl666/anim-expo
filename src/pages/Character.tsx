import React, { useState, Suspense } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";

import AnimRenderHtml from "../components/AnimRenderHtml";
import Loading from "../components/AnimLoading";
import Text from "../components/Base/Text";

import { CharacterScreenProps } from "./pageProps";
import { getCharacter } from "../api/character/getCharacter";
import { CharacterObject } from "../api/objectTypes";
import { useColors } from "../hooks/useColors";
import { usePromise } from "../hooks/usePromise";

interface CharacterProps {
  characterReader: () => CharacterObject;
}

const Character = ({ characterReader }: CharacterProps) => {
  const [character] = useState(() => characterReader());
  const { color } = useColors();

  return (
    <ScrollView style={style.container}>
      <View style={[style.cover, { backgroundColor: color }]}>
        <Image source={{ uri: character.image.large }} style={style.image} />
        <Text style={style.name}>{character.name.userPreferred}</Text>
        {character.name.alternative.length > 0 && (
          <Text style={style.alternative}>{character.name.alternative.join(", ")}</Text>
        )}
      </View>

      <View style={style.description}>
        <AnimRenderHtml source={{ html: character.description }} />
      </View>
    </ScrollView>
  );
};

const CharacterSuspense = ({
  route: {
    params: { characterId },
  },
}: CharacterScreenProps) => {
  const [characterReader] = usePromise(getCharacter, characterId);

  return (
    <Suspense fallback={<Loading />}>
      <Character characterReader={characterReader} />
    </Suspense>
  )
}

const style = StyleSheet.create({
  container: {
    paddingBottom: 40,
    flexShrink: 1,
    flex: 1
  },
  cover: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 450,
    padding: 10,
  },
  name: {
    fontFamily: "Overpass_700Bold",
    fontSize: 22,
    color: "white",
  },
  alternative: {
    fontSize: 11,
    lineHeight: 14,
    color: "white",
  },
  image: {
    width: 200,
    height: 315,
    borderRadius: 4,
  },
  description: {
    padding: 10,
    flex: 1,
    flexShrink: 1,
  }
});

export default CharacterSuspense;
