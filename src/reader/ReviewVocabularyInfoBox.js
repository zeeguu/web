import * as s from "./ArticleReader.sc.js";
import useUILanguage from "../assorted/hooks/uiLanguageHook.js";
import { StyledButton } from "../components/allButtons.sc.js";
import { useHistory } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";

export default function ReviewVocabularyInfoBox({
  articleID,
  clickedOnReviewVocab,
  setClickedOnReviewVocab,
  // openReview is required in the extension
  openReview,
  bookmarks,
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
        {bookmarks.length > 0 && (
          <StyledButton
            primary
            onClick={handleButtonClick}
            style={{ marginLeft: "auto", marginBottom: "5em" }}
          >
            <span>Review Words</span>
            {<NavigateNextIcon />}
          </StyledButton>
        )}
      </s.CenteredContent>
    </>
  );
}
