import { useContext, useEffect, useState } from "react";

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
import useSubscribedSearches from "../hooks/useSubscribedSearches";

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
  const { subscribedSearches, findSearch, isSearchKept, subscribeToSearch, removeSearch } = useSubscribedSearches(api);
  const [articles, setArticles] = useState(null);
  const [failed, setFailed] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ type: "all" });

  useEffect(() => {
    setTitle(strings.evergreenTitle);
  }, []);

  // What the server is asked for. A search and the keyword of the same text
  // ask for the same list, so turning one into the other refetches nothing.
  const requestFilter =
    activeFilter.type === "topic"
      ? { topic: activeFilter.value.title }
      : activeFilter.type === "keyword" || activeFilter.type === "search"
        ? { keyword: activeFilter.value.search }
        : {};
  const requestKey = JSON.stringify(requestFilter);

  // Refetch on language switch and on a pill. The ignore flag drops a
  // response that lands after a newer request.
  useEffect(() => {
    let ignore = false;
    setArticles(null);
    setFailed(false);
    api.getEvergreenArticles(
      (list) => !ignore && setArticles(list),
      () => !ignore && setFailed(true),
      requestFilter,
    );
    return () => {
      ignore = true;
    }; // eslint-disable-next-line
  }, [userDetails, requestKey]);

  // A search that is one of the keywords shows as that keyword's pill, with
  // its delete button: right away, once the keywords load (a card's term
  // tapped early), or once a kept search is saved.
  useEffect(() => {
    if (activeFilter.type !== "search") return;
    const keyword = findSearch(activeFilter.value.search);
    if (keyword) setActiveFilter({ type: "keyword", value: keyword });
    // eslint-disable-next-line
  }, [subscribedSearches, activeFilter]);

  // Offered only once the keywords have loaded (see header).
  function keepSearch(term) {
    if (subscribeToSearch(term)) api.logUserActivity(api.SUBSCRIBE_TO_SEARCH, "", term, "evergreen");
  }

  // A 🔍 term on a card: the effect above turns it into its keyword pill.
  function selectSearch(term) {
    setActiveFilter({ type: "search", value: { search: term } });
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
      isSearchKept={activeFilter.type === "search" && isSearchKept(activeFilter.value.search)}
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
