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
// `titleOnly` says the caller renders the title alone (Headlines cards), so a
// missing bundled summary is no reason to go to the server — the bundled title
// is enough. Whatever else the payload happens to carry is still built.
//
// `preferFresh` skips the bundled payload and asks the server instead. The
// bundled tokens carry the `past_bookmarks` as they were when the feed response
// was built (and that response is client-cached for 5 min), so a word the user
// translated since then wouldn't come back highlighted. The overlay uses this:
// it's opened by an explicit tap, so one request is affordable, and it's the
// surface where losing your own translations is most visible. The inline card
// stays on the bundled payload — one request per card would undo the batching.
//
// The bundled payload is part of the cached feed response and carries the
// learner's past bookmarks. Once they translate, delete or ungroup something on
// a card, the bundle no longer matches the server, and a card rebuilt from it
// (back from Settings, say) would undo the change. So the texts built here
// tell the API to forget this article's bundle: its next build fetches the
// tokens, one request, and the rest of the feed stays cached.

// The bundled payload to build from, or null when the server must be asked.
// A bundled title with no bundled summary is complete enough when there is no
// summary to tokenize, or when the caller only shows the title -- fetching then
// would cost one request per card.
export function bundledPayload(article, { preferFresh = false, titleOnly = false } = {}) {
  const summaryBundledOrUnneeded = !!article.interactiveSummary || !article.summary || titleOnly;
  return !preferFresh && article.interactiveTitle && summaryBundledOrUnneeded
    ? { tokenized_summary: article.interactiveSummary, tokenized_title: article.interactiveTitle }
    : null;
}

export default function useArticlePreviewTokens(article, { enabled = true, preferFresh = false, titleOnly = false } = {}) {
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

    // The feed bundles both payloads per card, so the request below is a
    // fallback.
    const preloaded = bundledPayload(article, { preferFresh, titleOnly });
    const onBookmarksChanged = () => api.forgetArticleTokens(article.id);

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
            onBookmarksChanged,
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
            onBookmarksChanged,
          }),
        );
      }
      setIsTokenizing(false);
    }
    // eslint-disable-next-line
  }, [enabled, article.id, article.language]);

  return { interactiveTitle, interactiveSummary };
}
