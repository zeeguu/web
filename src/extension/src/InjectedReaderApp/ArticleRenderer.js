import { useState } from "react";
import { TranslatableText } from "../../../reader/TranslatableText";
import { InvisibleBox, StyledBox } from "./InjectedReaderApp.styles";
import ReviewVocabularyInfoBox from "../../../reader/ReviewVocabularyInfoBox";
import LikeFeedbackBox from "../../../reader/LikeFeedbackBox";
import DifficultyFeedbackBox from "../../../reader/DifficultyFeedbackBox";
import { random } from "../../../utils/basic/arrays";
import ArticleStatInfo from "../../../components/ArticleStatInfo";
import * as s from "../../../reader/ArticleReader.sc";
import SimplificationLevelsNotice from "../../../components/SimplificationLevelsNotice";

export function ArticleRenderer({
  articleId,
  articleTopics,
  author,
  interactiveFragments,
  interactiveTitle,
  articleImage,
  openReview,
  translating,
  pronouncing,
  articleInfo,
  setLikedState,
  updateArticleDifficultyFeedback,
  answerSubmitted,
  bookmarks,
  fetchBookmarks,
  api,
  availableLevels,
  onLevelChange,
  isLoadingNewVersion = false,
}) {
  if (articleImage) {
    if (articleImage.src === null) {
      articleImage = undefined;
    }
  }
  const [clickedOnReviewVocab, setClickedOnReviewVocab] = useState(false);

  return (
    <>
      <div className="article-container" style={{ position: "relative" }}>
        {isLoadingNewVersion && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "20px",
              zIndex: 1000,
              fontSize: "18px",
              color: "black",
              backdropFilter: "blur(2px)",
            }}
          >
            <h2>Please wait...</h2>
          </div>
        )}
        {articleTopics && <s.ArticleTopics>{articleTopics.join(",")}</s.ArticleTopics>}
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
            updateBookmarks={fetchBookmarks}
          />
        </h1>

        <s.ArticleInfoContainer>
          <span className="author">{author}</span>
          {(!availableLevels || availableLevels.length <= 1) && (
            <ArticleStatInfo articleInfo={articleInfo}></ArticleStatInfo>
          )}
        </s.ArticleInfoContainer>

        <SimplificationLevelsNotice
          articleInfo={articleInfo}
          api={api}
          onLevelChange={onLevelChange}
          currentArticleId={articleId}
        />

        <hr />
        {articleImage && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              alt={articleImage.alt}
              src={articleImage.src}
              style={{
                width: "100%",
                borderRadius: "1em",
                marginBottom: "1em",
              }}
            />
          </div>
        )}
        <s.MainText>
          {interactiveFragments &&
            interactiveFragments.map((interactiveText) => (
              <TranslatableText
                interactiveText={interactiveText}
                translating={translating}
                pronouncing={pronouncing}
                updateBookmarks={fetchBookmarks}
              />
            ))}
        </s.MainText>
        <div id={"bottomRow"}>
          <ReviewVocabularyInfoBox
            articleID={articleId}
            clickedOnReviewVocab={clickedOnReviewVocab}
            setClickedOnReviewVocab={setClickedOnReviewVocab}
            bookmarks={bookmarks}
            openReview={openReview}
          />
          <StyledBox>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                paddingRight: "2em",
                paddingLeft: "2em",
                color: "#333333",
              }}
            >
              Zeeguu can make better personalized recommendations based on your feedback.
            </div>
            <LikeFeedbackBox articleInfo={articleInfo} setLikedState={setLikedState} />
            <DifficultyFeedbackBox
              articleInfo={articleInfo}
              updateArticleDifficultyFeedback={updateArticleDifficultyFeedback}
            />
            {answerSubmitted && (
              <InvisibleBox>
                <h3 align="center">Thank You {random(["🤗", "🙏", "😊", "🎉"])}</h3>
              </InvisibleBox>
            )}
          </StyledBox>
        </div>
      </div>
    </>
  );
}
