import React, { useState } from "react";
import * as s from "./SearchField.sc";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useMediaQuery,
} from "@mui/material";
import strings from "../i18n/definitions";
import CloseIcon from "@mui/icons-material/Close";
import { Filters } from "../components/icons/Filters";

export default function SearchField({ onOpenFilters, searchFunc }) {
  const isLargerThan768 = useMediaQuery("(min-width: 768px)");

  const [searchTerm, setSearchTerm] = useState("");

  const keyDownInSearch = (e) => {
    if (e.key === "Enter") {
      searchFunc(searchTerm);
    }
  };

  const handleClearClick = () => {
    setSearchTerm("");
    searchFunc("");
  };

  return (
    <s.SearchField>
      <FormControl
        sx={{ m: 1, width: "25ch" }}
        className="search-box"
        variant="outlined"
        size="small"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          {strings.search}
        </InputLabel>
        <OutlinedInput
          className="search-input"
          variant="outlined"
          id="outlined-adornment-password"
          type="text"
          label={strings.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={keyDownInSearch}
          endAdornment={
            <InputAdornment edge="end" position="end">
              {!isLargerThan768 && (
                <IconButton
                  size="small"
                  onClick={onOpenFilters}
                  edge="end"
                  style={{ marginRight: "5px" }}
                >
                  <Filters aria-label="search" />
                </IconButton>
              )}
              {searchTerm && (
                <IconButton
                  aria-label="search"
                  size="small"
                  onClick={handleClearClick}
                  edge="end"
                >
                  <CloseIcon />
                </IconButton>
              )}
              <IconButton
                aria-label="search"
                onClick={() => searchFunc(searchTerm)}
                edge="end"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </s.SearchField>
  );
}
