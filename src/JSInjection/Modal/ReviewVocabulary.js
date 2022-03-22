import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import {StyledButtonBlue} from "./Modal.styles";

export default function ReviewVocabulary({openReview}) {
  useUILanguage(); 
  return (
    <>
    <s.FeedbackBox className="feedbackBox">
      <h2>{strings.reviewVocabulary}</h2>
      <small>{strings.reviewVocabExplanation}</small>
      <br />
      <br />
      <s.CenteredContent>
      <StyledButtonBlue onClick={openReview}>{strings.reviewVocabulary}</StyledButtonBlue>
      </s.CenteredContent>
    </s.FeedbackBox>
    </>
  );
}

