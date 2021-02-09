import { useState } from "react";

import ArticleOverview from "./ArticleOverview";

import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./NewArticles.sc";

export default function NewArticles({ zapi }) {
  const [articleList, setArticleList] = useState(null);

  var originalList = null;

  if (articleList == null) {
    zapi.getUserArticles((articles) => {
      console.log(articles);
      setArticleList(articles);
      originalList = [...articles];
    });

    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  function articlesListShouldChange() {
    setArticleList(null);
    zapi.getUserArticles((articles) => {
      setArticleList(articles);
      originalList = [...articles];
    });
  }

  return (
    <>
      <s.MaterialSelection>
        <Interests
          zapi={zapi}
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
        <ArticleOverview key={each.id} article={each} />
      ))}
    </>
  );
}
