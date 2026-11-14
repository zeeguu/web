import { useContext } from "react";

import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import { UserContext } from "../contexts/UserContext";
import SharedArticleRow from "./SharedArticleRow";
import { InboxList } from "./SharedArticleRow.sc";
import * as s from "../components/TopMessage.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import ShortTextRow from "../texts/ShortTextRow";
import useShortTexts from "../texts/useShortTexts";
import strings from "../i18n/definitions";

// Inbox: everything that comes into Zeeguu from outside, newest first. The
// articles friends send (SharedArticlesContext), and the texts the learner
// shares from another app (useShortTexts). Both in the language being learned. Most learners
// get nothing from friends, so their own texts are what makes it useful.

const when = (iso) => (iso ? Date.parse(iso) || 0 : 0);

export default function SharedInbox() {
  const { sharedArticles, sharedArticlesLoading, hasSharesInOtherLanguages } =
    useContext(SharedArticlesContext);
  const { texts, isAdding, error, forget } = useShortTexts();
  const { userDetails } = useContext(UserContext);
  const learned = userDetails?.learned_language;
  const textsHere = (texts || []).filter((text) => text.language === learned);
  const textsElsewhere = (texts || []).length > textsHere.length;

  if (isAdding) return <LoadingAnimation />;

  const items = [
    ...(sharedArticles || []).map((share) => ({ key: `a${share.id}`, at: when(share.created_at), share })),
    ...textsHere.map((text) => ({ key: `t${text.id}`, at: when(text.last_opened_at), text })),
  ].sort((a, b) => b.at - a.at);

  // Render the list only once both have loaded: otherwise rows jump in, or
  // the empty state flashes before them.
  const loaded = !sharedArticlesLoading && texts !== null;

  return (
    <>
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}

      {loaded && items.length === 0 && <s.YellowMessageBox>{strings.inboxEmpty}</s.YellowMessageBox>}
      {loaded && items.length > 0 && (
        <InboxList>
          {items.map((item) =>
            item.share ? (
              <SharedArticleRow key={item.key} share={item.share} />
            ) : (
              <ShortTextRow key={item.key} text={item.text} onForget={forget} />
            ),
          )}
        </InboxList>
      )}
      {loaded && items.length === 0 && (hasSharesInOtherLanguages || textsElsewhere) && (
        <s.YellowMessageBox>{strings.inboxSharesInOtherLanguages}</s.YellowMessageBox>
      )}
    </>
  );
}
