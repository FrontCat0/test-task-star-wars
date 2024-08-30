import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CharacterList from "../components/CharacterList";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { getCharacters, searchLocalCharacters } from "../services/api";
import { Character } from "../types/character";

interface LocationState {
  page?: number;
  searchQuery?: string;
  isFromNavigation?: boolean;
}

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(state?.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(state?.searchQuery || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocalSearch, setIsLocalSearch] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("query");
    const pageParam = params.get("page");

    if (queryParam !== null) {
      setSearchQuery(queryParam);
    }
    if (pageParam !== null) {
      setPage(parseInt(pageParam, 10));
    }
  }, [location.search]);

  const fetchCharacters = useCallback(
    async (currentPage: number, query: string) => {
      setIsLoading(true);
      try {
        if (query) {
          const localResults = searchLocalCharacters(query);
          if (localResults.length > 0) {
            setCharacters(localResults);
            setTotalPages(Math.ceil(localResults.length / 10));
            setIsLocalSearch(true);
          } else {
            const response = await getCharacters(currentPage, query);
            setCharacters(response.results);
            setTotalPages(Math.ceil(response.count / 10));
            setIsLocalSearch(false);
          }
        } else {
          const response = await getCharacters(currentPage);
          setCharacters(response.results);
          setTotalPages(Math.ceil(response.count / 10));
          setIsLocalSearch(false);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCharacters(page, searchQuery);
  }, [fetchCharacters, page, searchQuery]);

  const updateURLParams = useCallback(
    (newPage: number, query: string) => {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (newPage !== 1) params.set("page", newPage.toString());
      navigate(`?${params.toString()}`, { replace: true });
    },
    [navigate]
  );

  const handleSearch = useCallback(
    (query: string) => {
      const newPage = query !== searchQuery ? 1 : page;
      setSearchQuery(query);
      setPage(newPage);
      updateURLParams(newPage, query);
    },
    [page, searchQuery, updateURLParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateURLParams(newPage, searchQuery);
    },
    [searchQuery, updateURLParams]
  );

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      navigate(`/character/${characterId}`, {
        state: {
          page,
          searchQuery,
          isFromNavigation: true,
        },
      });
    },
    [navigate, page, searchQuery]
  );

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Star Wars Characters
      </Typography>
      <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      <Box
        my={4}
        minHeight="60vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
          >
            <CircularProgress />
          </Box>
        ) : (
          <CharacterList
            characters={characters}
            onCharacterClick={handleCharacterClick}
          />
        )}
        {!isLocalSearch && (
          <Box mt={2}>
            <Grid container justifyContent="center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default React.memo(HomePage);
