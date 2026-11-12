import { useContext } from "react";
import styled from "styled-components";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ReactLink from "../components/ReactLink.sc";
import strings from "../i18n/definitions";
import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import SharedArticleRow from "./SharedArticleRow";
import { InboxList } from "./SharedArticleRow.sc";
import * as s from "../components/TopMessage.sc";

// "Shared with you" inbox — articles friends have sent, rendered with the
// saved-article row styling. Lives as its own tab in the reading area; the list
// comes from SharedArticlesContext (refetched on navigation and polled while visible).
//
// The inbox is where reading arrives from outside, so it is also where the
// learner brings in a text of their own (/texts; texts shared from other apps
// land there directly).

const OwnTextLinkRow = styled.div`
  display: flex;
  justify-content: center;
`;

function OwnTextLink() {
  return (
    <OwnTextLinkRow>
      <ReactLink className="small" to="/texts">
        <AddRoundedIcon /> {strings.readYourOwnText}
      </ReactLink>
    </OwnTextLinkRow>
  );
}

export default function SharedInbox() {
  const { sharedArticles, sharedArticlesLoading, hasSharesInOtherLanguages } =
    useContext(SharedArticlesContext);

  // Render nothing until we're actually loaded — otherwise the empty-state
  // message flashes for a beat before the shares (or the real empty state)
  // resolve.
  if (sharedArticlesLoading) return null;

  if (!sharedArticles || sharedArticles.length === 0) {
    // The inbox is per-language, so "nothing here" can mean two different
    // things — say which, so it isn't misleading when shares exist elsewhere.
    const emptyMessage = hasSharesInOtherLanguages
      ? "No shared articles in the language you're studying right now. Friends have sent you some in another language — switch languages to see them."
      : "Nothing shared with you yet. When a friend sends you an article, it shows up here — in the language you're learning, at your level.";
    return (
      <>
        <OwnTextLink />
        <s.YellowMessageBox>{emptyMessage}</s.YellowMessageBox>
      </>
    );
  }

  return (
    <InboxList>
      <OwnTextLink />
      {sharedArticles.map((share) => (
        <SharedArticleRow key={share.id} share={share} />
      ))}
    </InboxList>
  );
}
