import { useState, useEffect } from "react";
import {
  StyledSmallButtonBlue,
  StyledSmallDisabledButton,
} from "./Buttons.styles";
import EXTENSION_SOURCE from "../constants";

export default function SaveToZeeguu({ api, articleId }) {
  const [isSaved, setSaved] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOwnTexts((articles) => {
      checkOwnTexts(articles);
    });
  }, []);

  function checkOwnTexts(articles) {
    if (articles.length !== 0) {
      for (var i = 0; i < articles.length; i++) {
        if (articles[i].id === articleId) {
          setSaved(true);
          setLoading(false);
          break;
        }
      }
    }
  }

  function handlePostCopy() {
    let article = { article_id: articleId };
    api.makePersonalCopy(article, (message) => console.log(message));
    api.logReaderActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
    setSaved(true);
  }

  if (loading) {
    return "";
  }

  return (
    <>
      {isSaved ? (
        <StyledSmallDisabledButton>
          Saved on zeeguu.org
        </StyledSmallDisabledButton>
      ) : (
        <StyledSmallButtonBlue onClick={handlePostCopy}>
          Save to zeeguu.org
        </StyledSmallButtonBlue>
      )}
    </>
  );
}
