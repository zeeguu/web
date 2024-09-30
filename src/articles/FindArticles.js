import React, { useState, useEffect, useContext } from "react";
import useShadowRef from "../hooks/useShadowRef";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import LoadingAnimation from "../components/LoadingAnimation";

import LocalStorage from "../assorted/LocalStorage";

import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import { APIContext } from "../contexts/APIContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import UnfinishedArticlesList from "./UnfinishedArticleList";

export default function FindArticles({
  content,
  searchQuery,
  searchPublishPriority,
  searchDifficultyPriority,
}) {
  let api = useContext(APIContext);

  //The ternary operator below fix the problem with the getOpenArticleExternallyWithoutModal()
  //getter that was outputting undefined string values when they should be false.
  //This occurs before the user selects their own preferences.
  //Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
  //in bool values changing on its own on refresh without any other external trigger or preferences change.
  // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const doNotShowRedirectionModal_LocalStorage =
    LocalStorage.getDoNotShowRedirectionModal() === "true" ? true : false;
  const [articleList, setArticleList] = useState();
  const [originalList, setOriginalList] = useState(null);
  const [isExtensionAvailable] = useExtensionCommunication();
  const [
    doNotShowRedirectionModal_UserPreference,
    setDoNotShowRedirectionModal_UserPreference,
  ] = useState(doNotShowRedirectionModal_LocalStorage);
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [reloadingSearchArticles, setReloadingSearchArticles] = useState(false);
  const [noMoreArticlesToShow, setNoMoreArticlesToShow] = useState(false);
  const articleListRef = useShadowRef(articleList);
  const currentPageRef = useShadowRef(currentPage);
  const noMoreArticlesToShowRef = useShadowRef(noMoreArticlesToShow);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);

  const handleArticleClick = (articleId, index) => {
    const articleSeenList = articleList
      .slice(0, index)
      .map((article) => article.id);
    const articleSeenListString = JSON.stringify(articleSeenList, null, 0);
    api.logUserActivity(
      api.CLICKED_ARTICLE,
      articleId,
      "",
      articleSeenListString,
    );
  };
  function handleScroll() {
    let scrollBarPixelDistToPageEnd = getPixelsFromScrollBarToEnd();
    let articlesHaveBeenFetched =
      currentPageRef.current !== undefined &&
      articleListRef.current !== undefined;

    if (
      scrollBarPixelDistToPageEnd <= 50 &&
      !isWaitingForNewArticlesRef.current &&
      !noMoreArticlesToShowRef.current &&
      articlesHaveBeenFetched
    ) {
      setIsWaitingForNewArticles(true);
      document.title = "Getting more articles...";

      let newCurrentPage = currentPageRef.current + 1;
      let newArticles = [...articleListRef.current];

      if (searchQuery) {
        api.searchMore(
          searchQuery,
          newCurrentPage,
          searchPublishPriority,
          searchDifficultyPriority,
          (articles) => {
            insertNewArticlesIntoArticleList(
              articles,
              newCurrentPage,
              newArticles,
            );
          },
          (error) => {
            console.log("Failed to get searches!");
          },
        );
      } else {
        api.getMoreUserArticles(20, newCurrentPage, (articles) => {
          insertNewArticlesIntoArticleList(
            articles,
            newCurrentPage,
            newArticles,
          );
        });
      }
    }
  }

  function insertNewArticlesIntoArticleList(
    fetchedArticles,
    newCurrentPage,
    newArticles,
  ) {
    if (fetchedArticles.length === 0) {
      setNoMoreArticlesToShow(true);
    }
    newArticles = newArticles.concat(fetchedArticles);
    setArticleList(newArticles);
    setOriginalList([...newArticles]);
    setCurrentPage(newCurrentPage);
    setIsWaitingForNewArticles(false);
    document.title = "Recommend Articles: Zeeguu";
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(
      doNotShowRedirectionModal_UserPreference,
    );
  }, [doNotShowRedirectionModal_UserPreference]);

  useEffect(() => {
    if (searchQuery) {
      setReloadingSearchArticles(true);
      api.search(
        searchQuery,
        searchPublishPriority,
        searchDifficultyPriority,
        (articles) => {
          setArticleList(articles);
          setOriginalList([...articles]);
          setReloadingSearchArticles(false);
        },
        (error) => {
          console.log(error);
          console.log("Failed to get searches!");
        },
      );
    } else {
      api.getUserArticles((articles) => {
        setArticleList(articles);
        setOriginalList([...articles]);
      });
    }

    document.title = "Recommend Articles: Zeeguu";
  }, [searchPublishPriority, searchDifficultyPriority]);

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  //when the user changes interests...
  function articlesListShouldChange() {
    setArticleList(null);
    api.getUserArticles((articles) => {
      setArticleList(articles);
      setOriginalList([...articles]);
    });
  }

  return (
    <>
      {!searchQuery && (
        <>
          <Interests
            api={api}
            articlesListShouldChange={articlesListShouldChange}
          />
          <s.SearchHolder>
            <SearchField api={api} query={searchQuery} />
          </s.SearchHolder>
          {!searchQuery && <UnfinishedArticlesList />}
          <s.SortHolder>
            <SortingButtons
              articleList={articleList}
              originalList={originalList}
              setArticleList={setArticleList}
            />
          </s.SortHolder>
        </>
      )}

      {searchQuery && (
        <s.SearchHolder>
          <SearchField api={api} query={searchQuery} />
        </s.SearchHolder>
      )}

      {/* This is where the content of the Search component will be rendered */}
      {content}
      {reloadingSearchArticles && <LoadingAnimation></LoadingAnimation>}
      {!reloadingSearchArticles &&
        articleList.map((each, index) => (
          <ArticlePreview
            key={each.id}
            article={each}
            api={api}
            hasExtension={isExtensionAvailable}
            doNotShowRedirectionModal_UserPreference={
              doNotShowRedirectionModal_UserPreference
            }
            setDoNotShowRedirectionModal_UserPreference={
              setDoNotShowRedirectionModal_UserPreference
            }
            onArticleClick={() => handleArticleClick(each.id, index)}
          />
        ))}
      {!reloadingSearchArticles && articleList.length === 0 && (
        <p>No searches were found for this query.</p>
      )}

      {!searchQuery && (
        <>
          <ShowLinkRecommendationsIfNoArticles
            articleList={articleList}
          ></ShowLinkRecommendationsIfNoArticles>
        </>
      )}
      {isWaitingForNewArticles && (
        <LoadingAnimation delay={0}></LoadingAnimation>
      )}
      {noMoreArticlesToShow && articleList.length > 0 && (
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
  );
}
