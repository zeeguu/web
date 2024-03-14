/*global chrome*/
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";
import {
  EXTENSION_SOURCE,
  LIST_CONTENT,
  PARAGRAPH_CONTENT,
  HEADER_CONTENT,
} from "../constants";
import { StyledBox } from "./Modal.styles";
import ReviewVocabulary from "./ReviewVocabulary";
import LikeFeedbackBox from "../../zeeguu-react/src/reader/LikeFeedbackBox";
import DifficultyFeedbackBox from "../../zeeguu-react/src/reader/DifficultyFeedbackBox";
import { colors } from "@mui/material";

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
  setArticleInfo,
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
        <p className="author">{author}</p>
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
          <ReviewVocabulary
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
              Help us make better personalized recommendations by answering the
              following questions
            </div>
            <LikeFeedbackBox
              api={api}
              articleID={articleId}
              articleInfo={articleInfo}
              setArticleInfo={setArticleInfo}
              source={EXTENSION_SOURCE}
            />
            <DifficultyFeedbackBox api={api} articleID={articleId} />
          </StyledBox>
        </div>
      </div>
    </>
  );
}
