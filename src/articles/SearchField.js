import { useState } from "react";

export default function SearchField() {
  const [searchTerm, setSearchTerm] = useState("");

  function keyDownInSearch(e) {
    if (e.key === "Enter") {
      console.log(searchTerm);
      window.location = `/articles/search/${searchTerm}`;
    }
  }

  return (
    <>
      {/* <div id="searchesList"></div>

      <div id="searchesFilterList"></div>
      <div id="topicsFilterList"></div> */}

      <div className="seachField">
        <input
          className="searchTextfieldInput"
          type="text"
          id="search-expandable"
          placeholder="Search all articles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={keyDownInSearch}
        />
      </div>
    </>
  );
}
