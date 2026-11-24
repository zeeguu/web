import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
import { TabHeading } from "../articles/_ArticlesRouter.sc";
import useUserPreferences from "../hooks/useUserPreferences";
import useReaderFontSize from "../hooks/useReaderFontSize";
import useQuery from "../hooks/useQuery";
import useGuardedLanguageSwitch from "../hooks/useGuardedLanguageSwitch";
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

// The way to correct the guessed language, rarely needed: a small gray link
// ("Not Danish?") that opens the list of languages. A select, so the phone
// shows its own picker; it always shows the question, never a language.
const NotThisLanguage = styled.select`
  appearance: none;
  background: none;
  border: none;
  padding: 0.25rem 0;
  font: inherit;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 0.25em;
  cursor: pointer;
`;

// The text at the reader's size, as an article reads (useReaderFontSize is
// the same setting)
const TextBody = styled.div``;

// A note, not an alarm: the learner may well have meant to bring this text
const LanguageNote = styled.p`
  margin: 0 0 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
`;

// Deliberately quiet, in the muted style of the language picker: a way out,
// not the page's main action.
const QuietLink = styled.button`
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

  @media (hover: hover) {
    &:hover {
      color: var(--text-secondary);
    }
  }
`;

export default function TextReader() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnableLanguages = useContext(SystemLanguagesContext)?.sortedSystemLanguages?.learnable_languages;
  const speech = useContext(SpeechContext);
  const history = useHistory();
  const location = useLocation();
  const id = Number(useQuery().get("id"));
  // Where the text was opened from: Translate says so; History, a share or a
  // link don't, and back goes to History, where the text is kept
  const backTo = location.state?.backTo || "/translate/history";
  const { pronounceInReader, showMweHints } = useUserPreferences(api);
  const [readerFontSize] = useReaderFontSize();
  const { requestSwitch, confirmModal } = useGuardedLanguageSwitch();

  const [shortText, setShortText] = useState(null); // as GET /short_texts/<id> answers
  const [interactiveText, setInteractiveText] = useState(null);
  const [error, setError] = useState("");

  // The text on screen; answers for any other (an earlier, slower request,
  // or a text re-read in another language) are dropped
  const shownId = useRef(id);
  shownId.current = id;

  useEffect(() => setTitle(strings.readTextTitle), []);

  useEffect(() => {
    setShortText(null);
    setInteractiveText(null);
    setError("");
    if (!id) {
      history.replace("/translate/history");
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
      (added) => history.replace(`/texts/read?id=${added.id}`, location.state),
      (errorMessage) => setError(readableApiError(errorMessage, strings.couldNotReadText)),
    );
  }

  const header = (
    <TextHeader>
      <BackArrow redirectLink={backTo} />
      {shortText && learnableLanguages && (
        <NotThisLanguage
          aria-label={strings.languageOfThisText}
          value=""
          onChange={(e) => e.target.value && readAs(e.target.value)}
        >
          <option value="" disabled hidden>
            {strings.formatString(strings.notThisLanguage, languageName(shortText.language))}
          </option>
          {learnableLanguages
            .filter((language) => language.code !== shortText.language)
            .map((language) => (
              <option key={language.code} value={language.code}>
                {languageName(language.code)}
              </option>
            ))}
        </NotThisLanguage>
      )}
    </TextHeader>
  );

  // The guess leans on the learned language, so a text guessed as another one
  // most likely is: say so, quietly, with the way to read it in that language.
  // A wrong guess is corrected with the language picker above.
  const learned = userDetails?.learned_language;
  const canSwitchToTextLanguage = learnableLanguages?.some((language) => language.code === shortText?.language);
  const notInLearnedLanguage = learned && shortText && shortText.language !== learned && (
    <LanguageNote>
      {strings.formatString(strings.textNotInLearnedLanguage, languageName(shortText.language), languageName(learned))}{" "}
      {canSwitchToTextLanguage && (
        <QuietLink onClick={() => requestSwitch(shortText.language)}>
          {strings.formatString(strings.switchToLanguage, languageName(shortText.language))}
        </QuietLink>
      )}
    </LanguageNote>
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
      {/* A text has no title of its own: the page says what it is, in the
          title-and-one-sentence style of the Read tabs */}
      <TabHeading>
        <h1>{strings.yourTextTitle}</h1>
        <p>{strings.yourTextIntro}</p>
      </TabHeading>
      {notInLearnedLanguage}
      {confirmModal}

      <TextBody style={{ fontSize: `${readerFontSize}px` }}>
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
      </TextBody>

      {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}
    </PaddedNarrowColumn>
  );
}
