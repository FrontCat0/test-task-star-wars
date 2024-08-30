import React from "react";
import { Pagination as MUIPagination } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <MUIPagination
      count={totalPages}
      page={currentPage}
      onChange={handleChange}
      color="primary"
      size="large"
      showFirstButton
      showLastButton
    />
  );
};

export default Pagination;
