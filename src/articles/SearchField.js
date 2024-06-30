import { useState } from "react";
import strings from "../i18n/definitions";
import * as s from "./SearchField.sc";
import { ClearSearchButton } from "../components/allButtons.sc";

export default function SearchField({ api, query }) {
  const [searchTerm, setSearchTerm] = useState(query);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  function keyDownInSearch(e) {
    if (e.key === "Enter") {
      console.log(searchTerm);
      api.logUserActivity(api.SEARCH_QUERY, "", searchTerm, "");
      window.location = `/articles/search?search=${searchTerm}`;
    }
  }
  return (
    <s.SearchField>
      <s.SearchInput
        style={{ float: "left", fontWeight: query ? "bold" : "normal" }}
        className="searchTextfieldInput"
        type="text"
        placeholder={strings.searchAllArticles}
        value={searchTerm === null ? "" : searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={keyDownInSearch}
        isFocused={isFocused}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasValue={!!searchTerm}
      />

      {query && (
        <a onClick={(e) => (window.location = "/articles")}>
          <ClearSearchButton />
        </a>
      )}

      <a
        style={{ cursor: "pointer" }}
        onClick={(e) => (window.location = `/articles/search?search=${searchTerm}`)}
      >
        <svg
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ width: "1.8em", fill: "orange" }}
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
      </a>
    </s.SearchField>
  );
}
