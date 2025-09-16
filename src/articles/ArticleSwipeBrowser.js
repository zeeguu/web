import React, { useEffect, useRef, useState } from "react";
import * as s from "./ArticleSwipeBrowser.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticlePreview from "./ArticlePreview";
import ArticleSwipeControl from "../components/article_swipe/ArticleSwipeControl";
import SaveArticleButton from "./SaveArticleButton";

// should not be here
import { isMobile } from "../utils/misc/browserDetection";
import Feature from "../features/Feature";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";

export default function ArticleSwipeBrowser({
    articles,
    onArticleClick,
    onArticleHidden,
    onArticleSave,
    loadNextPage,
    isWaiting,
    hasExtension,
    doNotShowRedirectionModal_UserPreference,
    setDoNotShowRedirectionModal_UserPreference,
}) {
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const currentArticle = articles?.[currentArticleIndex];
  const [isArticleSaved, setIsArticleSaved] = useState(!!currentArticle?.has_personal_copy);
  const hiddenSaveRef = useRef(null);

  // these will be removed when we decided on a clear structure
  const [isRedirectionModalOpen, setIsRedirectionModalOpen] = useState(false);

    useEffect(() => {
        if (!articles || articles.length === 0) {
            loadNextPage();
        }
    }, [articles]);

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

  // keep local saved state in sync when the current article changes
  useEffect(() => {
    if (!currentArticle) return;
    setIsArticleSaved(!!currentArticle.has_personal_copy);
  }, [currentArticle?.id, currentArticle?.has_personal_copy]);

  if (!articles) return <LoadingAnimation />;
  if (articles.length === 0) return <p>No more articles</p>;

  if (!currentArticle) return <LoadingAnimation />;

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

  const handleDismiss = () => {
    onArticleHidden?.(currentArticle.id);
    increaseCurrentArticleIndex();
  };

  // notify parent to update its lists
  const setSavedAndNotify = (val) => {
      setIsArticleSaved(val);
      onArticleSave?.(currentArticle.id, val); // parent flips has_personal_copy in its arrays
      increaseCurrentArticleIndex();
  };

  const handleSave = () => {
    // onArticleSave?.(currentArticle.id);
    const root = hiddenSaveRef.current;
    if (!root) return;
    const clickable = root.querySelector("button, a");
    if (clickable) {
      clickable.click();
    }
  };

  const increaseCurrentArticleIndex = () => {
      if (!isWaiting && currentArticleIndex >= articles.length - 1) {
          loadNextPage();
          console.log("loaded new page");
          setCurrentArticleIndex(0);
      } else {
          setCurrentArticleIndex((prev) => prev + 1);
      }
    }

  return (
    <s.Container>
      <ArticlePreview
          key={currentArticle.id + (isArticleSaved ? "_saved" : "")}
          article={currentArticle}
            isListView={false}
            notifyArticleClick={handleOpen}
      />

      <ArticleSwipeControl onOpen={handleOpen} onDismiss={handleDismiss} onSave={handleSave} />

        <div
            ref={hiddenSaveRef}
            style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
                clipPath: "inset(50%)",
                whiteSpace: "nowrap",
            }}
            aria-hidden="true"
        >
            <SaveArticleButton
                article={currentArticle}
                isArticleSaved={isArticleSaved}
                setIsArticleSaved={setSavedAndNotify}
            />
        </div>

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
