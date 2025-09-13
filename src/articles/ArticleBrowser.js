import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import useArticlePagination from "../hooks/useArticlePagination";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useShadowRef from "../hooks/useShadowRef";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleListBrowser from "./ArticleListBrowser";
import ArticleSwipeBrowser from "./ArticleSwipeBrowser";
import LocalStorage from "../assorted/LocalStorage";
import useExtensionCommunication from "../hooks/useExtensionCommunication";

export default function ArticleBrowser({ content, searchQuery, searchPublishPriority, searchDifficultyPriority }) {
    const api = useContext(APIContext);
    const location = useLocation();

    // UI and logiv state
    const [articlesAndVideosList, setArticlesAndVideosList] = useState();
    const [originalList, setOriginalList] = useState(null);
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
    const [doNotShowRedirectionModal_UserPreference, setDoNotShowRedirectionModal_UserPreference] = useState(doNotShowRedirectionModal_LocalStorage);

    // keep latest priorities for infinite scroll searchmore
    const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
    const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

    // pagination helpers
    function getNewArticlesForPage(pageNumber, handleArticleInsertion) {
        if (searchQuery) {
            api.searchMore(
                searchQuery,
                pageNumber,
                searchPublishPriorityRef.current,
                searchDifficultyPriorityRef.current,
                handleArticleInsertion,
                (error) => {}
            );
        } else {
            api.getMoreUserArticles(20, pageNumber, handleArticleInsertion);
        }
    }

    function updateOnPagination(newUpdatedList) {
        if (isShowVideosOnlyEnabledRef.current) {
            const videosOnly = [...newUpdatedList].filter((each) => each.video);
            setArticlesAndVideosList(videosOnly);
        } else  {
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
    };

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

    // persist user pref for redirection modal
    useEffect(() => {
        LocalStorage.setDoNotShowRedirectionModal(doNotShowRedirectionModal_UserPreference);
    }, [doNotShowRedirectionModal_UserPreference]);

    // initial load + reacting to priority changes
    useEffect(() => {
        resetPagination();
        setSearchError(false);

        if (searchQuery) {
            setTitle(strings.titleSearch + ` '${searchQuery}'`);
            setReloadingSearchArticles(true);
            api.search(
                searchQuery,
                searchPublishPriority,
                searchDifficultyPriority,
                (articles) => {
                    setArticlesAndVideosList(articles);
                    setOriginalList([...articles]);
                    setReloadingSearchArticles(false);
                    articles.some((e) => e.video) ? setAreVideosAvailable(true) : setAreVideosAvailable(false);
                },
                (error) => {
                    setArticlesAndVideosList([]);
                    setOriginalList([]);
                    setReloadingSearchArticles(false);
                    setSearchError(true);
                },
            );
        } else {
            setTitle(strings.titleHome);
            api.getUserArticles((articles) => {
                setArticlesAndVideosList(articles);
                setOriginalList([...articles]);
                articles.some((e) => e.video) ? setAreVideosAvailable(true) : setAreVideosAvailable(false);
            });

            // attach scroll for home feed
            window.addEventListener("scroll", handleScroll, true);
            return () => {
                window.removeEventListener("scroll", handleScroll, true);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPublishPriority, searchDifficultyPriority]);

    if (articlesAndVideosList == null) return <LoadingAnimation />;
    if (searchError) return <b>Something went wrong. Please try again.</b>;

    // Decide view based on path
    const isSwipeView = location.pathname.includes("swiper");

    return isSwipeView ? (
        <ArticleSwipeBrowser
            articles={articlesAndVideosList}
            reloading={reloadingSearchArticles}
            isWaiting={isWaitingForNewArticles}
            noMore={noMoreArticlesToShow}
        />
    ) : (
        <ArticleListBrowser
            content={content}
            searchQuery={searchQuery}
            articles={articlesAndVideosList}
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
