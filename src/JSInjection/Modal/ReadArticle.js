/*global chrome*/
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";
import {
  EXTENSION_SOURCE,
  LIST_CONTENT,
  PARAGRAPH_CONTENT,
  HEADER_CONTENT,
} from "../constants";
import { StyledSmallButtonBlue } from "./Modal.styles";
import ReviewVocabulary from "./ReviewVocabulary";

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
}) {

  function handlePostCopy() {
    let article = { article_id: articleId };
    api.makePersonalCopy(article, (message) => alert(message));
    api.logReaderActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
  }

  function reportProblem(e) {
    let answer = prompt("What is wrong with the article?");
    if (answer) {
      let feedback = "problem_" + answer.replace(/ /g, "_");
      api.logReaderActivity(api.EXTENSION_FEEDBACK, articleId, feedback, EXTENSION_SOURCE);
    }
  }

  return (
    <>
      <div className="article-container">
        <StyledSmallButtonBlue onClick={reportProblem}>Report problems</StyledSmallButtonBlue>
        <StyledSmallButtonBlue onClick={handlePostCopy}>Make Personal Copy</StyledSmallButtonBlue>
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
        <img id="zeeguuImage" alt={articleImage.alt} src={articleImage.src}></img>
        )}
        {interactiveTextArray.map((paragraph) => {
          const CustomTag = `${paragraph.tag}`;
          if (HEADER_CONTENT.includes(paragraph.tag) || PARAGRAPH_CONTENT.includes(paragraph.tag)) {
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
        <ReviewVocabulary articleId={articleId} api={api} openReview={openReview}/>
      </div>
    </>
  );
}
