import { useEffect, useState } from "react";
import ArticleOverview from "../articles/ArticlePreview";

export default function SimilarArticles({ article, api }) {
  const [similarArticleList, setSimilarArticleList] = useState(null);

  useEffect(() => {
    api.getSimilarArticles(article.id, (similarArticles) => {
      setSimilarArticleList(similarArticles);
      console.log(similarArticles);
    });
  }, [article]);
  if (similarArticleList && similarArticleList.length > 0)
    return (
      <>
        <h2>More articles like this: </h2>
        {similarArticleList.map((each) => (
          <ArticleOverview
            api={api}
            key={each.id}
            article={each}
            dontShowSourceIcon={false}
          />
        ))}
      </>
    );
  return <></>;
}
