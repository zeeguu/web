/*global chrome*/
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";
import { LIST_CONTENT, PARAGRAPH_CONTENT, HEADER_CONTENT } from "../constants";
import { InvisibleBox, StyledBox } from "./Modal.styles";
import ReviewVocabularyInfoBox from "../../zeeguu-react/src/reader/ReviewVocabularyInfoBox";
import LikeFeedbackBox from "../../zeeguu-react/src/reader/LikeFeedbackBox";
import DifficultyFeedbackBox from "../../zeeguu-react/src/reader/DifficultyFeedbackBox";
import { random } from "../../zeeguu-react/src/utils/basic/arrays";
import ArticleStatInfo from "../../zeeguu-react/src/components/ArticleStatInfo";
import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";

export function ReadArticle({
  articleId,
  api,
  author,
  interactiveTextArray,
  interactiveTitle,
  articleImage,
  openReview,
  translating,
  pronouncing,
  url,
  setPersonalCopySaved,
  personalCopySaved,
  articleInfo,
  setLikedState,
  updateArticleDifficultyFeedback,
  answerSubmitted,
}) {
  if (articleImage) {
    if (articleImage.src === null) {
      articleImage = undefined;
    }
  }

  return (
    <>
      <div className="article-container">
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
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
        {interactiveTextArray.map((paragraph) => {
          const CustomTag = `${paragraph.tag}`;
          if (
            HEADER_CONTENT.includes(paragraph.tag) ||
            PARAGRAPH_CONTENT.includes(paragraph.tag)
          ) {
            return (
              <CustomTag>
                <TranslatableText
                  interactiveText={paragraph.text}
                  translating={translating}
                  pronouncing={pronouncing}
                />
              </CustomTag>
            );
          }
          if (LIST_CONTENT.includes(paragraph.tag)) {
            let list = Array.from(paragraph.list);
            return (
              <CustomTag>
                {list.map((paragraph, i) => {
                  return (
                    <li key={i}>
                      <TranslatableText
                        interactiveText={paragraph.text}
                        translating={translating}
                        pronouncing={pronouncing}
                      />
                    </li>
                  );
                })}
              </CustomTag>
            );
          }
        })}
        <div id={"bottomRow"}>
          <ReviewVocabularyInfoBox
            articleId={articleId}
            api={api}
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
