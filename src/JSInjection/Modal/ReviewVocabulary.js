import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc"
import strings from "../../zeeguu-react/src/i18n/definitions"

export default function ReviewVocabulary() {
  return (
    <s.FeedbackBox>
    <h2>{strings.reviewVocabulary}</h2>
    <small>{strings.reviewVocabExplanation}</small>
    <br />
    <br />
    <s.CenteredContent>
      <a href="http://zeeguu.org" target="_blank" rel="noopener noreferrer">{strings.reviewVocabulary} » (Broken link)</a>
      </s.CenteredContent>
    </s.FeedbackBox>
  );
}
