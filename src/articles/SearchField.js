import { useContext, useRef, useState } from "react";
import strings from "../i18n/definitions";
import * as s from "./SearchField.sc";
import { ClearSearchButton, SearchIcon } from "../components/allButtons.sc";
import redirect from "../utils/routing/routing";
import { APIContext } from "../contexts/APIContext";

export default function SearchField({ query }) {
  const api = useContext(APIContext);
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
        type="text"
        placeholder={strings.searchAllArticlesAndVideos}
        value={searchTerm == null ? "" : searchTerm}
        ref={inputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={keyDownInSearch}
        isFocused={isFocused}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasValue={!!searchTerm}
      />
      {query && <ClearSearchButton onClick={(e) => redirect("/articles")} />}
      <SearchIcon
        className="searchIcon"
        style={{ cursor: "pointer" }}
        sx={{ fontSize: "2rem" }}
        onClick={(e) => handleSearch()}
      />
    </s.SearchField>
  );
}
