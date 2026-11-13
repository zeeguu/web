import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import { PageTitle } from "../components/PageTitle";
import ClearableInput from "../components/ClearableInput";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import { StyledButton } from "../components/allButtons.sc";
import { MetaStrip, MetaItem } from "../components/MetaStrip.sc";
import * as row from "../articles/SavedArticleRow.sc";
import { Row } from "../articles/SharedArticleRow.sc";
import { setTitle } from "../assorted/setTitle";
import { languageName } from "../utils/misc/languageCodeToName";
import { timeAgo } from "../utils/misc/readableTime";
import { readableApiError } from "../utils/misc/readableApiError";
import strings from "../i18n/definitions";
import { classifySharedText, takePendingSharedText, onSharedText, MAX_SHARED_TEXT_CHARS } from "./sharedText";

// /texts: bring a short text to read (paste it, or share it here from another
// app, e.g. a WhatsApp message), and the texts brought before. Long texts with
// a title are articles, and open in the article reader instead.

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

export default function ShortTexts() {
  const api = useContext(APIContext);
  const history = useHistory();
  const location = useLocation();

  const [draft, setDraft] = useState("");
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
      history.replace("/texts");
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

  return (
    <PaddedNarrowColumn>
      <PageTitle>{strings.readTextTitle}</PageTitle>
      <ShareHint>{strings.readTextHint}</ShareHint>
      <ClearableInput
        value={draft}
        rows={4}
        maxLength={MAX_SHARED_TEXT_CHARS}
        placeholder={strings.pasteTextPlaceholder}
        onChange={(e) => setDraft(e.target.value)}
        onClear={() => setDraft("")}
        style={{ textAlign: "left" }}
      />
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}
      <TextActions>
        <StyledButton $primary disabled={!draft.trim()} onClick={() => bring(draft)}>
          {strings.readText}
        </StyledButton>
      </TextActions>

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
    </PaddedNarrowColumn>
  );
}
