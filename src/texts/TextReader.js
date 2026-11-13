import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { SystemLanguagesContext } from "../contexts/SystemLanguagesContext";
import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "../reader/InteractiveText";
import { TranslatableText } from "../reader/TranslatableText";
import { MainText } from "../reader/ArticleReader.sc";
import BackArrow from "../pages/Settings/SharedComponents/BackArrow";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import FullWidthInfoMsg from "../components/FullWidthInfoMsg.sc";
import useUserPreferences from "../hooks/useUserPreferences";
import useQuery from "../hooks/useQuery";
import { setTitle } from "../assorted/setTitle";
import { languageName } from "../utils/misc/languageCodeToName";
import { readableApiError } from "../utils/misc/readableApiError";
import strings from "../i18n/definitions";

// /texts/read?id=N: a short text the learner brought (a WhatsApp message, a
// mail paragraph), read word by word like an article but without a title.
// Words tapped here are bookmarked with the text's source, so they show
// again when the text is reopened.

// The API's ContextType.SHORT_TEXT
const SHORT_TEXT_CONTEXT = { context_type: "ShortText" };

// Back on the left, language on the right: far apart, so going back doesn't
// hit the picker and re-read the text in another language.
const TextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 1rem 0 0.5rem;
  color: var(--text-secondary);
`;

// The language the text is read in, and the way to correct it: the guess
// leans on the learned language, so it can be wrong in either direction.
const TextLanguagePicker = styled.select`
  background: var(--bg-primary);
  border: none;
  border-bottom: 1px dashed var(--text-muted);
  padding: 0.1rem 0;
  font: inherit;
  color: var(--text-secondary);
  cursor: pointer;
`;

// Deliberately quiet, in the muted style of the language picker: a way out
// when a few lines won't come together, not the page's main action.
const WholeTextLink = styled.button`
  display: block;
  margin-top: 1.5rem;
  padding: 0.25rem 0;
  background: none;
  border: none;
  font: inherit;
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 0.25em;
  cursor: pointer;

  &:disabled {
    cursor: default;
    text-decoration: none;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      color: var(--text-secondary);
    }
  }
`;

const WholeTextTranslation = styled(FullWidthInfoMsg)`
  white-space: pre-wrap;
  font-weight: normal;
  margin-top: 1rem;
`;

export default function TextReader() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnableLanguages = useContext(SystemLanguagesContext)?.sortedSystemLanguages?.learnable_languages;
  const speech = useContext(SpeechContext);
  const history = useHistory();
  const id = Number(useQuery().get("id"));
  const { pronounceInReader, showMweHints } = useUserPreferences(api);

  const [shortText, setShortText] = useState(null); // as GET /short_texts/<id> answers
  const [interactiveText, setInteractiveText] = useState(null);
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // The text on screen; answers for any other (an earlier, slower request,
  // or a text replaced by "Read as") are dropped
  const shownId = useRef(id);
  shownId.current = id;

  // Where InteractiveText sends the word taps, so the whole text and its words
  // come back in the same language; userDetails may not have loaded yet on a
  // cold-start share.
  const nativeLanguage = localStorage.native_language || userDetails?.native_language;

  useEffect(() => setTitle(strings.readTextTitle), []);

  useEffect(() => {
    setShortText(null);
    setInteractiveText(null);
    setTranslation(null);
    setIsTranslating(false);
    setError("");
    if (!id) {
      history.replace("/texts");
      return;
    }
    api.getShortText(
      id,
      (loaded) => {
        if (loaded.id !== shownId.current) return;
        setShortText(loaded);
        setInteractiveText(
          new InteractiveText({
            tokenizedParagraphs: loaded.tokenized_paragraphs,
            sourceId: loaded.source_id,
            previousBookmarks: loaded.past_bookmarks,
            api,
            language: loaded.language,
            source: "short_text",
            zeeguuSpeech: speech,
            contextIdentifier: SHORT_TEXT_CONTEXT,
          }),
        );
      },
      () => {
        if (id === shownId.current) setError(strings.couldNotOpenText);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Same text in another language; the misread one leaves the list
  function readAs(language) {
    api.addShortText(
      shortText.text,
      { language, insteadOf: shortText.id },
      (added) => history.replace(`/texts/read?id=${added.id}`),
      (errorMessage) => setError(readableApiError(errorMessage, strings.couldNotReadText)),
    );
  }

  function translateWholeText() {
    const forId = shortText.id;
    setIsTranslating(true);
    api.translateShortText(
      forId,
      nativeLanguage,
      (result) => {
        if (forId !== shownId.current) return;
        setTranslation(result.translation);
        setIsTranslating(false);
      },
      () => {
        if (forId !== shownId.current) return;
        setIsTranslating(false);
        setError(strings.couldNotTranslateText);
      },
    );
  }

  const header = (
    <TextHeader>
      <BackArrow redirectLink="/texts" />
      {shortText &&
        (learnableLanguages ? (
          <TextLanguagePicker
            aria-label={strings.languageOfThisText}
            value={shortText.language}
            onChange={(e) => readAs(e.target.value)}
          >
            {learnableLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {languageName(language.code)}
              </option>
            ))}
          </TextLanguagePicker>
        ) : (
          <span>{languageName(shortText.language)}</span>
        ))}
    </TextHeader>
  );

  if (!shortText) {
    return (
      <PaddedNarrowColumn>
        {header}
        {error ? <FullWidthErrorMsg>{error}</FullWidthErrorMsg> : <LoadingAnimation />}
      </PaddedNarrowColumn>
    );
  }

  return (
    <PaddedNarrowColumn>
      {header}

      <MainText>
        <TranslatableText
          interactiveText={interactiveText}
          // Always on: tapping to translate is what this page is for, even
          // for a learner who switched it off in the article reader
          translating={true}
          pronouncing={pronounceInReader}
          showMweHints={showMweHints}
        />
      </MainText>

      {translation && <WholeTextTranslation>{translation}</WholeTextTranslation>}
      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}

      {/* Only on request, and only for a message-sized text (the API says
          which): a way out when a few lines won't come together, not a
          substitute for reading */}
      {shortText.can_translate_whole && !translation && (
        <WholeTextLink disabled={isTranslating || !nativeLanguage} onClick={translateWholeText}>
          {isTranslating ? strings.translatingText : strings.translateWholeText}
        </WholeTextLink>
      )}
    </PaddedNarrowColumn>
  );
}
