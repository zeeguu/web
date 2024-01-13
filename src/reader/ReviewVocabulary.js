import * as s from "./ArticleReader.sc";
import useUILanguage from "../assorted/hooks/uiLanguageHook";
import { StyledButton } from "../components/allButtons.sc.js"
import { useHistory } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function ReviewVocabulary({articleID}) {
  useUILanguage();
  
  const history = useHistory(); 

    const handleButtonClick = () => {
        history.push(`../words/forArticle/${articleID}`);
    };

  return (
    <>
    <s.FeedbackBox className="feedbackBox">
      <s.CenteredContent>
        <div>
           <h2>Exercises</h2>
           <div>
             <img
              src="/static/images/zeeguuWhiteLogo.svg"
              alt="Zeeguu Logo - The Elephant"/>
           </div>
        </div>
      <div>
        <StyledButton primary onClick={handleButtonClick}>
          <span>Review words</span>{<NavigateNextIcon/>}
        </StyledButton>
      </div>
      </s.CenteredContent>
    </s.FeedbackBox>
    </>
  );
}