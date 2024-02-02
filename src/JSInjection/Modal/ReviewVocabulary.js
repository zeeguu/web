import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import { StyledPrimaryButton } from "./Buttons.styles";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function ReviewVocabulary({openReview}) {
  useUILanguage(); 
  return (
    <>
    <s.FeedbackBox className="feedbackBox">
        <h2>Exercises</h2>
      <StyledPrimaryButton onClick={openReview}> <span>Review words</span>{<NavigateNextIcon/>}</StyledPrimaryButton>
    </s.FeedbackBox>
    </>
  );
}