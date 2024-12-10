import * as s from "./ArticleReader.sc.js";
import useUILanguage from "../assorted/hooks/uiLanguageHook.js";
import { StyledButton } from "../components/allButtons.sc.js";
import { useHistory } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import { getStaticPath } from "../utils/misc/staticPath.js";

export default function ReviewVocabularyInfoBox({
  articleID,
  clickedOnReviewVocab,
  setClickedOnReviewVocab,
  // openReview is required in the extension
  openReview,
}) {
  useUILanguage();

  const history = useHistory();

  const handleButtonClick = () => {
    if (setClickedOnReviewVocab) setClickedOnReviewVocab(true);
    if (openReview) openReview();
  };

  useEffect(() => {
    if (clickedOnReviewVocab) history.push(`../words/forArticle/${articleID}`);
  }, [clickedOnReviewVocab]);

  return (
    <>
      <s.CenteredContent>
        <StyledButton
          primary
          onClick={handleButtonClick}
          style={{ marginLeft: "auto", marginBottom: "5em" }}
        >
          <span>Review words</span>
          {<NavigateNextIcon />}
        </StyledButton>
      </s.CenteredContent>
    </>
  );
}
