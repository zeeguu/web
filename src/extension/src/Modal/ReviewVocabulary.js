import * as s from "../../../reader/ArticleReader.sc";
import useUILanguage from "../../../assorted/hooks/uiLanguageHook";
import { StyledPrimaryButton } from "./Buttons.styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BROWSER_API } from "../utils/browserApi";
import { CenteredContent } from "./Modal.styles";

export default function ReviewVocabulary({ openReview }) {
  useUILanguage();

  return (
    <>
      <s.InteractiveBox className="feedbackBox">
        <CenteredContent>
          <div className="imgContainer">
            <h2>Exercises</h2>
            <div>
              <img
                src={BROWSER_API.runtime.getURL("images/zeeguuWhiteLogo.svg")}
                alt={"Zeeguu logo"}
              />
            </div>
          </div>
          <StyledPrimaryButton onClick={openReview}>
            {" "}
            <span>Review words</span>
            {<NavigateNextIcon />}
          </StyledPrimaryButton>
        </CenteredContent>
      </s.InteractiveBox>
    </>
  );
}
