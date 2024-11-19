import { useEffect, useState } from "react";
import useShadowRef from "../hooks/useShadowRef";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";
import useEndlessScrolling from "../hooks/useEndlessScrolling";
import { ADD_ACTIONS } from "../utils/endlessScrolling/add_actions";

export default function OwnArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow] =
    useEndlessScrolling(api, articleList, setArticleList, "Saved Articles");

  useEffect(() => {
    setTitle("Saved Articles");
    api.getSavedUserArticles(0, (articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
    window.addEventListener(
      "scroll",
      handleScroll(ADD_ACTIONS.ADD_SAVED_ARTICLES),
      true,
    );
    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll(ADD_ACTIONS.ADD_SAVED_ARTICLES),
        true,
      );
    };
  }, []);

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.TopMessage>{strings.noOwnArticles}</s.TopMessage>;
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      {articleList.map((each) => (
        <ArticlePreview
          api={api}
          key={each.id}
          article={each}
          dontShowSourceIcon={true}
        />
      ))}
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
          There are no more saved articles.
        </div>
      )}
    </>
  );
}
