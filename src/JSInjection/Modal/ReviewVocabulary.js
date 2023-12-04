import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import { StyledPrimaryButton } from "./Buttons.styles";

export default function ReviewVocabulary({openReview}) {
  useUILanguage(); 
  return (
    <>
    <s.FeedbackBox className="feedbackBox">
      <h2>Practice your Vocabulary</h2>
      <p>Get exercises based on the words you translated</p>
      <s.CenteredContent>
      <StyledPrimaryButton onClick={openReview}>Exercises</StyledPrimaryButton>
      </s.CenteredContent>
    </s.FeedbackBox>
    </>
  );
}