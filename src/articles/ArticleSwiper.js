import SwiperArticlePreview from "./SwiperArticlePreview";
import React, { useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";

export default function ArticleSwiper({
  api,
  isExtensionAvailable,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  handleArticleClick,
}) {
  const [articleList, setArticleList] = useState(null);
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    api.getRecommendedArticles((articles) => {
      setArticleList(articles);
    });
  }, []);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handlePrevClick() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function handleArticleOpen() {}

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  let article = articleList[index];

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <SwiperArticlePreview
          key={article.id}
          article={article}
          api={api}
          hasExtension={isExtensionAvailable}
          doNotShowRedirectionModal_UserPreference={
            doNotShowRedirectionModal_UserPreference
          }
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
          handleArticleClick={handleArticleOpen}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <button style={{ fontSize: "1.5em" }} onClick={handlePrevClick}>
          Previous
        </button>
        <button style={{ fontSize: "1.5em" }} onClick={handleNextClick}>
          {" "}
          Next
        </button>
      </div>
    </>
  );
}
