import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import strings from "../i18n/definitions";
import * as s from "./SearchField.sc";
import { ClearSearchButton } from "../components/allButtons.sc";
import { APIContext } from "../contexts/APIContext";

export default function SearchField({ query }) {
  const api = useContext(APIContext);
  const history = useHistory();
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
        history.push(`/search?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  }

  return (
    <s.SearchField>
      <s.SearchInput
        style={{ fontWeight: query ? "bold" : "normal" }}
        type="search"
        inputMode="search"
        enterKeyHint="search"
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
      {query && <ClearSearchButton onClick={() => history.push("/articles")} />}
    </s.SearchField>
  );
}
