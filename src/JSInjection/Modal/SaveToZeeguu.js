import {
  StyledSmallButtonBlue,
  StyledSmallDisabledButton,
} from "./Buttons.styles";
import EXTENSION_SOURCE from "../constants";

export default function SaveToZeeguu({ api, articleId, setPersonalCopySaved, personalCopySaved}) {

  function handlePostCopy() {
    let article = { article_id: articleId };
    api.makePersonalCopy(article, (message) => console.log(message));
    api.logReaderActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
    setPersonalCopySaved(true);
  }

  return (
    <>
      {personalCopySaved ? (
        <StyledSmallDisabledButton>
          Saved on zeeguu.org
        </StyledSmallDisabledButton>
      ) : (
        <StyledSmallButtonBlue onClick={handlePostCopy}>
          Save article to zeeguu.org
        </StyledSmallButtonBlue>
      )}
    </>
  );
}
