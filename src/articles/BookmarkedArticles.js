import { useState } from "react";

import Article from "./Article";

import * as s from "./Article.sc";

export default function BookmarkedArticles({ zapi }) {
  const [articleList, setArticleList] = useState(null);

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
      {articleList.map((each) => (
        <Article key={each.id} article={each} dontShowPublishingTime={true} />
      ))}
    </>
  );
}
