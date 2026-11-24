import { useContext } from "react";

import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import SharedArticleRow from "./SharedArticleRow";
import { InboxList } from "./SharedArticleRow.sc";
import * as s from "../components/TopMessage.sc";
import strings from "../i18n/definitions";

// Inbox: the articles friends share, newest first (SharedArticlesContext, in
// the language being learned). The learner's own texts are in Translate's
// History; the Inbox tab is only shown when friends have shared something.
export default function SharedInbox() {
  const { sharedArticles, sharedArticlesLoading, hasSharesInOtherLanguages } =
    useContext(SharedArticlesContext);

  // Nothing until loaded: the empty state would otherwise flash first
  if (sharedArticlesLoading) return null;

  if (!sharedArticles || sharedArticles.length === 0) {
    return (
      <s.YellowMessageBox>
        {hasSharesInOtherLanguages ? strings.inboxSharesInOtherLanguages : strings.inboxEmpty}
      </s.YellowMessageBox>
    );
  }

  return (
    <InboxList>
      {sharedArticles.map((share) => (
        <SharedArticleRow key={share.id} share={share} />
      ))}
    </InboxList>
  );
}
