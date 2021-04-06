import { useParams } from "react-router-dom";
import SortingButtons from "./SortingButtons";
import { useState } from "react";
import ArticlePreview from "./ArticlePreview";
import LoadingAnimation from "../components/LoadingAnimation";
import * as s from "./Search.sc";
import strings from "../i18n/definitions";

export default function Search({ api }) {
  const [articleList, setArticleList] = useState(null);

  let { term } = useParams();

  var originalList = null;

  if (articleList == null) {
    api.search(term, (articles) => {
      setArticleList(articles);
      originalList = [...articles];
    });

    return <LoadingAnimation text={strings.searching} />;
  }

  return (
    <>
      <s.TopMessage>
        {" "}
        {strings.youSearchedFor}{term}
        <s.ClosePopupButton onClick={(e) => (window.location = "/articles")}>
          X
        </s.ClosePopupButton>
      </s.TopMessage>

      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />

      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} api={api} />
      ))}
    </>
  );
}
