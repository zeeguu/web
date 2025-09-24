import React from "react";
import ArticlePreview from "./ArticlePreview";
import SearchField from "./SearchField";
import * as s from "./ArticleListBrowser.sc";
import LoadingAnimation from "../components/LoadingAnimation";

// import LocalStorage from "../assorted/LocalStorage";

import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
// import { APIContext } from "../contexts/APIContext";
// import useExtensionCommunication from "../hooks/useExtensionCommunication";
// import useArticlePagination from "../hooks/useArticlePagination";
import UnfinishedArticlesList from "./UnfinishedArticleList";
// import { setTitle } from "../assorted/setTitle";
// import strings from "../i18n/definitions";
// import useShadowRef from "../hooks/useShadowRef";
import VideoPreview from "../videos/VideoPreview";
import CustomizeFeed from "./CustomizeFeed";

export default function ArticleListBrowser({ 
  // from ArticleBrowser
  content,
  searchQuery,
  articles, 
  reloading,
  isWaiting,
  noMore,
  searchError,
  // video UI
  areVideosAvailable,
  isShowVideosOnlyEnabled,
  onToggleVideosOnly,
  // interactions
  onArticleClick,
  onVideoClick,
  onArticleHidden,
  // downstream UI needs
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference
  }) {
    if (isWaiting && articles.length === 0) {
      return <LoadingAnimation />;
    }

    if (searchError) {
      return (
        <>
          <s.SearchHolder>
            <SearchField query={searchQuery} />
          </s.SearchHolder>
          <b>An error occured with this query. Please try a different keyword.</b>
        </>
      );
    }

    return (
      <>
        {!searchQuery && (
        <>
          {/* Unfinished drafts and feed customization remain as UI */}
          <UnfinishedArticlesList articleList={articles} setArticleList={() => {}} />
          <s.SortHolder
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: window.innerWidth <= 768 ? "0" : "1.5rem",
              marginBottom: window.innerWidth <= 768 ? "0.5rem" : "1.5rem",
            }}
          >
            <CustomizeFeed />
            <s.ShowVideoOnlyButton
              className={isShowVideosOnlyEnabled && "selected"}
              style={{ visibility: !areVideosAvailable && "hidden" }}
              onClick={onToggleVideosOnly}
            >
              Show videos only
            </s.ShowVideoOnlyButton>
          </s.SortHolder>
        </>
      )}

      {searchQuery && (
        <s.SearchHolder>
            <SearchField query={searchQuery} />
        </s.SearchHolder>
      )}

      {/* Slot for extra content above the list */}
      {content}

      {reloading && <LoadingAnimation />}

      {!reloading &&
        articles.map((each, index) =>
          each.video ? (
            <VideoPreview
              key={each.id}
              video={each}
              notifyVideoClick={() => onVideoClick(each.source_id, index)}
            />
          ) : (
            <ArticlePreview
              key={each.id}
              article={each}
              isListView={true}
              hasExtension={hasExtension}
              doNotShowRedirectionModal_UserPreference={
                doNotShowRedirectionModal_UserPreference
              }
              setDoNotShowRedirectionModal_UserPreference={
                setDoNotShowRedirectionModal_UserPreference
              }
              onArticleHidden={() => onArticleHidden(each.id)}
              notifyArticleClick={() =>
                onArticleClick(each.id, each.source_id, index)
              }
            />
          )
        )}

      {!isWaiting && !reloading && articles.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>No results were found for this query.</p>
        </div>
      )}

      {!searchQuery && (
        <ShowLinkRecommendationsIfNoArticles articleList={articles} />
      )}

      {isWaiting && <LoadingAnimation delay={0} />}

      {noMore && articles.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            margin: "2em 0px",
          }}
        >
          There are no more results.
        </div>
      )}
    </>
  );
}
