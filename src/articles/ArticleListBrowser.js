import React, { useContext, useEffect, useRef, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import ArticlePreview from "./ArticlePreview";
import SearchField from "./SearchField";
import * as s from "./ArticleListBrowser.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FeedFilterBar from "./FeedFilterBar";

import LocalStorage from "../assorted/LocalStorage";

import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import { APIContext } from "../contexts/APIContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import useArticlePagination from "../hooks/useArticlePagination";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useShadowRef from "../hooks/useShadowRef";
import VideoPreview from "../videos/VideoPreview";
export default function ArticleListBrowser({ content, searchQuery, searchPublishPriority, searchDifficultyPriority }) {
  let api = useContext(APIContext);

  //The ternary operator below fix the problem with the getOpenArticleExternallyWithoutModal()
  //getter that was outputting undefined string values when they should be false.
  //This occurs before the user selects their own preferences.
  //Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
  //in bool values changing on its own on refresh without any other external trigger or preferences change.
  // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const doNotShowRedirectionModal_LocalStorage = LocalStorage.getDoNotShowRedirectionModal() === "true";
  const [articlesAndVideosList, setArticlesAndVideosList] = useState();
  const [originalList, setOriginalList] = useState(null);
  const [searchError, setSearchError] = useState(false);

  const [isExtensionAvailable] = useExtensionCommunication();
  const [doNotShowRedirectionModal_UserPreference, setDoNotShowRedirectionModal_UserPreference] = useState(
    doNotShowRedirectionModal_LocalStorage,
  );
  const [reloadingSearchArticles, setReloadingSearchArticles] = useState(false);

  const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
  const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

  // Home-feed filter pills (only shown when this isn't an external search).
  // { type: "all" } | { type: "topic", value } | { type: "search", value }.
  // A ref mirror is needed because getNewArticlesForPage is captured once by
  // the pagination hook and would otherwise see a stale filter.
  const [activeFilter, setActiveFilter] = useState({ type: "all" });
  const activeFilterRef = useShadowRef(activeFilter);

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

  function loadArticles() {
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
        // Clear any leftover search-loading state when leaving a search pill.
        setReloadingSearchArticles(false);
        const options = activeFilter.type === "topic" ? { topic: activeFilter.value.title } : {};
        api.getUserArticles((articles) => {
          if (isStale()) return resolve();
          setArticlesAndVideosList(articles);
          setOriginalList([...articles]);
          setAreVideosAvailable(articles.some((e) => e.video));
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

  if (articlesAndVideosList == null) {
    return <LoadingAnimation />;
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
    <PullToRefresh onRefresh={refreshFromNetwork} pullingContent="">
      <>
      {!searchQuery && (
        <>
          <FeedFilterBar activeFilter={activeFilter} onSelectFilter={setActiveFilter} />
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

      {searchQuery && (
        <s.SearchHolder>
          <SearchField query={searchQuery} />
        </s.SearchHolder>
      )}

      {/* This is where the content of the Search component will be rendered */}
      {content}
      {reloadingSearchArticles && <LoadingAnimation></LoadingAnimation>}
      {!reloadingSearchArticles &&
        articlesAndVideosList.map((each, index) =>
          each.video ? (
            <VideoPreview key={each.id} video={each} notifyVideoClick={() => handleVideoClick(each.source_id, index)} />
          ) : (
            <ArticlePreview
              key={each.id}
              article={each}
              hasExtension={isExtensionAvailable}
              doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
              setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
              onArticleHidden={handleArticleHidden}
              notifyArticleClick={() => handleArticleClick(each.id, each.source_id, index)}
            />
          ),
        )}
      {!reloadingSearchArticles && articlesAndVideosList.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>No results were found for this query.</p>
        </div>
      )}

      {!searchQuery && (
        <>
          <ShowLinkRecommendationsIfNoArticles
            articleList={articlesAndVideosList}
          ></ShowLinkRecommendationsIfNoArticles>
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
  );
}
