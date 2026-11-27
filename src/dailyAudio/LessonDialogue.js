import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { SpeechContext } from "../contexts/SpeechContext";
import InteractiveText from "../reader/InteractiveText";
import { TranslatableText } from "../reader/TranslatableText";
import { MainText } from "../reader/ArticleReader.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import useUserPreferences from "../hooks/useUserPreferences";
import useReaderFontSize from "../hooks/useReaderFontSize";
import strings from "../i18n/definitions";
import { lessonHasDialogue } from "./audioUtils";

// The API's ContextType.LESSON_DIALOGUE
const LESSON_DIALOGUE_CONTEXT = { context_type: "LessonDialogue" };

// One spoken line per paragraph, each opened with a dash, as dialogue is
// written in most of the languages learned here. The dash is drawn, not
// part of the text, so it is never a word to tap, save or hear.
// Inside the player card, under its row of actions: a thin line keeps the
// controls apart from the text.
const DialogueLines = styled.div`
  margin: 12px 0 4px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  text-align: left;

  .textParagraph {
    margin-bottom: 0.6em;
  }
  .textParagraph::before {
    content: "\\2013\\00a0";
    color: var(--text-secondary);
  }
`;

// Inside the player, on today's lesson and on an opened past lesson: the
// lesson's dialogue, word by word like a short text, to read along or after.
// Hidden until asked for: the lessons are listening practice, and an A0
// lesson promises the learner will understand the dialogue by the end.
//
// A hook, not a component: its button sits in the player's row of actions
// (LessonActionRow, next to Share) and its text under that row, so the two
// are placed by the caller. Loaded once: hiding and showing again needs no
// request; another lesson starts afresh.
//
// Returns { available, shown, loading, toggle, content }: available is false
// for a lesson without a dialogue (no button then), content is what goes
// under the row of actions (loading, an error, or the text).
export function useLessonDialogue(api, lesson) {
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  // The script had no dialogue to read (the API's 404): no button either
  const [noDialogue, setNoDialogue] = useState(false);

  const lessonId = lesson?.lesson_id;
  useEffect(() => {
    setInteractiveText(null);
    setOpen(false);
    setLoading(false);
    setFailed(false);
    setNoDialogue(false);
  }, [lessonId]);

  const available = !!lessonId && lessonHasDialogue(lesson) && !noDialogue;

  function logOpened(sourceId) {
    api.logUserActivity(api.OPEN_LESSON_DIALOGUE, "", lesson.lesson_id, "", sourceId);
  }

  function show() {
    if (interactiveText) {
      logOpened(interactiveText.sourceId);
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
        logOpened(loaded.source_id);
        setOpen(true);
      },
      () => setNoDialogue(true),
      () => {
        setLoading(false);
        setFailed(true);
      },
    );
  }

  const shown = !!(open && interactiveText);

  const content = available ? (
    <>
      {loading && <LoadingAnimation />}
      {failed && <FullWidthErrorMsg>{strings.couldNotOpenDialogue}</FullWidthErrorMsg>}
      {/* Kept mounted once loaded and only hidden, so showing it again
          does not fetch the reader's preferences again */}
      {interactiveText && (
        <div hidden={!shown}>
          <DialogueText api={api} interactiveText={interactiveText} />
        </div>
      )}
    </>
  ) : null;

  return { available, shown, loading, toggle: shown ? () => setOpen(false) : show, content };
}

// The text at the reader's settings (translate, pronounce, text size): the
// same stored preferences, read once, when the dialogue is first shown.
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
