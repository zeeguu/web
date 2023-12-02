import * as s from "./ArticleReader.sc";
import useUILanguage from "../assorted/hooks/uiLanguageHook";
import { StyledPrimaryButton } from "../components/allButtons.sc.js"
import { Link } from "react-router-dom";

export default function ReviewVocabulary({articleID}) {
  useUILanguage(); 
  return (
    <>
    <s.FeedbackBox className="feedbackBox">
      <h2>Practice your Vocabulary</h2>
      <p>Get exercises based on the words you translated</p>
      <s.CenteredContent>
      <StyledPrimaryButton primary>
        <Link to={`../words/forArticle/${articleID}`} style={{ color: 'white', fontSize: "18px" }}>
           <b>Exercises</b>
        </Link>
      </StyledPrimaryButton>
      </s.CenteredContent>
    </s.FeedbackBox>
    </>
  );
}