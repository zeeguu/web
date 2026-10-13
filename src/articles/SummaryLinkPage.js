import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { APIContext } from "../contexts/APIContext";
import useArticlePreviewTokens from "../hooks/useArticlePreviewTokens";
import ArticlePreviewOverlay from "./ArticlePreviewOverlay";

// /read/<code>/summary opened with an account: the summary in the overlay a
// feed card opens -- at the reader's own level, and the words they tap are
// saved like anywhere else. Its primary action is the article in the reader
// (/read/<code>); closing it goes Home.
export default function SummaryLinkPage({ article, code }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [isArticleSaved, setIsArticleSaved] = useState(!!article.has_personal_copy);
  const { interactiveTitle, interactiveSummary } = useArticlePreviewTokens(article);

  function handleToggleSave(e) {
    e.preventDefault();
    const save = isArticleSaved ? api.removePersonalCopy : api.makePersonalCopy;
    save.call(api, article.id, (data) => {
      if (data !== "OK") return;
      setIsArticleSaved(!isArticleSaved);
      toast(isArticleSaved ? "Article removed from your Saves!" : "Article added to your Saves!");
    });
  }

  return (
    <ArticlePreviewOverlay
      article={article}
      open
      interactiveTitle={interactiveTitle}
      interactiveSummary={interactiveSummary}
      onClose={() => history.replace("/articles")}
      hasExtension={false}
      isArticleSaved={isArticleSaved}
      onToggleSave={handleToggleSave}
      setIsArticleSaved={setIsArticleSaved}
      externalUrl={article.parent_url || article.url}
      should_open_with_modal={false}
      setDoNotShowRedirectionModal_UserPreference={() => {}}
      readInZeeguuPath={`/read/${code}`}
    />
  );
}
