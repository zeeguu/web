import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";

export default function ReviewVocabulary(articleId) {
  const id =  articleId.articleId
  useUILanguage(); 
  return (
    <s.FeedbackBox>
      <h2>{strings.reviewVocabulary}</h2>
      <small>{strings.reviewVocabExplanation}</small>
      <br />
      <br />
      <s.CenteredContent>
        <a href={`https://zeeguu.org/words/forArticle/${id}`}>
          {strings.reviewVocabulary} » (Broken link)
        </a>
      </s.CenteredContent>
    </s.FeedbackBox>
  );
}
