import ArticlePreview from "./ArticlePreview";
import React from "react";

export default function ArticleList({
  articleList,
  api,
  isExtensionAvailable,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  handleArticleClick,
}) {
  return (
    <>
      {articleList.map((each, index) => (
        <ArticlePreview
          key={each.id}
          article={each}
          api={api}
          hasExtension={isExtensionAvailable}
          doNotShowRedirectionModal_UserPreference={
            doNotShowRedirectionModal_UserPreference
          }
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
          onArticleClick={() => handleArticleClick(each.id, index)}
        />
      ))}
    </>
  );
}
