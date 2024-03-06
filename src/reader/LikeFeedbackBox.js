import { UMR_SOURCE } from "./ArticleReader";
import * as s from "./ArticleReader.sc";
import strings from "../i18n/definitions";

export default function LikeFeedbackBox({
  api,
  articleID,
  articleInfo,
  setArticleInfo,
}) {
  function setLikedState(state) {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(api.LIKE_ARTICLE, articleID, state, UMR_SOURCE);
  }

  return (
    <s.FeedbackBox>
      {/*<h4>{strings.helpUsMsg}</h4>*/}

      <h4>{strings.wouldYouLikeMoreMsg}</h4>

      <s.CenteredContent>
        <s.WhiteButton
          onClick={(e) => setLikedState(true)}
          className={articleInfo.liked === true && "selected"}
        >
          {strings.yes}
        </s.WhiteButton>
        <s.WhiteButton
          onClick={(e) => setLikedState(false)}
          className={articleInfo.liked === false && "selected"}
        >
          {strings.no}
        </s.WhiteButton>
      </s.CenteredContent>
    </s.FeedbackBox>
  );
}
