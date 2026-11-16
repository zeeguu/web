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
  // Only offered once the keywords have loaded (see header), so this check
  // sees them all.
  function keepSearch(term) {
    const existing = subscribedSearches.find((k) => k.search.toLowerCase() === term.toLowerCase());
    if (existing) {
      setActiveFilter({ type: "keyword", value: existing });
      return;
    }
    api.logUserActivity(api.SUBSCRIBE_TO_SEARCH, "", term, "evergreen");
    subscribeToSearch(term);
  }

  // A 🔍 term on a card is one of the learner's keywords: select its pill.
  function selectSearch(term) {
    const keyword = (subscribedSearches || []).find((k) => k.search.toLowerCase() === term.toLowerCase());
    setActiveFilter(keyword ? { type: "keyword", value: keyword } : { type: "search", value: { search: term } });
    window.scrollTo({ top: 0 });
  }

  function removeKeyword(keyword) {
    api.logUserActivity(api.UNSUBSCRIBE_FROM_SEARCH, "", keyword.search, "evergreen");
    removeSearch(keyword);
    setActiveFilter({ type: "all" });
  }

  const header = (
    <FeedFilterBar
      activeFilter={activeFilter}
      onSelectFilter={setActiveFilter}
      searchPlaceholder={strings.searchEvergreen}
      searchSource="evergreen"
      keywords={subscribedSearches}
      onSaveSearch={subscribedSearches ? keepSearch : null}
      onRemoveKeyword={removeKeyword}
    />
  );

  if (failed) {
    return (
      <>
        {header}
        <EmptyState message={strings.evergreenLoadFailed} fillHeight={false} />
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

  // A search that finds nothing says so; the general advice is for the
  // unfiltered tab.
  const emptyMessage =
    activeFilter.type === "search"
      ? strings.formatString(strings.evergreenNoMatches, activeFilter.value.search)
      : strings.evergreenEmpty;

  // New today first (the server already orders them so), no headings: the
  // order says it.
  return (
    <>
      {header}
      {articles.length === 0 && <EmptyState message={emptyMessage} fillHeight={false} />}
      {articles.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          onSelectSearch={selectSearch}
          {...browsingModeProps(LocalStorage.getBrowsingMode())}
        />
      ))}
    </>
  );
}
