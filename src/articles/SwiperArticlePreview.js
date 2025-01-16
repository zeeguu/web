import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";

import SmallSaveArticleButton from "./SmallSaveArticleButton";

import ArticleSourceInfo from "../components/ArticleSourceInfo";
import ArticleStatInfo from "../components/ArticleStatInfo";

import extractDomain from "../utils/web/extractDomain";
import InteractiveText from "../reader/InteractiveText";
import { SpeechContext } from "../contexts/SpeechContext";
import { TranslatableText } from "../reader/TranslatableText";
import ArticleTopics from "./ArticleTopics";

export default function SwiperArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSourceIcon,
  hasExtension,
  api,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  onArticleClick,
}) {
  // Store which topic was clicked to show in the Modal

  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(
    article.has_personal_copy,
  );

  const speech = useContext(SpeechContext);
  const [interactiveTitle] = useState(
    new InteractiveText(
      article.title,
      article,
      api,
      api.TRANSLATE_TEXT,
      "SWIPER",
      speech,
    ),
  );

  const handleArticleClick = () => {
    if (onArticleClick) {
      onArticleClick(article.id);
    }
  };

  function handleCloseRedirectionModal() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpenRedirectionModal() {
    setIsRedirectionModaOpen(true);
  }

  function readLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;
    let open_in_zeeguu = (
      <Link to={linkToRedirect} onClick={handleArticleClick}>
        Read
      </Link>
    );

    let open_externally_with_modal = (
      //The RedirectionNotificationModal modal informs the user that they are about
      //to be redirected to the original article's website and guides them on what steps
      //should be taken to start reading the said article with The Zeeguu Reader extension
      //The modal is displayed when the user clicks the article's title from the recommendation
      //list and can be deactivated when they select "Do not show again" and proceed.
      <>
        <RedirectionNotificationModal
          api={api}
          hasExtension={hasExtension}
          article={article}
          open={isRedirectionModalOpen}
          handleCloseRedirectionModal={handleCloseRedirectionModal}
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
          setIsArticleSaved={setIsArticleSaved}
        />
        <s.InvisibleTitleButton
          onClick={() => {
            handleArticleClick();
            handleOpenRedirectionModal();
          }}
        >
          Read
        </s.InvisibleTitleButton>
      </>
    );

    let open_externally_without_modal = (
      //allow target _self on mobile to easily go back to Zeeguu
      //using mobile browser navigation
      <a
        target={isMobile ? "_self" : "_blank"}
        rel="noreferrer"
        href={article.url}
        onClick={handleArticleClick}
      >
        (read full)
      </a>
    );

    let should_open_in_zeeguu =
      article.video ||
      (!Feature.extension_experiment1() && !hasExtension) ||
      article.has_personal_copy ||
      article.has_uploader ||
      isArticleSaved === true;

    let should_open_with_modal =
      doNotShowRedirectionModal_UserPreference === false;

    if (should_open_in_zeeguu) return open_in_zeeguu;
    else if (should_open_with_modal) return open_externally_with_modal;
    else return open_externally_without_modal;
  }

  return (
    <div style={{ width: "800px", marginTop: "10em" }}>
      <s.ArticlePreview>
        <SmallSaveArticleButton
          api={api}
          article={article}
          isArticleSaved={isArticleSaved}
          setIsArticleSaved={setIsArticleSaved}
        />

        <br />
        <ArticleTopics article={article} api={api} />
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={true}
            pronouncing={false}
            setIsRendered={() => {}}
          />{" "}
        </h1>

        {article.feed_id ? (
          <ArticleSourceInfo
            articleInfo={article}
            dontShowPublishingTime={dontShowPublishingTime}
            dontShowSourceIcon={dontShowSourceIcon}
          ></ArticleSourceInfo>
        ) : (
          !dontShowSourceIcon &&
          article.url && <s.UrlSource>{extractDomain(article.url)}</s.UrlSource>
        )}

        <br />
        <s.ArticleContent>
          {article.img_url && <img alt="" src={article.img_url} />}
          <s.Summary>
            <div style={{ fontSize: "large", lineHeight: "1.8" }}>
              {article.summary}...
            </div>
          </s.Summary>
        </s.ArticleContent>

        <s.BottomContainer>
          <ArticleStatInfo articleInfo={article}></ArticleStatInfo>{" "}
          {readLink(article)}
        </s.BottomContainer>
      </s.ArticlePreview>

      <br />
      <br />
    </div>
  );
}
