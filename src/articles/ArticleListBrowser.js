import React, { useContext, useEffect, useRef, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useHistory, useLocation } from "react-router-dom";
import ArticlePreview from "./ArticlePreview";
import SearchField from "./SearchField";
import * as s from "./ArticleListBrowser.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FeedFilterBar from "./FeedFilterBar";

import { browsingModeProps } from "./browsingMode";
import LocalStorage from "../assorted/LocalStorage";

import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import NoArticlesForVariety from "./NoArticlesForVariety";
import { varietyFieldValue } from "../utils/misc/languageVariety";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import useArticlePagination from "../hooks/useArticlePagination";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useShadowRef from "../hooks/useShadowRef";
import VideoPreview from "../videos/VideoPreview";
import { getUserCefrLevel, numericToCefr } from "../utils/misc/userCefrLevel";
export default function ArticleListBrowser({
  content,
  searchQuery,
  searchPublishPriority,
  searchDifficultyPriority,
  // Kiosk mode: hide the topic filter bar and force articles to open in the
  // in-app reader (never the external publisher site).
  kioskMode,
}) {
  let api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);

  // A feed narrowed to one country explains its own emptiness; see
  // NoArticlesForVariety.
  const hasVarietyPreference = !!varietyFieldValue(userDetails, userDetails?.learned_language);

  //The ternary operator below fix the problem with the getOpenArticleExternallyWithoutModal()
  //getter that was outputting undefined string values when they should be false.
  //This occurs before the user selects their own preferences.
  //Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
  //in bool values changing on its own on refresh without any other external trigger or preferences change.
  // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const doNotShowRedirectionModal_LocalStorage = LocalStorage.getDoNotShowRedirectionModal() === "true";
  // Feed browsing mode (Developer setting): "interactive" (default inline
  // card), "preview" (teaser + overlay), or "titles" (compact row + overlay).
  // Kiosk keeps its own read-only rendering regardless.
  const browsingMode = kioskMode ? "interactive" : LocalStorage.getBrowsingMode();
  const [articlesAndVideosList, setArticlesAndVideosList] = useState();
  const [originalList, setOriginalList] = useState(null);
  const [searchError, setSearchError] = useState(false);

  const [isExtensionAvailable] = useExtensionCommunication();
  const [doNotShowRedirectionModal_UserPreference, setDoNotShowRedirectionModal_UserPreference] = useState(
    doNotShowRedirectionModal_LocalStorage,
  );
  const [reloadingSearchArticles, setReloadingSearchArticles] = useState(false);
  // Recommended-feed (re)load in progress — e.g. after tapping a topic pill.
  // Lets us drop the old articles and show the loader immediately for instant
  // feedback, rather than leaving the previous topic's list on screen.
  const [feedLoading, setFeedLoading] = useState(false);
  // Level change while on the feed: unlike a topic switch, keep the current
  // cards on screen (dimmed, under a "loading" pill) and swap them for the
  // new level's versions when they arrive. The nav's level pickers skip the
  // page reload on /articles for this; makes the difficulty change visible.
  const cefrLevel = getUserCefrLevel(userDetails, userDetails?.learned_language);
  const [levelReloading, setLevelReloading] = useState(false);
  const lastCefrLevelRef = useRef(cefrLevel);
  // The level the list on screen was fetched for -- not cefrLevel, which
  // changes before the new list arrives (see the ArticlePreview key).
  const [listCefrLevel, setListCefrLevel] = useState(cefrLevel);

  const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
  const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

  // Home-feed filter pills (only shown when this isn't an external search).
  // { type: "all" } | { type: "topic", value }.
  // A ref mirror is needed because getNewArticlesForPage is captured once by
  // the pagination hook and would otherwise see a stale filter.
  //
  // On the home feed the topic lives in the URL (/articles?topic=Culture%20%26%20Art),
  // so Back undoes a filter -- which matters once a topic on any card can set
  // one -- and a filtered feed can be linked to. LocalStorage still remembers
  // the last pick, so leaving the tab and coming back restores it.
  const location = useLocation();
  const history = useHistory();
  const filterInUrl = !searchQuery && !kioskMode;
  const urlTopic = filterInUrl ? new URLSearchParams(location.search).get("topic") : null;
  const topicFilter = (title) => (title ? { type: "topic", value: { title } } : { type: "all" });

  const [activeFilter, setActiveFilter] = useState(() => {
    if (urlTopic) return topicFilter(urlTopic);
    const savedTopic = LocalStorage.getSelectedFeedTopic();
    return savedTopic ? { type: "topic", value: savedTopic } : { type: "all" };
  });
  const activeFilterRef = useShadowRef(activeFilter);

  // A remembered topic restored on arrival goes into the URL too, replacing
  // (not pushing) so Back still leaves the feed rather than un-filtering it.
  useEffect(() => {
    if (filterInUrl && !urlTopic && activeFilter.type === "topic") {
      history.replace({ search: `?topic=${encodeURIComponent(activeFilter.value.title)}` });
    }
    // eslint-disable-next-line
  }, []);

  // The URL drives the filter from here on: a pill, a card's topic, Back and
  // Forward all land here. The first run is skipped -- it would see the URL
  // before the restore above has written the remembered topic into it.
  const urlSyncStarted = useRef(false);
  useEffect(() => {
    if (!filterInUrl) return;
    if (!urlSyncStarted.current) {
      urlSyncStarted.current = true;
      return;
    }
    const current = activeFilter.type === "topic" ? activeFilter.value.title : null;
    if (urlTopic === current) return;
    LocalStorage.setSelectedFeedTopic(urlTopic ? { title: urlTopic } : null);
    setActiveFilter(topicFilter(urlTopic));
    // eslint-disable-next-line
  }, [urlTopic]);

  // Persist topic selections (clear on "all") and update state -- via the URL
  // on the home feed, so each pick is a history entry Back can undo.
  function selectFilter(filter) {
    if (filterInUrl) {
      const title = filter.type === "topic" ? filter.value.title : null;
      history.push({ search: title ? `?topic=${encodeURIComponent(title)}` : "" });
      return;
    }
    LocalStorage.setSelectedFeedTopic(filter.type === "topic" ? filter.value : null);
    setActiveFilter(filter);
  }

  // Each loadArticles() call claims a token; only the latest applies its
  // results. Without this, switching pills fast lets a slower earlier response
  // (e.g. a saved-search query) land last and overwrite the feed the user
  // actually selected.
  const loadTokenRef = useRef(0);

  // Next three vars required for the "Show Videos Only" toggle button
  const [areVideosAvailable, setAreVideosAvailable] = useState(false);
  const [isShowVideosOnlyEnabled, setIsShowVideosOnlyEnabled] = useState(false);
  // Ref is needed since it's called in the updateOnPagination function. This function
  // could have stale values if using the state constant.
  const isShowVideosOnlyEnabledRef = useShadowRef(isShowVideosOnlyEnabled);

  function getNewArticlesForPage(pageNumber, handleArticleInsertion) {
    if (searchQuery) {
      api.searchMore(
        searchQuery,
        pageNumber,
        searchPublishPriorityRef.current,
        searchDifficultyPriorityRef.current,
        handleArticleInsertion,
        (error) => {},
      );
      return;
    }
    const filter = activeFilterRef.current;
    const options = filter.type === "topic" ? { topic: filter.value.title } : {};
    api.getMoreUserArticles(20, pageNumber, handleArticleInsertion, options);
  }

  function updateOnPagination(newUpdatedList) {
    if (isShowVideosOnlyEnabledRef.current) {
      const videosOnly = [...newUpdatedList].filter((each) => each.video);
      setArticlesAndVideosList(videosOnly);
    } else {
      setArticlesAndVideosList(newUpdatedList);
      setOriginalList(newUpdatedList);
    }
  }

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow, resetPagination] = useArticlePagination(
    articlesAndVideosList,
    updateOnPagination,
    searchQuery ? "Article Search" : strings.titleHome,
    getNewArticlesForPage,
    // Pause infinite scroll while the feed itself is (re)loading, so the hidden
    // list / collapsed page doesn't trigger a spurious load-more + 2nd spinner.
    feedLoading || reloadingSearchArticles || levelReloading,
  );

  function handleVideoOnlyClick() {
    setIsShowVideosOnlyEnabled(!isShowVideosOnlyEnabled);
    if (isShowVideosOnlyEnabled) {
      setArticlesAndVideosList(originalList);
      resetPagination();
    } else {
      const videosOnly = [...articlesAndVideosList].filter((each) => each.video);
      setArticlesAndVideosList(videosOnly);
    }
  }

  const handleArticleClick = (articleId, sourceId, index) => {
    const seenList = articlesAndVideosList.slice(0, index).map((each) => each.source_id);
    const seenListAsString = JSON.stringify(seenList, null, 0);
    api.logUserActivity(api.CLICKED_ARTICLE, articleId, "", seenListAsString, sourceId);
  };

  const handleVideoClick = (sourceId, index) => {
    const seenList = articlesAndVideosList.slice(0, index).map((each) => each.source_id);
    const seenListAsString = JSON.stringify(seenList, null, 0);
    api.logUserActivity(api.CLICKED_VIDEO, null, "", seenListAsString, sourceId);
  };

  const handleArticleHidden = (articleId) => {
    const updatedList = articlesAndVideosList.filter((item) => item.id !== articleId);
    setArticlesAndVideosList(updatedList);
    if (originalList) {
      const updatedOriginalList = originalList.filter((item) => item.id !== articleId);
      setOriginalList(updatedOriginalList);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(doNotShowRedirectionModal_UserPreference);
  }, [doNotShowRedirectionModal_UserPreference]);

  function loadArticles({ inPlace = false } = {}) {
    return new Promise((resolve) => {
      const myToken = ++loadTokenRef.current;
      const isStale = () => myToken !== loadTokenRef.current;
      resetPagination();
      setSearchError(false);
      // The external /search route drives the search endpoint; the home-feed
      // pills (topic / all) go through the recommended feed, with topic passed
      // as a filter.
      if (searchQuery) {
        setTitle(strings.titleSearch + ` '${searchQuery}'`);
        setFeedLoading(false);
        setReloadingSearchArticles(true);
        api.search(
          searchQuery,
          searchPublishPriority,
          searchDifficultyPriority,
          (articles) => {
            if (isStale()) return resolve();
            setArticlesAndVideosList(articles);
            setOriginalList([...articles]);
            setReloadingSearchArticles(false);
            articles.some((e) => e.video) ? setAreVideosAvailable(true) : setAreVideosAvailable(false);
            resolve();
          },
          (error) => {
            if (isStale()) return resolve();
            setArticlesAndVideosList([]);
            setOriginalList([]);
            setReloadingSearchArticles(false);
            setSearchError(true);
            resolve();
          },
        );
      } else {
        setTitle(strings.titleHome);
        // Clear any leftover search-loading state when leaving a search pill,
        // and show the loader straight away (dropping the previous list) for
        // instant feedback on a topic switch.
        setReloadingSearchArticles(false);
        if (inPlace) setLevelReloading(true);
        else setFeedLoading(true);
        const options = activeFilter.type === "topic" ? { topic: activeFilter.value.title } : {};
        const requestedCefrLevel = cefrLevel;
        api.getUserArticles((articles) => {
          if (isStale()) return resolve();
          setListCefrLevel(requestedCefrLevel);
          setArticlesAndVideosList(articles);
          setOriginalList([...articles]);
          setAreVideosAvailable(articles.some((e) => e.video));
          setFeedLoading(false);
          setLevelReloading(false);
          resolve();
        }, options);
      }
    });
  }

  useEffect(() => {
    loadArticles();
    if (!searchQuery) {
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
    // eslint-disable-next-line
  }, [searchQuery, searchPublishPriority, searchDifficultyPriority, activeFilter]);

  useEffect(() => {
    if (cefrLevel === lastCefrLevelRef.current) return;
    lastCefrLevelRef.current = cefrLevel;
    if (searchQuery) return;
    // The cached feed was built for the previous level.
    api.invalidateCache("user_articles/recommended");
    loadArticles({ inPlace: true });
    // eslint-disable-next-line
  }, [cefrLevel]);

  if (articlesAndVideosList == null) {
    // Shorter delay than the 1s default: swipe navigation slides the old tab
    // away and leaves a blank panel, so the spinner needs to land sooner.
    return <LoadingAnimation delay={300} />;
  }

  if (searchError) {
    return (
      <>
        <s.SearchHolder>
          <SearchField query={searchQuery} />
        </s.SearchHolder>

        <b>An error occurred with this query. Please try a different keyword.</b>
      </>
    );
  }

  // Pull-to-refresh should always hit the network — otherwise a cached
  // recommendations response (5-min TTL) keeps serving stale data and
  // the user can't see fresh results without restarting the app.
  const refreshFromNetwork = async () => {
    api.invalidateCache("user_articles/recommended");
    await loadArticles();
  };

  return (
    <>
      {/* The topic pills stay pinned above the refresh area, so pulling down
          shows the loading indicator below the pills (near the articles),
          not above them. */}
      {!searchQuery && !kioskMode && (
        <>
          <FeedFilterBar activeFilter={activeFilter} onSelectFilter={selectFilter} />
          {areVideosAvailable && (
            <s.SortHolder
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: window.innerWidth <= 768 ? "0" : "1.5rem",
                marginBottom: window.innerWidth <= 768 ? "0.5rem" : "1.5rem",
              }}
            >
              <s.ShowVideoOnlyButton
                className={isShowVideosOnlyEnabled && "selected"}
                onClick={handleVideoOnlyClick}
              >
                Show videos only
              </s.ShowVideoOnlyButton>
            </s.SortHolder>
          )}
        </>
      )}

      <PullToRefresh onRefresh={refreshFromNetwork} pullingContent="">
        <>
      {searchQuery && (
        <s.SearchHolder>
          <SearchField query={searchQuery} />
        </s.SearchHolder>
      )}

      {/* This is where the content of the Search component will be rendered */}
      {content}
      {(reloadingSearchArticles || feedLoading) && <LoadingAnimation delay={300}></LoadingAnimation>}
      <s.FeedArea>
      {levelReloading && (
        <s.LevelChangeOverlay>
          <s.LevelChangePill>Loading {numericToCefr(cefrLevel)} articles…</s.LevelChangePill>
        </s.LevelChangeOverlay>
      )}
      <s.FeedCards $dimmed={levelReloading}>
      {!reloadingSearchArticles &&
        !feedLoading &&
        articlesAndVideosList.map((each, index) =>
          each.video ? (
            // Kiosk mode is a read-only summary feed — skip playable videos.
            kioskMode ? null : (
              <VideoPreview key={each.id} video={each} notifyVideoClick={() => handleVideoClick(each.source_id, index)} />
            )
          ) : (
            <ArticlePreview
              // A card keeps its id across a level change (only its title and
              // summary change), so the key carries the level its data was
              // fetched for: the card remounts, and rebuilds its tokens, when
              // the new list lands. Keying on cefrLevel instead remounted it
              // early, on the old list, and then kept those stale tokens.
              key={`${each.id}-${listCefrLevel}`}
              article={each}
              hasExtension={isExtensionAvailable}
              kioskMode={kioskMode}
              {...browsingModeProps(browsingMode)}
              doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
              setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
              onArticleHidden={handleArticleHidden}
              onSelectTopic={
                filterInUrl
                  ? (topicTitle) => {
                      selectFilter(topicFilter(topicTitle));
                      window.scrollTo({ top: 0 });
                    }
                  : null
              }
              notifyArticleClick={() => handleArticleClick(each.id, each.source_id, index)}
            />
          ),
        )}
      </s.FeedCards>
      </s.FeedArea>
      {/* A feed narrowed by a variety says so below, in a sentence that names the
          country and offers somewhere to change it. This line would sit above
          that saying the same thing worse -- and talking about a "query" the
          reader never typed. */}
      {!reloadingSearchArticles && !feedLoading && !hasVarietyPreference && articlesAndVideosList.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>No results were found for this query.</p>
        </div>
      )}

      {!searchQuery && (
        <>
          {/* A feed emptied by a variety preference has its own explanation, and
              the generic "here are some news sites" advice would be wrong for it:
              the sources are not the problem, the filter is. */}
          <NoArticlesForVariety
            articleList={articlesAndVideosList}
            isLoading={reloadingSearchArticles || feedLoading || isWaitingForNewArticles}
            topicTitle={activeFilter.type === "topic" ? activeFilter.value.title : null}
          />
          {!hasVarietyPreference && (
            <ShowLinkRecommendationsIfNoArticles
              articleList={articlesAndVideosList}
            ></ShowLinkRecommendationsIfNoArticles>
          )}
        </>
      )}
      {isWaitingForNewArticles && <LoadingAnimation delay={0}></LoadingAnimation>}
      {noMoreArticlesToShow && articlesAndVideosList.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            margin: "2em 0px",
          }}
        >
          There are no more results.
        </div>
      )}
        </>
      </PullToRefresh>
    </>
  );
}
