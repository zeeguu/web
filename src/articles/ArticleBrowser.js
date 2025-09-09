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

export default function ArticleBrowser({ content, searchQuery, searchPublishPriority, searchDifficultyPriority }) {
    const api = useContext(APIContext);
    const location = useLocation();

    const [articlesAndVideosList, setArticlesAndVideosList] = useState();
    const [originalList, setOriginalList] = useState(null);
    const [searchError, setSearchError] = useState(false);
    const [reloadingSearchArticles, setReloadingSearchArticles] = useState(false);

    const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
    const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

    function getNewArticlesForPage(pageNumber, handleArticleInsertion) {
        if (searchQuery) {
            api.searchMore(
                searchQuery,
                pageNumber,
                searchPublishPriorityRef.current,
                searchDifficultyPriorityRef.current,
                handleArticleInsertion,
                () => {}
            );
        } else {
            api.getMoreUserArticles(20, pageNumber, handleArticleInsertion);
        }
    }

    function updateOnPagination(newUpdatedList) {
        setArticlesAndVideosList(newUpdatedList);
        setOriginalList(newUpdatedList);
    }

    const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow, resetPagination] = useArticlePagination(
        articlesAndVideosList,
        updateOnPagination,
        searchQuery ? "Article Search" : strings.titleHome,
        getNewArticlesForPage,
    );

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
            });
            window.addEventListener("scroll", handleScroll, true);
            return () => {
                window.removeEventListener("scroll", handleScroll, true);
            };
        }
    }, [searchPublishPriority, searchDifficultyPriority]);

    if (articlesAndVideosList == null) return <LoadingAnimation />;
    if (searchError) return <b>Something went wrong. Please try again.</b>;

    // Decide view based on path
    const isSwipeView = location.pathname.includes("swipe");

    return isSwipeView ? (
        <ArticleSwipeBrowser
            articles={articlesAndVideosList}
            reloading={reloadingSearchArticles}
            isWaiting={isWaitingForNewArticles}
            noMore={noMoreArticlesToShow}
        />
    ) : (
        <ArticleListBrowser
            articles={articlesAndVideosList}
            reloading={reloadingSearchArticles}
            isWaiting={isWaitingForNewArticles}
            noMore={noMoreArticlesToShow}
        />
    );
}
