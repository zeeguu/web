import { useRef, useState } from "react";
import strings from "../i18n/definitions";
import * as s from "./SearchField.sc";
import {
  ClearSearchButton,
  ZeeguuSearchIcon,
} from "../components/allButtons.sc";
import redirect from "../utils/routing/routing";

export default function SearchField({ api, query }) {
  const [searchTerm, setSearchTerm] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  function keyDownInSearch(e) {
    if (e.key === "Enter") {
      if (inputRef.current.value === "") {
        return;
      } else {
        api.logUserActivity(api.SEARCH_QUERY, "", searchTerm, "");
        redirect(`/search?search=${searchTerm}`);
      }
    }
  }

  function handleSearch() {
    if (inputRef.current.value === "") {
      return;
    } else {
      api.logUserActivity(api.SEARCH_QUERY, "", searchTerm, "");
      redirect(`/search?search=${searchTerm}`);
    }
  }

  return (
    <s.SearchField>
      <s.SearchInput
        style={{ float: "left", fontWeight: query ? "bold" : "normal" }}
        className="searchTextfieldInput"
        type="text"
        placeholder={strings.searchAllArticles}
        value={searchTerm == null ? "" : searchTerm}
        ref={inputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={keyDownInSearch}
        isFocused={isFocused}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasValue={!!searchTerm}
      />

      {query && (
        <a onClick={(e) => redirect("/articles")}>
          <ClearSearchButton />
        </a>
      )}

      <a style={{ cursor: "pointer" }} onClick={(e) => handleSearch()}>
        <ZeeguuSearchIcon />
      </a>
    </s.SearchField>
  );
}
