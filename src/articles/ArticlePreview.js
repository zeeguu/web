import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";

import { isMobile } from "../utils/misc/browserDetection";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import { APIContext } from "../contexts/APIContext";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import ActionButton from "../components/ActionButton";
import ArticlePreviewList from "./ArticlePreviewList";
import ArticlePreviewSwipe from "./ArticlePreviewSwipe";

export default function ArticlePreview({
  article,
  isListView = true,
  dontShowPublishingTime,
  dontShowSourceIcon,
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  notifyArticleClick,
  onArticleHidden,
  onArticleSave,
}) {
  const api = useContext(APIContext);
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(article.has_personal_copy);
  const [showInferredTopic, setShowInferredTopic] = useState(true);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));
  const isTokenizing = useRef(false);

  useEffect(() => {
    // To avoid two api.calls due to React.StrictMode
    if (isTokenizing.current) return;
    isTokenizing.current = true;

    if ((article.summary || article.title) && !interactiveSummary && !interactiveTitle) {
      api.getArticleSummaryInfo(article.id, (summaryData) => {
        // Create interactive summary
        if (summaryData.tokenized_summary) {
          setInteractiveSummary(
            new InteractiveText(
              summaryData.tokenized_summary.tokens,
              article.source_id,
              api,
              summaryData.tokenized_summary.past_bookmarks,
              api.TRANSLATE_TEXT,
              article.language,
              "article_preview",
              zeeguuSpeech,
              summaryData.tokenized_summary.context_identifier,
            ),
          );
        }

        // Create interactive title
        if (summaryData.tokenized_title?.tokens) {
          setInteractiveTitle(
            new InteractiveText(
              summaryData.tokenized_title.tokens,
              article.source_id,
              api,
              summaryData.tokenized_title.past_bookmarks || [],
              api.TRANSLATE_TEXT,
              article.language,
              "article_preview",
              zeeguuSpeech,
              summaryData.tokenized_title.context_identifier,
            ),
          );
        }
      });
    }
  }, [
    article.summary,
    article.title,
    article.language,
    article.id,
    api,
    zeeguuSpeech,
    // isTokenizing removed - was causing infinite loop!
    // interactiveSummary removed - was causing infinite loop!
    // interactiveTitle removed - was causing infinite loop!
  ]);

  const handleArticleClick = () => {
    if (notifyArticleClick) {
      notifyArticleClick(article.source_id);
    }
  };

  const handleSetIsArticleSaved = (val) => {
    setIsArticleSaved(val);
    // notify parent so it can flip has_personal_copy and re-filter from recommendations
    onArticleSave?.(article.id, val);
  };

  let topics = article.topics_list;

  function handleCloseRedirectionModal() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpenRedirectionModal() {
    setIsRedirectionModaOpen(true);
  }

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;

    let open_in_zeeguu = (
      <ActionButton as={Link} to={linkToRedirect} onClick={handleArticleClick}>
        {isListView ? "Open" : "Read full article →"}
      </ActionButton>
    );

    let open_externally_with_modal = (
      //The RedirectionNotificationModal modal informs the user that they are about
      //to be redirected to the original article's website and guides them on what steps
      //should be taken to start reading the said article with The Zeeguu Reader extension
      //The modal is displayed when the user clicks the article's title from the recommendation
      //list and can be deactivated when they select "Do not show again" and proceed.
      <>
        <RedirectionNotificationModal
          hasExtension={hasExtension}
          article={article}
          open={isRedirectionModalOpen}
          handleCloseRedirectionModal={handleCloseRedirectionModal}
          setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
          setIsArticleSaved={handleSetIsArticleSaved}
        />
        <ActionButton
          onClick={() => {
            handleArticleClick();
            handleOpenRedirectionModal();
          }}
        >
          {isListView ? "Open" : "Read full article →"}
        </ActionButton>
      </>
    );

    let open_externally_without_modal = (
      //allow target _self on mobile to easily go back to Zeeguu
      //using mobile browser navigation
      <ActionButton
        as="a"
        target={isMobile ? "_self" : "_blank"}
        rel="noreferrer"
        href={article.url}
        onClick={handleArticleClick}
      >
        {isListView ? "Open" : "Read full article →"}
      </ActionButton>
    );

    let should_open_in_zeeguu =
      article.video ||
      (!Feature.extension_experiment1() && !hasExtension) ||
      article.has_personal_copy ||
      article.has_uploader ||
      isArticleSaved === true ||
      article.parent_article_id; // Simplified articles (with parent_article_id) always open in Zeeguu reader

    let should_open_with_modal = doNotShowRedirectionModal_UserPreference === false;

    if (should_open_in_zeeguu) return open_in_zeeguu;
    else if (should_open_with_modal) return open_externally_with_modal;
    else return open_externally_without_modal;
  }

  return isListView ? (
    <ArticlePreviewList
      article={article}
      interactiveTitle={interactiveTitle}
      interactiveSummary={interactiveSummary}
      isArticleSaved={isArticleSaved}
      setIsArticleSaved={handleSetIsArticleSaved}
      dontShowPublishingTime={dontShowPublishingTime}
      dontShowSourceIcon={dontShowSourceIcon}
      titleLink={titleLink}
      handleHideArticle={onArticleHidden}
    />
  ) : (
    <ArticlePreviewSwipe
      article={article}
      titleLink={titleLink}
      interactiveTitle={interactiveTitle}
      interactiveSummary={interactiveSummary}
      onSwipeRight={onArticleSave}
      onSwipeLeft={onArticleHidden}
      onOpen={notifyArticleClick}
    />
  );
}
