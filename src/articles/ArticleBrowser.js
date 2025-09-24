import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import useArticlePagination from "../hooks/useArticlePagination";
import strings from "../i18n/definitions";
import useShadowRef from "../hooks/useShadowRef";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleListBrowser from "./ArticleListBrowser";
import ArticleSwipeBrowser from "./ArticleSwipeBrowser";
import LocalStorage from "../assorted/LocalStorage";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import {setTitle} from "../assorted/setTitle";

export default function ArticleBrowser({
    articlesAndVideosList = [],
    setArticlesAndVideosList  = () => {},
    originalList = [],
    setOriginalList = ([]) => {},
    isSwipeView = false,
    content,
    searchQuery,
    searchPublishPriority,
    searchDifficultyPriority })
{
  const api = useContext(APIContext);

  // UI and logic state
  const [searchResultArticleList, setSearchResultArticleList] = useState([])
  const [searchError, setSearchError] = useState(false);
  const [reloadingSearchArticles, setReloadingSearchArticles] = useState(false);

  const [isExtensionAvailable] = useExtensionCommunication();

  // video toggle
  // Next three vars required for the "Show Videos Only" toggle button
  const [areVideosAvailable, setAreVideosAvailable] = useState(false);
  const [isShowVideosOnlyEnabled, setIsShowVideosOnlyEnabled] = useState(false);
  // Ref is needed since it's called in the updateOnPagination function. This function
  // could have stale values if using the state constant.
  const isShowVideosOnlyEnabledRef = useShadowRef(isShowVideosOnlyEnabled);

  // modal pref
  //The ternary operator below fix the problem with the getOpenArticleExternallyWithoutModal()
  //getter that was outputting undefined string values when they should be false.
  //This occurs before the user selects their own preferences.
  //Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
  //in bool values changing on its own on refresh without any other external trigger or preferences change.
  // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const doNotShowRedirectionModal_LocalStorage = LocalStorage.getDoNotShowRedirectionModal() === "true";
  const [doNotShowRedirectionModal_UserPreference, setDoNotShowRedirectionModal_UserPreference] = useState(
    doNotShowRedirectionModal_LocalStorage,
  );

  // keep latest priorities for infinite scroll searchmore
  const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
  const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

  // exclude hidden and saved article from the homepage
    const shouldShow = (a) =>
        ![true, "true"].includes(a?.hidden) &&
        ![true, "true"].includes(a?.has_personal_copy);

  // pagination helpers
  function getNewArticlesForPage(pageNumber, handleArticleInsertion) {
    if (searchQuery) {
      api.searchMore(
        searchQuery,
        pageNumber,
        searchPublishPriorityRef.current,
        searchDifficultyPriorityRef.current,
        handleArticleInsertion,
        (error) => {
            // currently no error handling
        },
      );
    } else {
      api.getMoreUserArticles(20, pageNumber, handleArticleInsertion);
    }
  }

  function updateOnPagination(newUpdatedList) {
    const filtered = (newUpdatedList || []).filter(shouldShow);
    if (isShowVideosOnlyEnabledRef.current) {
      // const videosOnly = [...newUpdatedList].filter((each) => each.video);
      // setArticlesAndVideosList(videosOnly);
      setArticlesAndVideosList(filtered.filter((e) => e.video));
    } else {
      setArticlesAndVideosList(filtered);
      setOriginalList(filtered);
    }
  }

  const [
      handleScroll,
      isWaitingForNewArticles,
      noMoreArticlesToShow,
      resetPagination,
      loadNextPage,
  ] = useArticlePagination(
      searchQuery ? searchResultArticleList : articlesAndVideosList,
      updateOnPagination,
      searchQuery ? "Article Search" : strings.titleHome,
      getNewArticlesForPage,
      shouldShow,
  );

  // UI functions
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
      api.hideArticle(articleId, () => {
          // backend acknowledged → nothing else to do
      });
  };

    const handleArticleSave = (articleId, saved) => {
        setArticlesAndVideosList((prev) =>
            prev?.map((e) => (e.id === articleId ? { ...e, has_personal_copy: saved } : e))
                .filter(shouldShow) ?? prev
        );
        setOriginalList((prev) =>
          prev ? prev.map((e) => (e.id === articleId ? { ...e, has_personal_copy: saved } : e)) : prev,
        );
      };

      // persist user pref for redirection modal
    useEffect(() => {
        LocalStorage.setDoNotShowRedirectionModal(doNotShowRedirectionModal_UserPreference);
        }, [doNotShowRedirectionModal_UserPreference]);

    // always trigger first page for homepage
    useEffect(() => {
        if (!searchQuery) {
            loadNextPage();
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (!isSwipeView) {
            window.addEventListener("scroll", handleScroll, true);
        }

        return () => {
            isMounted = false;
            if (!isSwipeView) {
                window.removeEventListener("scroll", handleScroll, true);
            }
        };
    }, [handleScroll, isSwipeView]);

    useEffect(() => {
        if (!searchQuery) return;

        let isMounted = true;

        setTitle(strings.titleSearch + ` '${searchQuery}'`);
        setReloadingSearchArticles(true);
        setSearchError(false);
        setSearchResultArticleList([]);

        api.search(
            searchQuery,
            searchPublishPriorityRef.current,
            searchDifficultyPriorityRef.current,
            (articles) => {
                if (!isMounted) return;
                setSearchResultArticleList(articles);
                setAreVideosAvailable(articles.some((e) => e.video));
                setReloadingSearchArticles(false);
            },
            (error) => {
                if (!isMounted) return;

                setSearchResultArticleList([]);
                setReloadingSearchArticles(false);
                setSearchError(true);
            }
        );

        return () => {
            isMounted = false;
        };
    }, [searchQuery, searchPublishPriority, searchDifficultyPriority]);


    if (articlesAndVideosList == null) return <LoadingAnimation />;
    if (searchError) return <b>Something went wrong. Please try again.</b>;

  return isSwipeView ? (
    <ArticleSwipeBrowser
      articles={articlesAndVideosList}
      onArticleClick={handleArticleClick}
      onArticleHidden={handleArticleHidden}
      onArticleSave={handleArticleSave}
      loadNextPage={loadNextPage}
      isWaiting={isWaitingForNewArticles}
      noMore={noMoreArticlesToShow}
        // downstream UI needs
      hasExtension={isExtensionAvailable}
      doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
      setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
    />
  ) : (
    <ArticleListBrowser
      content={content}
      searchQuery={searchQuery}
      articles={searchQuery ? searchResultArticleList : articlesAndVideosList}
      reloading={reloadingSearchArticles}
      isWaiting={isWaitingForNewArticles}
      noMore={noMoreArticlesToShow}
      searchError={searchError}
      // video UI
      areVideosAvailable={areVideosAvailable}
      isShowVideosOnlyEnabled={isShowVideosOnlyEnabled}
      onToggleVideosOnly={handleVideoOnlyClick}
      // interactions
      onArticleClick={handleArticleClick}
      onVideoClick={handleVideoClick}
      onArticleHidden={handleArticleHidden}
      // downstream UI needs
      hasExtension={isExtensionAvailable}
      doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
      setDoNotShowRedirectionModal={setDoNotShowRedirectionModal_UserPreference}
    />
  );
}
