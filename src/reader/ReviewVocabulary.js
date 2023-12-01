import * as s from "./ArticleReader.sc";
import strings from "../i18n/definitions";
import useUILanguage from "../assorted/hooks/uiLanguageHook";
//import { StyledPrimaryButton } from "./Buttons.styles";

export default function ReviewVocabulary({strings, articleID}) {
  useUILanguage(); 
  return (
    <>
    <s.FeedbackBox className="feedbackBox">
      <h2>Practice your Vocabulary</h2>
      <p>Get exercises based on the words you translated</p>
      <s.CenteredContent>
      <s.NavigationLink primary to={`../words/forArticle/${articleID}`}>
            {strings.reviewVocabulary}
    </s.NavigationLink>
      </s.CenteredContent>
    </s.FeedbackBox>
    </>
  );
}