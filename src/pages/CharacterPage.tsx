import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import { getCharacter, updateCharacter } from "../services/api";
import { Character } from "../types/character";

interface LocationState {
  page?: number;
  searchQuery?: string;
}

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [character, setCharacter] = useState<Character | null>(null);
  const [editedCharacter, setEditedCharacter] = useState<Character | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCharacter(id);
      setCharacter(data);
      setEditedCharacter(data);
    } catch (error) {
      console.error("Error fetching character:", error);
      setError("Failed to load character data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleSave = useCallback(() => {
    if (editedCharacter && id) {
      updateCharacter(editedCharacter);
      setCharacter(editedCharacter);
      setEditMode(false);
      setSnackbarOpen(true);
    }
  }, [editedCharacter, id]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCharacter((prev) => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleCancel = useCallback(() => {
    setEditedCharacter(character);
    setEditMode(false);
  }, [character]);

  const handleReset = useCallback(() => {
    if (id) {
      localStorage.removeItem(`character_${id}`);
      fetchCharacter();
      setSnackbarOpen(true);
    }
  }, [id, fetchCharacter]);

  const handleBack = useCallback(() => {
    const params = new URLSearchParams();
    if (state?.searchQuery) params.set("query", state.searchQuery);
    if (state?.page && state.page !== 1)
      params.set("page", state.page.toString());
    navigate(`/?${params.toString()}`);
  }, [navigate, state]);

  const characterDetails = useMemo(() => {
    if (!character) return null;
    return (
      <>
        <Typography>
          <strong>Name:</strong> {character.name}
        </Typography>
        <Typography>
          <strong>Gender:</strong> {character.gender}
        </Typography>
        <Typography>
          <strong>Birth Year:</strong> {character.birth_year}
        </Typography>
      </>
    );
  }, [character]);

  if (isLoading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!character) return <Typography>Character not found</Typography>;

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper
          elevation={3}
          style={{ padding: "20px", maxWidth: "500px", width: "100%" }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {character.name}
          </Typography>
          {editMode ? (
            <>
              <TextField
                name="name"
                label="Name"
                value={editedCharacter?.name || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="gender"
                label="Gender"
                value={editedCharacter?.gender || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="birth_year"
                label="Birth Year"
                value={editedCharacter?.birth_year || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              {characterDetails}
              <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  fullWidth
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleReset}
                  fullWidth
                >
                  Reset to Original
                </Button>
                <Button variant="outlined" onClick={handleBack} fullWidth>
                  Back to List
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Changes saved successfully"
      />
    </Container>
  );
};

export default React.memo(CharacterPage);
