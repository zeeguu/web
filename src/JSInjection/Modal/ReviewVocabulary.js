import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import WordsForArticleModal from "./WordsForArticleModal";
import { useState } from "react";

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
    <s.FeedbackBox>
      <h2>{strings.reviewVocabulary}</h2>
      <small>{strings.reviewVocabExplanation}</small>
      <br />
      <br />
      <s.CenteredContent>
      <button onClick={setDisplayReviewTrue}>{strings.reviewVocabulary}</button>
      </s.CenteredContent>
    </s.FeedbackBox>
    )}
    {displayReview === true && (
      <>
      <WordsForArticleModal api={api} articleID={articleId}/>
      <button onClick={setDisplayReviewFalse}>Go back {":)"}</button>
  </>
    )}

    </>
  );
}


//<a href={`https://zeeguu.org/words/forArticle/${id}`}>
//{strings.reviewVocabulary} » (Broken link)
//</a>