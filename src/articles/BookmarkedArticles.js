import { useState } from "react";

import Article from "./Article";

import SortingButtons from "./SortingButtons";

export default function BookmarkedArticles({ zapi }) {
  const [articleList, setArticleList] = useState(null);

  let originalList = articleList;

  if (articleList == null) {
    zapi.getBookmarkedArticles((articles) => {
      console.log(articles);
      setArticleList(articles);
    });

    return (
      <div>
        <p>loading...</p>
      </div>
    );
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
        <Article key={each.id} article={each} dontShowPublishingTime={true} />
      ))}
    </>
  );
}
