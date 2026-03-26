import React from "react";
import * as s from "./SearchBar.sc";

const SearchBar = ({ value, onChange, placeholder, onSearch }) => {
  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      onSearch && onSearch();
    }
  };

  return (
    <s.SearchBarContainer>
      <s.SearchInput
        type="text"
        name="search-friends"
        value={value}
        onChange={onChange}
        onKeyUp={handleKeyUp}
        placeholder={placeholder || "Search..."}
      />
    </s.SearchBarContainer>
  );
};

export default SearchBar;
