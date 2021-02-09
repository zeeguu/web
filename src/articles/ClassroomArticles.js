import { useState } from "react";

import ArticleOverview from "./ArticleOverview";

import SortingButtons from "./SortingButtons";

export default function ClassroomArticles({ zapi }) {
  const [articleList, setArticleList] = useState(null);

  let originalList = articleList;

  if (articleList == null) {
    zapi.getCohortArticles((articles) => {
      console.log(articles);
      setArticleList(articles);
    });

    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  if (articleList.length === 0) {
    return <div>no articles found</div>;
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
        <ArticleOverview key={each.id} article={each} dontShowImage={true} />
      ))}
    </>
  );
}
