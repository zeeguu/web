import { useParams } from "react-router-dom";
import SortingButtons from "./SortingButtons";
import { useState } from "react";
import ArticleOverview from "./ArticleOverview";

export default function Search({ zapi }) {
  const [articleList, setArticleList] = useState(null);

  let { term } = useParams();

  var originalList = null;

  if (articleList == null) {
    zapi.search(term, (articles) => {
      setArticleList(articles);
      originalList = [...articles];
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
      <div className="searchText articleLinkEntry">
        You searched for: {term}
        <button
          className="deleteSearch headerElement"
          onClick={(e) => (window.location = "/articles")}
        >
          X
        </button>
      </div>

      <br />
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
