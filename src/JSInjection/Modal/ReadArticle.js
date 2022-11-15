/*global chrome*/
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";
import {
  EXTENSION_SOURCE,
  LIST_CONTENT,
  PARAGRAPH_CONTENT,
  HEADER_CONTENT,
} from "../constants";
import { StyledSmallButtonBlue } from "./Buttons.styles";
import ReviewVocabulary from "./ReviewVocabulary";
import SaveToZeeguu from "./SaveToZeeguu";
import UserFeedback from "./UserFeedback";

import DifficultyFeedbackBox from "../../zeeguu-react/src/reader/DifficultyFeedbackBox";

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
}) {
  function reportProblem(e) {
    document.getElementById("feedback-box").scrollIntoView();
    document.getElementById("textarea-feedback").focus();
  }

  if (articleImage) {
    if (articleImage.src === null) {
      articleImage = undefined;
    }
  }

  return (
    <>
      <div className="article-container">
        <StyledSmallButtonBlue onClick={reportProblem}>
          Report problems
        </StyledSmallButtonBlue>
        <SaveToZeeguu
          api={api}
          articleId={articleId}
          setPersonalCopySaved={setPersonalCopySaved}
          personalCopySaved={personalCopySaved}
        />
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
          />
        </h1>
        <p className="author">{author}</p>
        <hr />
        {articleImage === undefined ? null : (
          <img
            id="zeeguuImage"
            alt={articleImage.alt}
            src={articleImage.src}
          ></img>
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

        <DifficultyFeedbackBox api={api} articleID={articleId} />

        <ReviewVocabulary
          articleId={articleId}
          api={api}
          openReview={openReview}
        />

        <UserFeedback api={api} articleId={articleId} url={url} />
      </div>
    </>
  );
}
