import { useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions" 

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";

export default function ClassroomArticles({ api }) {
  const [articleList, setArticleList] = useState(null);

  let originalList = articleList;

  if (articleList == null) {
    api.getCohortArticles((articles) => {
      setArticleList(articles);
    });

    setTitle("Classroom Articles");

    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.TopMessage>{strings.noArticlesInClassroom}</s.TopMessage>;
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
        <ArticlePreview key={each.id} article={each} dontShowImage={true} />
      ))}
    </>
  );
}
