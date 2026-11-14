import { useContext } from "react";
import styled from "styled-components";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";

import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import SharedArticleRow from "./SharedArticleRow";
import { InboxList } from "./SharedArticleRow.sc";
import * as s from "../components/TopMessage.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import { StyledButton } from "../components/allButtons.sc";
import ShortTextRow from "../texts/ShortTextRow";
import useShortTexts from "../texts/useShortTexts";
import strings from "../i18n/definitions";

// Inbox: everything that comes into Zeeguu from outside, newest first. The
// articles friends send (SharedArticlesContext, per language), and the texts
// the learner shares from another app or pastes (useShortTexts). Most learners
// get nothing from friends, so their own texts are what makes it useful.

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

const when = (iso) => (iso ? Date.parse(iso) || 0 : 0);

export default function SharedInbox() {
  const { sharedArticles, sharedArticlesLoading, hasSharesInOtherLanguages } =
    useContext(SharedArticlesContext);
  const { texts, isAdding, error, forget, pasteFromClipboard } = useShortTexts();

  if (isAdding) return <LoadingAnimation />;

  const items = [
    ...(sharedArticles || []).map((share) => ({ key: `a${share.id}`, at: when(share.created_at), share })),
    ...(texts || []).map((text) => ({ key: `t${text.id}`, at: when(text.last_opened_at), text })),
  ].sort((a, b) => b.at - a.at);

  // Render the list only once both have loaded: otherwise rows jump in, or
  // the empty state flashes before them.
  const loaded = !sharedArticlesLoading && texts !== null;

  return (
    <>
      <Actions>
        <StyledButton onClick={pasteFromClipboard}>
          <ContentPasteRoundedIcon style={{ fontSize: "1.1rem", verticalAlign: "-0.2em", marginRight: "0.3rem" }} />
          {strings.pasteFromClipboard}
        </StyledButton>
      </Actions>
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
      {/* The friends' articles are per language; the texts are not. */}
      {loaded && hasSharesInOtherLanguages && (!sharedArticles || sharedArticles.length === 0) && (
        <s.YellowMessageBox>{strings.inboxSharesInOtherLanguages}</s.YellowMessageBox>
      )}
    </>
  );
}
