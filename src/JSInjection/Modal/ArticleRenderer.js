import { useState } from "react";
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";
import { InvisibleBox, StyledBox } from "./Modal.styles";
import ReviewVocabularyInfoBox from "../../zeeguu-react/src/reader/ReviewVocabularyInfoBox";
import LikeFeedbackBox from "../../zeeguu-react/src/reader/LikeFeedbackBox";
import DifficultyFeedbackBox from "../../zeeguu-react/src/reader/DifficultyFeedbackBox";
import { random } from "../../zeeguu-react/src/utils/basic/arrays";
import ArticleStatInfo from "../../zeeguu-react/src/components/ArticleStatInfo";
import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";

export function ArticleRenderer({
  articleId,
  articleTopics,

  author,
  interactiveText,
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
}) {
  if (articleImage) {
    if (articleImage.src === null) {
      articleImage = undefined;
    }
  }
  const [clickedOnReviewVocab, setClickedOnReviewVocab] = useState(false);
  return (
    <>
      <div className="article-container">
        {articleTopics && (
          <s.ArticleTopics>{articleTopics.join(",")}</s.ArticleTopics>
        )}
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
          <ArticleStatInfo articleInfo={articleInfo}></ArticleStatInfo>
        </s.ArticleInfoContainer>

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
          <TranslatableText
            interactiveText={interactiveText}
            translating={translating}
            pronouncing={pronouncing}
            updateBookmarks={fetchBookmarks}
          />
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
              Zeeguu can make better personalized recommendations based on your
              feedback.
            </div>
            <LikeFeedbackBox
              articleInfo={articleInfo}
              setLikedState={setLikedState}
            />
            <DifficultyFeedbackBox
              articleInfo={articleInfo}
              updateArticleDifficultyFeedback={updateArticleDifficultyFeedback}
            />
            {answerSubmitted && (
              <InvisibleBox>
                <h3 align="center">
                  Thank You {random(["🤗", "🙏", "😊", "🎉"])}
                </h3>
              </InvisibleBox>
            )}
          </StyledBox>
        </div>
      </div>
    </>
  );
}
