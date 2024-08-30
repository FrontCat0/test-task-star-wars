import React, { useState, useEffect } from "react";
import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ display: "flex", marginBottom: "20px" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search characters..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <IconButton onClick={handleSearch} color="primary">
        <SearchIcon />
      </IconButton>
    </div>
  );
};

export default SearchBar;
