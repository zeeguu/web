import { useState } from "react";
import * as s from "./SearchField.sc";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import strings from "../i18n/definitions";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchField({ searchFunc }) {
  const [searchTerm, setSearchTerm] = useState("");

  const keyDownInSearch = (e) => {
    if (e.key === "Enter") {
      searchFunc(searchTerm);
    }
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
            <InputAdornment position="end">
              {searchTerm && (
                <IconButton
                  aria-label="search"
                  size="small"
                  onClick={() => setSearchTerm("")}
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
