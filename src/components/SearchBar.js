import React from "react";
import * as s from "./SearchBar.sc";

const SearchBar = ({ value, onChange, placeholder, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch && onSearch();
    }
  };

  return (
    <s.SearchBarContainer>
      <s.SearchInput
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Search..."}
      />
      <s.SearchButton
        type="button"
        onClick={onSearch}
      >
        Search
      </s.SearchButton>
    </s.SearchBarContainer>
  );
};

export default SearchBar;
