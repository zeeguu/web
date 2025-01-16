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
import useSelectInterest from "../hooks/useSelectInterest";

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
  const [isExtensionAvailable] = useExtensionCommunication();
  const { allTopics } = useSelectInterest(api);
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

  const [
    handleScroll,
    isWaitingForNewArticles,
    noMoreArticlesToShow,
    resetPagination,
  ] = useArticlePagination(
    api,
    articleList,
    setArticleList,
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
  }, []);

  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(
      doNotShowRedirectionModal_UserPreference,
    );
  }, [doNotShowRedirectionModal_UserPreference]);

  useEffect(() => {
    resetPagination();
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
  }, [searchPublishPriority, searchDifficultyPriority]);

  if (articleList == null || allTopics == null) {
    return <LoadingAnimation />;
  }

  return (
    <>
      {!searchQuery && (
        <>
          <s.SearchHolder>
            <SearchField api={api} query={searchQuery} />
          </s.SearchHolder>
          <div style={{ marginBottom: "1.5rem", padding: "0.5rem" }}>
            <span>
              You can customize your Home by{" "}
              {allTopics.length > 0 && (
                <>
                  <a href="/account_settings/interests?fromArticles=1">
                    subscribing&nbsp;to&nbsp;topics
                  </a>
                  ,{" "}
                </>
              )}
              <a href="/account_settings/excluded_keywords?fromArticles=1">
                filtering&nbsp;keywords
              </a>{" "}
              or <a href="articles/mySearches">adding&nbsp;searches</a>.
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
        <p>Sorry, we couldn't find any articles for you.</p>
      )}

      {!searchQuery && (
        <>
          <ShowLinkRecommendationsIfNoArticles
            articleList={articleList}
            isExtensionAvailable={isExtensionAvailable}
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
