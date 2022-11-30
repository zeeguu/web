import { useState } from "react";
import strings from "../i18n/definitions";
import * as s from "./SearchField.sc";
import { ClearSearchButton } from "../components/allButtons.sc";

export default function SearchField({ query }) {
  const [searchTerm, setSearchTerm] = useState(query);

  function keyDownInSearch(e) {
    if (e.key === "Enter") {
      console.log(searchTerm);
      window.location = `/articles?search=${searchTerm}`;
    }
  }

  return (
    <s.SearchField>
      <input
        style={{ float: "left", fontWeight: query ? "bold" : "normal" }}
        className="searchTextfieldInput"
        type="text"
        id="search-expandable"
        placeholder={strings.searchAllArticles}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={keyDownInSearch}
      />

      {query && (
        <a onClick={(e) => (window.location = "/articles")}>
          <ClearSearchButton />
        </a>
      )}
    </s.SearchField>
  );
}
