import { useState } from "react";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

export default function NewArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  var originalList = null;

  //on initial render
  if (articleList == null) {
    api.getUserArticles((articles) => {
      setArticleList(articles);
      originalList = [...articles];
    });

    setTitle(strings.findArticles);

    return <LoadingAnimation />;
  }
  //when the user changes interests...
  function articlesListShouldChange() {
    setArticleList(null);
    api.getUserArticles((articles) => {
      setArticleList(articles);
      originalList = [...articles];
    });
  }

  return (
    <>
      <s.MaterialSelection>
        <Interests
          api={api}
          articlesListShouldChange={articlesListShouldChange}
        />

        <SearchField />
      </s.MaterialSelection>

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
