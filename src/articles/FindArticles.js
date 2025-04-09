import React, { useState, useEffect, useContext } from "react";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import LoadingAnimation from "../components/LoadingAnimation";

import LocalStorage from "../assorted/LocalStorage";

import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import { APIContext } from "../contexts/APIContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import useArticlePagination from "../hooks/useArticlePagination";
import UnfinishedArticlesList from "./UnfinishedArticleList";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useShadowRef from "../hooks/useShadowRef";
import { Link } from "react-router-dom";

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
    LocalStorage.getDoNotShowRedirectionModal() === "true";
  const [articleList, setArticleList] = useState();
  const [originalList, setOriginalList] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [isExtensionAvailable] = useExtensionCommunication();
  const [
    doNotShowRedirectionModal_UserPreference,
    setDoNotShowRedirectionModal_UserPreference,
  ] = useState(doNotShowRedirectionModal_LocalStorage);
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
        (error) => {
          console.log("Failed to get searches!");
          console.error(error);
        },
      );
    } else {
      api.getMoreUserArticles(20, pageNumber, handleArticleInsertion);
    }
  }

  function updateOnPagination(newUpdatedList) {
    setArticleList(newUpdatedList);
    setOriginalList(newUpdatedList);
  }

  const [
    handleScroll,
    isWaitingForNewArticles,
    noMoreArticlesToShow,
    resetPagination,
  ] = useArticlePagination(
    articleList,
    updateOnPagination,
    searchQuery ? "Article Search" : strings.titleHome,
    getNewArticlesForPage,
  );
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(
      doNotShowRedirectionModal_UserPreference,
    );
  }, [doNotShowRedirectionModal_UserPreference]);

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
          setArticleList(articles);
          setOriginalList([...articles]);
          setReloadingSearchArticles(false);
        },
        (error) => {
          console.log(error);
          console.log("Failed to get searches!");
          setArticleList([]);
          setOriginalList([]);
          setReloadingSearchArticles(false);
          setSearchError(true);
        },
      );
    } else {
      setTitle(strings.titleHome);
      api.getUserArticles((articles) => {
        setArticleList(articles);
        setOriginalList([...articles]);
      });
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
    // eslint-disable-next-line
  }, [searchPublishPriority, searchDifficultyPriority]);

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (searchError) {
    return (
      <>
        <s.SearchHolder>
          <SearchField query={searchQuery} />
        </s.SearchHolder>

        <b>
          An error occurred with this query. Please try a different keyword.
        </b>
      </>
    );
  }

  return (
    <>
      {!searchQuery && (
        <>
          <s.SearchHolder>
            <SearchField query={searchQuery} />
          </s.SearchHolder>
          <div style={{ marginBottom: "1.5rem", padding: "0.5rem" }}>
            <span>
              You can customize your Home by{" "}
              <Link
                className="bold underlined-link"
                to="/account_settings/interests?fromArticles=1"
              >
                subscribing&nbsp;to&nbsp;topics
              </Link>
              ,{" "}
              <Link
                className="bold underlined-link"
                to="/account_settings/excluded_keywords?fromArticles=1"
              >
                filtering&nbsp;keywords
              </Link>{" "}
              or{" "}
              <Link className="bold underlined-link" to="/articles/mySearches">
                adding&nbsp;searches
              </Link>
              .
            </span>
          </div>

          {!searchQuery && (
            <UnfinishedArticlesList
              articleList={articleList}
              setArticleList={setArticleList}
            />
          )}
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
          <SearchField query={searchQuery} />
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
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>No results were found for this query.</p>
        </div>
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
