import React, { useContext, useEffect, useState } from "react";
import ArticlePreview from "./ArticlePreview";
import SearchField from "./SearchField";
import * as s from "./ArticleListBrowser.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import UnfinishedArticlesList from "./UnfinishedArticleList";
import VideoPreview from "../videos/VideoPreview";
import CustomizeFeed from "./CustomizeFeed";
import { APIContext } from "../contexts/APIContext";
import useShadowRef from "../hooks/useShadowRef";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

export default function ArticleListBrowser({
  // from ArticleBrowser or Search
  content,
  searchQuery,
  searchPublishPriority,
  searchDifficultyPriority,
  articles,
  setArticles,
  isWaiting,
  noMore,
  resetPagination,
  // interactions
  onArticleOpen,
  onArticleHidden,
  onArticleSave,
  // downstream UI needs
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
}) {
  const api = useContext(APIContext);

  // Search state
  const [searchResultArticleList, setSearchResultArticleList] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [reloadingSearchArticles, setReloadingSearchArticles] = useState(false);

  // Video filtering state
  const [originalList, setOriginalList] = useState(null);
  const [areVideosAvailable, setAreVideosAvailable] = useState(false);
  const [isShowVideosOnlyEnabled, setIsShowVideosOnlyEnabled] = useState(false);
  const isShowVideosOnlyEnabledRef = useShadowRef(isShowVideosOnlyEnabled);

  // Keep latest priorities for search
  const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
  const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

  // Get the actual articles to display
  const displayArticles = searchQuery ? searchResultArticleList : articles;

  const handleVideoOnlyClick = () => {
    setIsShowVideosOnlyEnabled(!isShowVideosOnlyEnabled);
    if (isShowVideosOnlyEnabled) {
      setArticles(originalList);
      resetPagination();
    } else {
      const videosOnly = [...articles].filter((each) => each.video);
      setArticles(videosOnly);
    }
  };

  const handleVideoClick = (sourceId, index) => {
    const seenList = articles.slice(0, index).map((each) => each.source_id);
    const seenListAsString = JSON.stringify(seenList, null, 0);
    api.logUserActivity(api.CLICKED_VIDEO, null, "", seenListAsString, sourceId);
  };

  // Handle search
  useEffect(() => {
    if (!searchQuery) return;

    let isMounted = true;

    setTitle(strings.titleSearch + ` '${searchQuery}'`);
    setReloadingSearchArticles(true);
    setSearchError(false);
    setSearchResultArticleList([]);

    api.search(
      searchQuery,
      searchPublishPriorityRef.current,
      searchDifficultyPriorityRef.current,
      (articles) => {
        if (!isMounted) return;
        setSearchResultArticleList(articles);
        setAreVideosAvailable(articles.some((e) => e.video));
        setReloadingSearchArticles(false);
      },
      (error) => {
        if (!isMounted) return;
        console.log(error.message);
        setSearchResultArticleList([]);
        setReloadingSearchArticles(false);
        setSearchError(true);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [searchQuery, searchPublishPriority, searchDifficultyPriority]);

  // Update originalList when articles change (for video toggle)
  useEffect(() => {
    if (!isShowVideosOnlyEnabledRef.current && !searchQuery) {
      setOriginalList(articles);
    }
  }, [articles, searchQuery]);
  if (isWaiting && displayArticles.length === 0) {
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
          <UnfinishedArticlesList articleList={displayArticles} setArticleList={() => {}} />
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
              onClick={handleVideoOnlyClick}
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

      {reloadingSearchArticles && <LoadingAnimation />}

      {!reloadingSearchArticles &&
        displayArticles.map((each, index) =>
          each.video ? (
            <VideoPreview key={each.id} video={each} notifyVideoClick={() => handleVideoClick(each.source_id, index)} />
          ) : (
            <ArticlePreview
              key={each.id}
              article={each}
              isListView={true}
              hasExtension={hasExtension}
              doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
              setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
              onArticleHidden={() => onArticleHidden(each.id)}
              onArticleSave={onArticleSave}
              notifyArticleClick={() => onArticleOpen(each.id, each.source_id, index)}
            />
          ),
        )}

      {!isWaiting && !reloadingSearchArticles && displayArticles.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>No results were found for this query.</p>
        </div>
      )}

      {!searchQuery && <ShowLinkRecommendationsIfNoArticles articleList={displayArticles} />}

      {isWaiting && <LoadingAnimation delay={0} />}

      {noMore && displayArticles.length > 0 && (
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
