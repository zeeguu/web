import { useState } from "react";
import * as s from "./SearchField.sc";

export default function SearchField() {
  const [searchTerm, setSearchTerm] = useState("");

  function keyDownInSearch(e) {
    if (e.key === "Enter") {
      console.log(searchTerm);
      window.location = `/articles/search/${searchTerm}`;
    }
  }

  return (
    <s.SearchField>
      <input
        className="searchTextfieldInput"
        type="text"
        id="search-expandable"
        placeholder="Search all articles"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={keyDownInSearch}
      />
    </s.SearchField>
  );
}
