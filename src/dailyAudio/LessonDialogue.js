import { useContext, useState } from "react";
import styled from "styled-components";

import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "../reader/InteractiveText";
import { TranslatableText } from "../reader/TranslatableText";
import { MainText } from "../reader/ArticleReader.sc";
import { WhiteRoundButton } from "../components/allButtons.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import useUserPreferences from "../hooks/useUserPreferences";
import useReaderFontSize from "../hooks/useReaderFontSize";
import strings from "../i18n/definitions";
import { lessonHasDialogue } from "./audioUtils";

// The API's ContextType.LESSON_DIALOGUE
const LESSON_DIALOGUE_CONTEXT = { context_type: "LessonDialogue" };

const DialogueToggle = styled.div`
  text-align: center;
  margin: 8px 0 4px;
`;

// One spoken line per paragraph, each opened with a dash, as dialogue is
// written in most of the languages learned here. The dash is drawn, not
// part of the text, so it is never a word to tap, save or hear.
const DialogueLines = styled.div`
  margin: 12px 0 8px;
  text-align: left;

  .textParagraph {
    margin-bottom: 0.6em;
  }
  .textParagraph::before {
    content: "\\2013\\00a0";
    color: var(--text-secondary);
  }
`;

// Under the player, on today's lesson and on an opened past lesson: the
// lesson's dialogue, word by word like a short text, to read along or after.
// Hidden until asked for: the lessons are listening practice, and an A0
// lesson promises the learner will understand the dialogue by the end.
// Renders nothing for a lesson without a dialogue.
//
// The button stays above the text and says Hide only once the text is on
// screen, never while it loads. Loaded once: hiding and showing again needs
// no request. Callers key it by lesson, so another lesson starts afresh.
export default function LessonDialogue({ api, lesson }) {
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  // The script had no dialogue to read (the API's 404): no button either
  const [noDialogue, setNoDialogue] = useState(false);

  if (!lesson?.lesson_id || !lessonHasDialogue(lesson) || noDialogue) return null;

  function show() {
    if (interactiveText) {
      setOpen(true);
      return;
    }
    if (loading) return;
    setLoading(true);
    setFailed(false);
    api.getLessonDialogue(
      lesson.lesson_id,
      (loaded) => {
        setLoading(false);
        setInteractiveText(
          new InteractiveText({
            tokenizedParagraphs: loaded.tokenized_paragraphs,
            sourceId: loaded.source_id,
            previousBookmarks: loaded.past_bookmarks,
            api,
            language: loaded.language,
            source: "lesson_dialogue",
            zeeguuSpeech: speech,
            contextIdentifier: LESSON_DIALOGUE_CONTEXT,
          }),
        );
        setOpen(true);
      },
      () => setNoDialogue(true),
      () => {
        setLoading(false);
        setFailed(true);
      },
    );
  }

  const shown = open && interactiveText;

  return (
    <>
      <DialogueToggle>
        <WhiteRoundButton
          as="button"
          type="button"
          aria-expanded={!!shown}
          aria-busy={loading}
          onClick={shown ? () => setOpen(false) : show}
        >
          {shown ? strings.hideTheDialogue : strings.showTheDialogue}
        </WhiteRoundButton>
      </DialogueToggle>
      {loading && <LoadingAnimation />}
      {failed && <FullWidthErrorMsg>{strings.couldNotOpenDialogue}</FullWidthErrorMsg>}
      {shown && <DialogueText api={api} interactiveText={interactiveText} />}
    </>
  );
}

// The text at the reader's settings (translate, pronounce, text size): the
// same stored preferences, read only once a dialogue is shown.
function DialogueText({ api, interactiveText }) {
  const { translateInReader, pronounceInReader, showMweHints } = useUserPreferences(api);
  const [readerFontSize] = useReaderFontSize();

  return (
    <DialogueLines style={{ fontSize: `${readerFontSize}px` }}>
      <MainText>
        <TranslatableText
          interactiveText={interactiveText}
          translating={translateInReader}
          pronouncing={pronounceInReader}
          showMweHints={showMweHints}
        />
      </MainText>
    </DialogueLines>
  );
}
