import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "./InteractiveText";
import { TranslatableText } from "./TranslatableText";
import { MainText } from "./ArticleReader.sc";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import { PageTitle } from "../components/PageTitle";
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

// Any text the learner brings: shared from another app (a WhatsApp message,
// a paragraph from a mail) or pasted. Read word by word like an article, but
// not stored as one.

// Bookmarks made here have no article behind them; the context type tells
// them apart from the article reader's (API: ContextType.SHARED_TEXT).
const SHARED_TEXT_CONTEXT = { context_type: "SharedText" };

const TextLanguage = styled.div`
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

const TextActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ShareHint = styled.p`
  color: var(--text-secondary);
  text-align: center;
`;

const WholeTextTranslation = styled(FullWidthInfoMsg)`
  white-space: pre-wrap;
  font-weight: normal;
  margin-top: 1rem;
`;

export default function TextReader() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const speech = useContext(SpeechContext);
  const history = useHistory();
  const location = useLocation();
  const { translateInReader, pronounceInReader, showMweHints } = useUserPreferences(api);

  const [draft, setDraft] = useState("");
  const [sharedText, setSharedText] = useState(null); // { text, language }
  const [interactiveLines, setInteractiveLines] = useState([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const learnedLanguage = userDetails?.learned_language;
  const nativeLanguage = userDetails?.native_language;

  useEffect(() => setTitle(strings.readTextTitle), []);

  function read(text, language = null) {
    setError("");
    setTranslation(null);
    setIsPreparing(true);
    api.prepareSharedText(
      text,
      language,
      (prepared) => {
        setSharedText({ text: prepared.text, language: prepared.language });
        // One per line of the text, as the article reader has one per fragment
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
        setError(typeof errorMessage === "string" && !/^HTTP \d+$/.test(errorMessage) ? errorMessage : strings.couldNotReadText);
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
      history.replace("/read/text");
      const shared = classifySharedText(params.get("text"), params.get("url"));
      if (shared.kind === "article") {
        history.replace("/shared-article?url=" + encodeURIComponent(shared.url));
        return;
      }
      if (shared.kind === "text") read(shared.text);
    }

    const pending = takePendingSharedText();
    if (pending) read(pending);
    return onSharedText((text) => read(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function readAnother() {
    setSharedText(null);
    setInteractiveLines([]);
    setTranslation(null);
    setDraft("");
    setError("");
  }

  function translateWholeText() {
    setIsTranslating(true);
    api.translateSharedText(
      sharedText.text,
      sharedText.language,
      nativeLanguage,
      (result) => {
        setTranslation(result.translation);
        setIsTranslating(false);
      },
      () => {
        setIsTranslating(false);
        setError(strings.couldNotTranslateText);
      },
    );
  }

  if (isPreparing) return <LoadingAnimation />;

  if (!sharedText) {
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
          <StyledButton $primary disabled={!draft.trim()} onClick={() => read(draft.trim())}>
            {strings.readText}
          </StyledButton>
        </TextActions>
      </PaddedNarrowColumn>
    );
  }

  return (
    <PaddedNarrowColumn>
      <TextLanguage>
        <span>{languageName(sharedText.language)}</span>
        {learnedLanguage && sharedText.language !== learnedLanguage && (
          <ReadAsButton onClick={() => read(sharedText.text, learnedLanguage)}>
            {strings.readAsLanguage} {languageName(learnedLanguage)}
          </ReadAsButton>
        )}
      </TextLanguage>

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

      {translation && <WholeTextTranslation>{translation}</WholeTextTranslation>}
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}

      <TextActions>
        {!translation && (
          <StyledButton $secondary disabled={isTranslating} onClick={translateWholeText}>
            {isTranslating ? strings.translatingText : strings.translateWholeText}
          </StyledButton>
        )}
        <StyledButton $navigation onClick={readAnother}>
          {strings.readAnotherText}
        </StyledButton>
      </TextActions>
    </PaddedNarrowColumn>
  );
}
