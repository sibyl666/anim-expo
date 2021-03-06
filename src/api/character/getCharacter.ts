import axios from "axios";
import { CharacterObject } from "../objectTypes";

export const characterQuery = `query Character($id: Int) {
  Character(id: $id) {
    id
    isFavourite
    favourites
    name {
      userPreferred
      alternative
    }
    image {
      large
    }
    description
  }
}`;

export interface CharacterResponse {
  data: {
    Character: CharacterObject;
  };
}

export const getCharacter = async (id: number) => {
  const resp = await axios.post<CharacterResponse>("/", {
    query: characterQuery,
    variables: {
      id
    }
  });

  return resp.data.data.Character;
}
