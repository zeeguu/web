import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SpeechContext } from "../../contexts/SpeechContext";
import * as s from "../SessionHistory.sc";
import * as r from "./SessionRow.sc";
import * as w from "./WordsInContext.sc";
import { excerptParts } from "./excerpt";
import { formatDate, groupByDate } from "./sessionStats";
import { durationLabel, isSlim, sessionDetails, sessionTitle, showsBrowsingNote } from "./sessionCard";

const LEARNER_WORDS_SHOWN = 10;

// A word over its translation. For the learner: tap the word to hear it, the
// translation to edit it. For a teacher (onToggle): the pair opens the
// sentence it was translated in.
function WordPair({ word, isExercise, onEditClick, onToggle = null, isOpen = false }) {
  const speech = useContext(SpeechContext);
  const [isSpeaking, setIsSpeaking] = useState(false);

  async function speak(e) {
    e.preventDefault();
    if (isSpeaking) return;
    try {
      await speech.speakOut(word.origin, setIsSpeaking);
    } catch (err) {
      console.log("Speech error:", err);
    }
  }

  const canEdit = !onToggle && word.id && onEditClick;
  const marks = (
    <>
      {isExercise && <span className="mark">{word.correct ? "✓" : "✗"}</span>}
      {word.practised && (
        <span className="mark" title="Practised in exercises since">
          ★
        </span>
      )}
    </>
  );

  if (onToggle) {
    return (
      <r.Pair type="button" $clickable aria-expanded={isOpen} onClick={onToggle}>
        <span className="origin">
          {word.origin}
          {marks}
        </span>
        <span className="translation">{word.translation}</span>
      </r.Pair>
    );
  }

  return (
    <r.Pair as="div">
      <span className="origin">
        <s.ClickableOrigin onClick={speak} title="Click to pronounce" $isSpeaking={isSpeaking}>
          {word.origin}
        </s.ClickableOrigin>
        {marks}
      </span>
      {canEdit ? (
        <s.ClickableTranslation
          className="translation"
          onClick={(e) => {
            e.preventDefault();
            onEditClick(word.id);
          }}
          title="Click to edit"
        >
          {word.translation}
        </s.ClickableTranslation>
      ) : (
        <span className="translation">{word.translation}</span>
      )}
    </r.Pair>
  );
}

// A session's words. The learner sees the first few and can show the rest; a
// teacher sees them all and opens one at a time in its sentence (the word
// highlighted, "…" where the stored excerpt was cut).
function SessionWords({ session, onEditWord, forTeacher }) {
  const [open, setOpen] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const words = session.words || [];
  if (words.length === 0) return null;

  const shown = forTeacher || showAll ? words : words.slice(0, LEARNER_WORDS_SHOWN);
  const hidden = words.length - shown.length;
  const opened = open !== null ? words[open] : null;

  return (
    <>
      <r.Pairs>
        {shown.map((word, idx) => (
          <WordPair
            key={idx}
            word={word}
            isExercise={session.session_type === "exercise"}
            onEditClick={onEditWord}
            onToggle={forTeacher ? () => setOpen(open === idx ? null : idx) : null}
            isOpen={open === idx}
          />
        ))}
        {hidden > 0 && <r.More onClick={() => setShowAll(true)}>+{hidden} more</r.More>}
      </r.Pairs>
      {opened?.context && (
        <w.Excerpt>
          {excerptParts(opened).map((part, idx) => (part.isWord ? <mark key={idx}>{part.text}</mark> : part.text))}
        </w.Excerpt>
      )}
    </>
  );
}

function SessionItem({ session, onEditWord, linkArticles, forTeacher }) {
  const kind = session.session_type;
  const duration = durationLabel(session.duration);
  const details = sessionDetails(session);

  if (isSlim(session)) {
    return (
      <r.SlimRow $kind={kind}>
        <span>
          {details[0]} · {sessionTitle(session)}
        </span>
        <span>{duration}</span>
      </r.SlimRow>
    );
  }

  let title = sessionTitle(session);
  if (kind === "reading" && linkArticles && session.article_id) {
    title = <Link to={`/read/article?id=${session.article_id}`}>{title}</Link>;
  }

  return (
    <r.SessionRow $kind={kind}>
      <r.Head>
        <r.Title>{title}</r.Title>
        <r.Duration>{duration}</r.Duration>
      </r.Head>
      <r.Details>
        {details.join(" · ")}
        {session.focus_level === "distracted" && (
          <r.Distracted title="Left the page often during this session">Distracted</r.Distracted>
        )}
      </r.Details>
      <SessionWords session={session} onEditWord={onEditWord} forTeacher={forTeacher} />
    </r.SessionRow>
  );
}

// The sessions, grouped by day, newest first. Shared by the learner's History
// and the teacher's view of a student.
//
// onEditWord(bookmarkId): makes translations clickable for editing; leave it
// out where the words aren't the viewer's own.
// linkArticles: reading sessions link to the article in the reader. Off for a
// teacher, whose opening it would count as their own reading.
// forTeacher: every word shown, each opening the sentence it was translated
// in (the teacher variant of the API sends the sentences).
export default function SessionTimeline({ sessions, onEditWord = null, linkArticles = true, forTeacher = false }) {
  const groupedSessions = groupByDate(sessions);
  return (
    <>
      {Object.keys(groupedSessions).map((date) => (
        <div key={date}>
          <s.DateHeader>{formatDate(groupedSessions[date][0].start_time)}</s.DateHeader>
          {groupedSessions[date].map((session, idx) => (
            <SessionItem
              key={idx}
              session={session}
              onEditWord={onEditWord}
              linkArticles={linkArticles}
              forTeacher={forTeacher}
            />
          ))}
        </div>
      ))}
      {showsBrowsingNote(sessions) && <s.InfoNote>Browsing sessions are tracked since Dec 11, 2025</s.InfoNote>}
    </>
  );
}
