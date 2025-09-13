import React, { useEffect, useState } from "react";
import * as s from "./ArticleSwipeBrowser.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticlePreview from "./ArticlePreview";
import ArticleSwipeControl from "../components/article_swipe/ArticleSwipeControl";

// should not be here
import { isMobile } from "../utils/misc/browserDetection";
import Feature from "../features/Feature";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";

export default function ArticleSwipeBrowser({
  articles,
  onArticleClick,
  onArticleHidden,
  onArticleSave,
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
}) {
  // const api = useContext(APIContext);

  //const [articles, setArticles] = useState(null);
  //const [originalList, setOriginalList] = useState(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  //const [shouldLoadNewArticles, setShouldLoadNewArticles] = useState(false);

  // these will be removed when we decided on a clear structure
  const [isRedirectionModalOpen, setIsRedirectionModalOpen] = useState(false);

  // keep index valid whenever list changes (e.g., after dismiss)
  useEffect(() => {
    if (!Array.isArray(articles)) return;
    if (articles.length === 0) {
      setCurrentArticleIndex(0);
      return;
    }
    if (currentArticleIndex >= articles.length) {
      setCurrentArticleIndex(Math.max(0, articles.length - 1));
    }
  }, [articles, currentArticleIndex]);

  // useEffect(() => {
  //   setTitle(strings.titleHome);
  //   api.getUserArticles((fetchedArticles) => {
  //     setArticles(fetchedArticles);
  //     setOriginalList([...fetchedArticles]);
  //     setShouldLoadNewArticles(false);
  //   });
  // }, [api, shouldLoadNewArticles]);

  // set the title when this view mounts
  // useEffect(() => {
  //   setTitle(strings.titleHome);
  // }, []);

  // useEffect(() => {
  //   if (articles && currentArticleIndex >= articles.length - 1) {
  //     setShouldLoadNewArticles(true);
  //   }
  // }, [currentArticleIndex, articles]);

  if (!articles) return <LoadingAnimation />;
  if (articles.length === 0) return <p>No more articles</p>;

  const currentArticle = articles[currentArticleIndex];
  if (!currentArticle) return <LoadingAnimation />;

  // if (currentArticleIndex >= articles.length) return <p>No more articles</p>;

  // const handleNextArticle = () => {
  //   setCurrentArticleIndex((prev) => Math.min(prev + 1, articles.length));
  // };

  // const handleArticleClick = (articleId, sourceId) => {
  //   const seenList = articles.slice(0, currentArticleIndex).map((each) => each.source_id);
  //   const seenListAsString = JSON.stringify(seenList, null, 0);
  //   api.logUserActivity(api.CLICKED_ARTICLE, articleId, "", seenListAsString, sourceId);
  // };

  const handleOpen = () => {
    onArticleClick?.(currentArticle.id, currentArticle.source_id, currentArticleIndex);

    const shouldOpenInZeeguu =
      currentArticle.video ||
      (!Feature.extension_experiment1() && !hasExtension) ||
      currentArticle.has_personal_copy ||
      currentArticle.has_uploader ||
      currentArticle.parent_article_id;

    const shouldOpenWithModal = doNotShowRedirectionModal_UserPreference === false;

    if (shouldOpenInZeeguu) {
      // no useNavigate: just set location (full reload)
      window.location.href = `/read/article?id=${currentArticle.id}`;
    } else if (shouldOpenWithModal) {
      setIsRedirectionModalOpen(true);
    } else if (currentArticle.url) {
      window.open(currentArticle.url, isMobile ? "_self" : "_blank", "noopener,noreferrer");
    }
  };

  // const currentArticle = articles[currentArticleIndex];

  const handleDismiss = () => {
    onArticleHidden?.(currentArticle.id);
    if (currentArticleIndex >= articles.length - 1) {
      setCurrentArticleIndex((i) => Math.map(0, i - 1));
    }
  };

  const handleSave = () => {
    onArticleSave?.(currentArticle.id);
  };

  // const notifyArticleClick = () => handleOpen();

  return (
    <s.Container>
      <ArticlePreview
        article={currentArticle}
        isListview={false}
        //notifyArticleClick={() => handleArticleClick(currentArticle.id, currentArticle.source_id, currentArticleIndex)}
        notifyArticleClick={handleOpen}
      />

      <ArticleSwipeControl onOpen={handleOpen} onDismiss={handleDismiss} onSave={handleSave} />

      {/* Same modal as list-mode titleLink flow */}
      <RedirectionNotificationModal
        hasExtension={hasExtension}
        article={currentArticle}
        open={isRedirectionModalOpen}
        handleCloseRedirectionModal={() => setIsRedirectionModalOpen(false)}
        setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
        setIsArticleSaved={() => {}}
      />
    </s.Container>
  );
}
