import { useContext, useEffect, useState } from "react";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";

// Builds the interactive (translatable + pronounceable) title and summary for
// an article preview — from the tokenized payload bundled with the recommended
// article, or by fetching it (`getArticleSummaryInfo`) as a fallback.
//
// Shared by the inline interactive feed card (ArticlePreview) and the
// tap-to-open preview overlay (ArticlePreviewOverlay). `enabled` gates the
// one-time build so callers can defer it — the overlay tokenizes only once it
// opens; the card only when it's in interactive mode.
//
// `preferFresh` skips the bundled payload and asks the server instead. The
// bundled tokens carry the `past_bookmarks` as they were when the feed response
// was built (and that response is client-cached for 5 min), so a word the user
// translated since then wouldn't come back highlighted. The overlay uses this:
// it's opened by an explicit tap, so one request is affordable, and it's the
// surface where losing your own translations is most visible. The inline card
// stays on the bundled payload — one request per card would undo the batching.
export default function useArticlePreviewTokens(article, { enabled = true, preferFresh = false } = {}) {
  const api = useContext(APIContext);
  const getBrowsingSessionId = useContext(BrowsingSessionContext);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));

  useEffect(() => {
    if (!enabled || isTokenizing || interactiveSummary || interactiveTitle) return;
    if (!article.summary && !article.title) return;
    setIsTokenizing(true);

    const preloaded =
      !preferFresh && article.interactiveSummary && article.interactiveTitle
        ? { tokenized_summary: article.interactiveSummary, tokenized_title: article.interactiveTitle }
        : null;

    if (preloaded) {
      processSummaryData(preloaded);
    } else {
      api.getArticleSummaryInfo(article.id, processSummaryData);
    }

    function processSummaryData(summaryData) {
      if (summaryData.tokenized_summary) {
        setInteractiveSummary(
          new InteractiveText({
            tokenizedParagraphs: summaryData.tokenized_summary.tokens,
            sourceId: article.source_id,
            api,
            previousBookmarks: summaryData.tokenized_summary.past_bookmarks,
            language: article.language,
            source: "article_preview",
            zeeguuSpeech,
            contextIdentifier: summaryData.tokenized_summary.context_identifier,
            getBrowsingSessionId,
          }),
        );
      }
      if (summaryData.tokenized_title && summaryData.tokenized_title.tokens) {
        setInteractiveTitle(
          new InteractiveText({
            tokenizedParagraphs: summaryData.tokenized_title.tokens,
            sourceId: article.source_id,
            api,
            previousBookmarks: summaryData.tokenized_title.past_bookmarks || [],
            language: article.language,
            source: "article_preview",
            zeeguuSpeech,
            contextIdentifier: summaryData.tokenized_title.context_identifier,
            getBrowsingSessionId,
          }),
        );
      }
      setIsTokenizing(false);
    }
    // eslint-disable-next-line
  }, [enabled, article.id, article.language]);

  return { interactiveTitle, interactiveSummary };
}
