import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import { StyledButtonBlue } from "./Buttons.styles";

export default function ReviewVocabulary({openReview}) {
  useUILanguage(); 
  return (
    <>
    <s.FeedbackBox className="feedbackBox">
      <h2>Practice your Vocabulary!</h2>
      <small> Review your translations to ensure better learning and practice the vocabulary from this article in the exercises.</small>
      <br />
      <br />
      <s.CenteredContent>
      <StyledButtonBlue onClick={openReview}>Practice Vocabulary</StyledButtonBlue>
      </s.CenteredContent>
    </s.FeedbackBox>
    </>
  );
}

