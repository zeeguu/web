import { useContext, useEffect, useRef, useState } from "react";

import ArticlePreview from "./ArticlePreview";
import FeedFilterBar from "./FeedFilterBar";
import { browsingModeProps } from "./browsingMode";
import LocalStorage from "../assorted/LocalStorage";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useSelectInterest from "../hooks/useSelectInterest";

// The Evergreen tab: articles that don't go out of date (the crawler labels
// each article news or general), ranked by the learner's keywords and topics
// instead of by date. The server remembers what it showed, so what is new
// today comes first and what was passed by on earlier days drops behind.
//
// The filter row is the news feed's (FeedFilterBar), with the keywords added:
// they are what make this tab personal, so they are added and removed here.
// A search typed in the row narrows the tab like a keyword does, without
// keeping it; the bookmark button next to it keeps it as a keyword pill.
export default function EvergreenArticles() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { subscribedSearches, subscribeToSearch, removeSearch } = useSelectInterest(api);
  const [articles, setArticles] = useState(null);
  const [failed, setFailed] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ type: "all" });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setTitle(strings.evergreenTitle);
  }, []);

  // Refetch on language switch, on a pill, and after the keywords change. The
  // ignore flag drops a response that lands after a newer request.
  useEffect(() => {
    let ignore = false;
    setArticles(null);
    setFailed(false);
    const filter =
      activeFilter.type === "topic"
        ? { topic: activeFilter.value.title }
        : activeFilter.type === "keyword" || activeFilter.type === "search"
          ? { keyword: activeFilter.value.search }
          : {};
    api.getEvergreenArticles(
      (list) => !ignore && setArticles(list),
      () => !ignore && setFailed(true),
      filter,
    );
    return () => {
      ignore = true;
    }; // eslint-disable-next-line
  }, [userDetails, reloadToken, activeFilter]);

  // subscribeToSearch updates the list of keywords when the server answers;
  // refetch once that list changes, so the new keyword's articles show.
  // The first load of the keywords is not a change: skip it, or the page
  // loads twice. A search just kept becomes its keyword pill instead, which
  // refetches by itself (and gets the pill its delete button).
  const keywordCount = subscribedSearches ? subscribedSearches.length : null;
  const previousKeywordCount = useRef(null);
  useEffect(() => {
    if (keywordCount === null) return;
    if (previousKeywordCount.current !== null && previousKeywordCount.current !== keywordCount) {
      const kept =
        activeFilter.type === "search" &&
        subscribedSearches.find((k) => k.search.toLowerCase() === activeFilter.value.search.toLowerCase());
      if (kept) setActiveFilter({ type: "keyword", value: kept });
      else setReloadToken((t) => t + 1);
    }
    previousKeywordCount.current = keywordCount;
    // eslint-disable-next-line
  }, [keywordCount]);

  // Keeping a search that already is a keyword just selects that keyword.
  function keepSearch(term) {
    const existing = (subscribedSearches || []).find((k) => k.search.toLowerCase() === term.toLowerCase());
    if (existing) setActiveFilter({ type: "keyword", value: existing });
    else subscribeToSearch(term);
  }

  function removeKeyword(keyword) {
    removeSearch(keyword);
    setActiveFilter({ type: "all" });
  }

  const header = (
    <FeedFilterBar
      activeFilter={activeFilter}
      onSelectFilter={setActiveFilter}
      searchPlaceholder={strings.searchEvergreen}
      keywords={subscribedSearches}
      onSaveSearch={keepSearch}
      onRemoveKeyword={removeKeyword}
    />
  );

  if (failed) {
    return (
      <>
        {header}
        <EmptyState message={strings.evergreenEmpty} fillHeight={false} />
      </>
    );
  }

  if (articles === null) {
    return (
      <>
        {header}
        <LoadingAnimation delay={300} />
      </>
    );
  }

  // New today first (the server already orders them so), no headings: the
  // order says it.
  return (
    <>
      {header}
      {articles.length === 0 && <EmptyState message={strings.evergreenEmpty} fillHeight={false} />}
      {articles.map((each) => (
        <ArticlePreview key={each.id} article={each} {...browsingModeProps(LocalStorage.getBrowsingMode())} />
      ))}
    </>
  );
}
