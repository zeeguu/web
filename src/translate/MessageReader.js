import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "../reader/InteractiveText";
import { TranslatableText } from "../reader/TranslatableText";
import { MainText } from "../reader/ArticleReader.sc";
import ClearableInput from "../components/ClearableInput";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import FullWidthInfoMsg from "../components/FullWidthInfoMsg.sc";
import { StyledButton } from "../components/allButtons.sc";
import useUserPreferences from "../hooks/useUserPreferences";
import { setTitle } from "../assorted/setTitle";
import { languageName } from "../utils/misc/languageCodeToName";
import strings from "../i18n/definitions";
import { classifySharedText, takePendingSharedText, onSharedText, MAX_SHARED_TEXT_CHARS } from "./sharedText";

// Bookmarks made here have no article behind them; the context type tells
// them apart from the reader's (API: ContextType.SHARED_TEXT).
const SHARED_TEXT_CONTEXT = { context_type: "SharedText" };

const MessageLanguage = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const ReadAsButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--text-secondary);
  text-decoration: underline;
  cursor: pointer;
`;

const MessageActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ShareHint = styled.p`
  color: var(--text-secondary);
  text-align: center;
`;

const MessageTranslation = styled(FullWidthInfoMsg)`
  white-space: pre-wrap;
  font-weight: normal;
  margin-top: 1rem;
`;

export default function MessageReader() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const speech = useContext(SpeechContext);
  const history = useHistory();
  const location = useLocation();
  const { translateInReader, pronounceInReader, showMweHints } = useUserPreferences(api);

  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState(null); // { text, language }
  const [interactiveLines, setInteractiveLines] = useState([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const learnedLanguage = userDetails?.learned_language;
  const nativeLanguage = userDetails?.native_language;

  useEffect(() => setTitle(strings.messageTab), []);

  function read(text, language = null) {
    setError("");
    setTranslation(null);
    setIsPreparing(true);
    api.prepareSharedText(
      text,
      language,
      (prepared) => {
        setMessage({ text: prepared.text, language: prepared.language });
        // One per line of the message, as the article reader has one per fragment
        setInteractiveLines(
          prepared.tokenized_lines.map(
            (tokenizedParagraphs) =>
              new InteractiveText({
                tokenizedParagraphs,
                sourceId: null,
                api,
                language: prepared.language,
                source: "shared_text",
                zeeguuSpeech: speech,
                contextIdentifier: SHARED_TEXT_CONTEXT,
              }),
          ),
        );
        setIsPreparing(false);
      },
      (errorMessage) => {
        setIsPreparing(false);
        setError(typeof errorMessage === "string" && !/^HTTP \d+$/.test(errorMessage) ? errorMessage : strings.couldNotReadMessage);
      },
    );
  }

  // A message arrives three ways: native share sheet (index.js puts it in
  // the inbox), the installed web app's share target (?text=), or pasting.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("text") || params.has("url")) {
      // Out of the URL straight away: it would otherwise sit in the history
      // and in error reports.
      history.replace("/translate/message");
      const shared = classifySharedText(params.get("text"), params.get("url"));
      if (shared.kind === "article") {
        history.replace("/shared-article?url=" + encodeURIComponent(shared.url));
        return;
      }
      if (shared.kind === "message") read(shared.text);
    }

    const pending = takePendingSharedText();
    if (pending) read(pending);
    return onSharedText((text) => read(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function readAnother() {
    setMessage(null);
    setInteractiveLines([]);
    setTranslation(null);
    setDraft("");
    setError("");
  }

  function translateWholeMessage() {
    setIsTranslating(true);
    api.translateSharedText(
      message.text,
      message.language,
      nativeLanguage,
      (result) => {
        setTranslation(result.translation);
        setIsTranslating(false);
      },
      () => {
        setIsTranslating(false);
        setError(strings.couldNotTranslateMessage);
      },
    );
  }

  if (isPreparing) return <LoadingAnimation />;

  if (!message) {
    return (
      <>
        <ShareHint>{strings.messageShareHint}</ShareHint>
        <ClearableInput
          value={draft}
          rows={4}
          maxLength={MAX_SHARED_TEXT_CHARS}
          placeholder={strings.pasteMessagePlaceholder}
          onChange={(e) => setDraft(e.target.value)}
          onClear={() => setDraft("")}
          style={{ textAlign: "left" }}
        />
        {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}
        <MessageActions>
          <StyledButton $primary disabled={!draft.trim()} onClick={() => read(draft.trim())}>
            {strings.readMessage}
          </StyledButton>
        </MessageActions>
      </>
    );
  }

  return (
    <>
      <MessageLanguage>
        <span>{languageName(message.language)}</span>
        {learnedLanguage && message.language !== learnedLanguage && (
          <ReadAsButton onClick={() => read(message.text, learnedLanguage)}>
            {strings.readAsLanguage} {languageName(learnedLanguage)}
          </ReadAsButton>
        )}
      </MessageLanguage>

      <MainText>
        {interactiveLines.map((interactiveText, i) => (
          <TranslatableText
            key={i}
            interactiveText={interactiveText}
            translating={translateInReader}
            pronouncing={pronounceInReader}
            showMweHints={showMweHints}
          />
        ))}
      </MainText>

      {translation && <MessageTranslation>{translation}</MessageTranslation>}
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}

      <MessageActions>
        {!translation && (
          <StyledButton $secondary disabled={isTranslating} onClick={translateWholeMessage}>
            {isTranslating ? strings.translatingMessage : strings.translateWholeMessage}
          </StyledButton>
        )}
        <StyledButton $navigation onClick={readAnother}>
          {strings.readAnotherMessage}
        </StyledButton>
      </MessageActions>
    </>
  );
}
