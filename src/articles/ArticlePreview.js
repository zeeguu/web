import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/RedirectionNotificationModal";
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";
import SmallSaveArticleButton from "./SmallSaveArticleButton";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowImage,
  hasExtension,
  api,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
}) {
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(
    article.has_personal_copy,
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  function handleCloseRedirectionModal() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpenRedirectionModal() {
    setIsRedirectionModaOpen(true);
  }

  function titleLink(article) {
    let open_in_zeeguu = (
      <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>
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
          article={article}
          open={isRedirectionModalOpen}
          handleCloseRedirectionModal={handleCloseRedirectionModal}
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
          setIsArticleSaved={setIsArticleSaved}
        />
        <s.InvisibleTitleButton onClick={handleOpenRedirectionModal}>
          {article.title}
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
      >
        {article.title}
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
  //  https://stackoverflow.com/questions/55556829/how-to-reorder-the-flex-items-when-resizing-the-screen
  // USE CSS TO RE-ORDER
  return (
    <s.ArticlePreview>
      <SmallSaveArticleButton
        api={api}
        article={article}
        isArticleSaved={isArticleSaved}
        setIsArticleSaved={setIsArticleSaved}
      />
      <div>
        <s.Title>{titleLink(article)}</s.Title>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <img
            alt=""
            style={{
              flex: "right",
              margin: "0.5em",
              maxWidth: "8em",
              maxHeight: "6em",
              borderRadius: "1em",
            }}
            src={
              "https://asset.dr.dk/imagescaler/?protocol=https&server=www.dr.dk&file=%2Fimages%2Fother%2F2024%2F02%2F19%2Fscanpix-20231130-235836-6.jpg&scaleAfter=crop&quality=70&w=850&h=620"
            }
          />
          <s.Summary>{article.summary}</s.Summary>
          <div>
            <s.Difficulty>{difficulty}</s.Difficulty>
            <s.WordCount style={{ marginRight: "1em" }}>
              {article.metrics.word_count}
            </s.WordCount>
          </div>
        </div>
      </div>

      {/*{windowWidth >= 768 ? (
        <>
          <s.Title>{titleLink(article)}</s.Title>
          <div style={{ display: "flex", width: "100%" }}>
            <img
              alt=""
              style={{
                flex: "right",
                margin: "0.5em",
                maxWidth: "8em",
                maxHeight: "6em",
                borderRadius: "1em",
              }}
              src={
                "https://asset.dr.dk/imagescaler/?protocol=https&server=www.dr.dk&file=%2Fimages%2Fother%2F2024%2F02%2F19%2Fscanpix-20231130-235836-6.jpg&scaleAfter=crop&quality=70&w=850&h=620"
              }
            />
            <s.Summary>{article.summary}</s.Summary>
            <s.WordCount>{article.metrics.word_count}</s.WordCount>
            <s.Difficulty>{difficulty}</s.Difficulty>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: "100%" }}>
            <s.Title>{titleLink(article)}</s.Title>
            <s.Summary>{article.summary}</s.Summary>
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <img
              alt=""
              style={{
                flex: "right",
                margin: "1em",
                maxWidth: "8em",
                maxHeight: "6em",
                borderRadius: "1em",
              }}
              src={
                "https://asset.dr.dk/imagescaler/?protocol=https&server=www.dr.dk&file=%2Fimages%2Fother%2F2024%2F02%2F19%2Fscanpix-20231130-235836-6.jpg&scaleAfter=crop&quality=70&w=850&h=620"
              }
            />
            <s.WordCount>{article.metrics.word_count}</s.WordCount>
            <s.Difficulty>{difficulty}</s.Difficulty>
          </div>
        </>
      )} */}

      <div>
        {!dontShowImage && (
          <s.SourceImage>
            <img src={"/news-icons/" + article.icon_name} alt="" />
          </s.SourceImage>
        )}
        {!dontShowPublishingTime && (
          <s.PublishingTime>
            ({moment.utc(article.published).fromNow()})
          </s.PublishingTime>
        )}
        <s.Topics>
          {topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </s.Topics>
      </div>
      {article.video ? (
        <img
          alt=""
          style={{ float: "left", marginRight: "1em" }}
          src={
            "https://img.youtube.com/vi/" +
            extractVideoIDFromURL(article.url) +
            "/default.jpg"
          }
        />
      ) : (
        ""
      )}
    </s.ArticlePreview>
  );
}
