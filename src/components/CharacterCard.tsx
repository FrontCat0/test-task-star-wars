import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Character } from "../types/character";

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {character.name}
        </Typography>
        <Typography color="textSecondary">
          Gender: {character.gender}
        </Typography>
        <Typography color="textSecondary">
          Birth Year: {character.birth_year}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClick}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CharacterCard;
