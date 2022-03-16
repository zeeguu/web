import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import WordsForArticleModal from "./WordsForArticleModal";
import { useState } from "react";
import { StyledButton } from "./Modal.styles";

export default function ReviewVocabulary({articleId, api}) {
const [displayReview, setDisplayReview] = useState(false)

  function setDisplayReviewTrue(){
    setDisplayReview(true)
  }

  function setDisplayReviewFalse(){
    setDisplayReview(false)
  }

  return (
    <>
    {displayReview === false && (
    <s.FeedbackBox className="feedbackBox">
      <h2>{strings.reviewVocabulary}</h2>
      <small>{strings.reviewVocabExplanation}</small>
      <br />
      <br />
      <s.CenteredContent>
      <StyledButton onClick={setDisplayReviewTrue}>{strings.reviewVocabulary}</StyledButton>
      </s.CenteredContent>
    </s.FeedbackBox>
    )}
    {displayReview === true && (
      <>
      <WordsForArticleModal api={api} articleID={articleId}/>
      <StyledButton onClick={setDisplayReviewFalse}>Go back {":)"}</StyledButton>
  </>
    )}

    </>
  );
}


//<a href={`https://zeeguu.org/words/forArticle/${id}`}>
//{strings.reviewVocabulary} » (Broken link)
//</a>