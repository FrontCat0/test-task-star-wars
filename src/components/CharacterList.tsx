import React from "react";
import { Grid } from "@mui/material";
import CharacterCard from "./CharacterCard";
import { Character } from "../types/character";

interface CharacterListProps {
  characters: Character[];
  onCharacterClick: (characterId: string) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onCharacterClick,
}) => {
  return (
    <Grid container spacing={3}>
      {characters.map((character) => (
        <Grid item xs={12} sm={6} md={4} key={character.url}>
          <CharacterCard
            character={character}
            onClick={() =>
              onCharacterClick(character.url.split("/").slice(-2)[0])
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CharacterList;
