import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import { PageTitle } from "../components/PageTitle";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import { MetaStrip, MetaItem } from "../components/MetaStrip.sc";
import * as row from "../articles/SavedArticleRow.sc";
import { Row } from "../articles/SharedArticleRow.sc";
import { setTitle } from "../assorted/setTitle";
import { languageName } from "../utils/misc/languageCodeToName";
import { timeAgo } from "../utils/misc/readableTime";
import { readableApiError } from "../utils/misc/readableApiError";
import strings from "../i18n/definitions";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import { StyledButton } from "../components/allButtons.sc";
import { classifySharedText, takePendingSharedText, onSharedText, MAX_SHARED_TEXT_CHARS } from "./sharedText";

// /translate/texts (the "Your texts" tab in Translate; /texts redirects there): the
// short texts the learner shared with Zeeguu from other apps (e.g. a WhatsApp
// message). A share opens here and goes straight to the reader. Long texts
// with a title are articles, and open in the article reader instead.

const ShareHint = styled.p`
  color: var(--text-secondary);
  text-align: center;
`;

const TextActions = styled.div`
  display: flex;
  justify-content: center;
`;

const TextList = styled.div`
  margin-top: 1rem;
`;

export default function ShortTexts({ inTab = false }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const location = useLocation();

  const [texts, setTexts] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setTitle(strings.readTextTitle), []);

  useEffect(() => {
    api.getShortTexts(setTexts, () => setTexts([]));
  }, [api]);

  // A link opens as an article; any other text is kept and opened to read
  function bring(text, url = "") {
    const brought = classifySharedText(text, url);
    if (brought.kind === "article") {
      history.push("/shared-article?url=" + encodeURIComponent(brought.url));
      return;
    }
    if (brought.kind !== "text") return;

    setError("");
    setIsAdding(true);
    api.addShortText(
      brought.text,
      {},
      ({ id }) => history.push(`/texts/read?id=${id}`),
      (errorMessage) => {
        setIsAdding(false);
        setError(readableApiError(errorMessage, strings.couldNotReadText));
      },
    );
  }

  // Text arrives three ways: native share sheet (index.js puts it in the
  // inbox), the installed web app's share target (?text=), or pasting.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("text") || params.has("url")) {
      // Out of the URL straight away: it would otherwise sit in the history
      // and in error reports.
      history.replace("/translate/texts");
      bring(params.get("text"), params.get("url"));
    }

    const pending = takePendingSharedText();
    if (pending) bring(pending);
    return onSharedText((text) => bring(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function forget(e, id) {
    e.stopPropagation();
    api.forgetShortText(
      id,
      () => setTexts((current) => current.filter((each) => each.id !== id)),
      () => setError(strings.couldNotRemoveText),
    );
  }

  if (isAdding) return <LoadingAnimation />;

  // For a text that is easier to copy than to share. The clipboard is read
  // only on the tap: the browser (and the iOS app's web view) allows it then,
  // and asks nothing up front. Whether it holds text cannot be known before,
  // so the button is always there, and says so when there is nothing.
  async function pasteFromClipboard() {
    setError("");
    try {
      const text = await navigator.clipboard.readText();
      // The API keeps at most this much of a text.
      if (text && text.trim()) bring(text.slice(0, MAX_SHARED_TEXT_CHARS));
      else setError(strings.nothingToPaste);
    } catch {
      setError(strings.nothingToPaste);
    }
  }

  // As a tab the tab row already names the page and gives the column.
  const Wrapper = inTab ? Fragment : PaddedNarrowColumn;
  return (
    <Wrapper>
      {!inTab && <PageTitle>{strings.readTextTitle}</PageTitle>}
      <ShareHint>{strings.yourTextsIntro}</ShareHint>
      <TextActions>
        <StyledButton onClick={pasteFromClipboard}>
          <ContentPasteRoundedIcon style={{ fontSize: "1.1rem", verticalAlign: "-0.2em", marginRight: "0.3rem" }} />
          {strings.pasteFromClipboard}
        </StyledButton>
      </TextActions>
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}

      {texts && texts.length > 0 && (
        <TextList>
          {texts.map((text) => (
            <Row
              key={text.id}
              role="button"
              tabIndex={0}
              onClick={() => history.push(`/texts/read?id=${text.id}`)}
              // Only keys aimed at the row itself: Enter on × bubbles here too
              onKeyDown={(e) =>
                e.target === e.currentTarget &&
                (e.key === "Enter" || e.key === " ") &&
                history.push(`/texts/read?id=${text.id}`)
              }
            >
              <row.Content>
                <row.Title>{text.preview}</row.Title>
                <MetaStrip>
                  <MetaItem>{languageName(text.language)}</MetaItem>
                  <MetaItem>{timeAgo(text.last_opened_at)}</MetaItem>
                </MetaStrip>
              </row.Content>
              <row.RemoveButton aria-label={strings.removeText} title={strings.removeText} onClick={(e) => forget(e, text.id)}>
                ×
              </row.RemoveButton>
            </Row>
          ))}
        </TextList>
      )}
    </Wrapper>
  );
}
