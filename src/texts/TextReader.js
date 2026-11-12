import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "../reader/InteractiveText";
import { TranslatableText } from "../reader/TranslatableText";
import { MainText } from "../reader/ArticleReader.sc";
import BackArrow from "../pages/Settings/SharedComponents/BackArrow";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import FullWidthInfoMsg from "../components/FullWidthInfoMsg.sc";
import { StyledButton } from "../components/allButtons.sc";
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

const TextHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0 0.5rem;
  color: var(--text-secondary);
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
  justify-content: center;
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

  const learnedLanguage = userDetails?.learned_language;
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

  // Same text in the learned language; the misread one leaves the list
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
      {shortText && <span>{languageName(shortText.language)}</span>}
      {shortText && learnedLanguage && shortText.language !== learnedLanguage && (
        <ReadAsButton onClick={() => readAs(learnedLanguage)}>
          {strings.readAsLanguage} {languageName(learnedLanguage)}
        </ReadAsButton>
      )}
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

      {!translation && (
        <TextActions>
          <StyledButton $secondary disabled={isTranslating || !nativeLanguage} onClick={translateWholeText}>
            {isTranslating ? strings.translatingText : strings.translateWholeText}
          </StyledButton>
        </TextActions>
      )}
    </PaddedNarrowColumn>
  );
}
