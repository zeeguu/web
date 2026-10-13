import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import { SpeechContext } from "../../contexts/SpeechContext";
import * as s from "../SessionHistory.sc";
import * as r from "./SessionRow.sc";
import * as w from "./WordsInContext.sc";
import { excerptParts } from "./excerpt";
import { formatDate, groupByDate } from "./sessionStats";
import {
  awayStretches,
  durationLabel,
  groupBrowsingWords,
  groupExerciseWords,
  isSlim,
  leftThePage,
  practisedCount,
  sessionDetails,
  sessionTitle,
  showsBrowsingNote,
} from "./sessionCard";

const LEARNER_WORDS_SHOWN = 10;

// The dumbbell of the Exercises tab: on a word, "practised in exercises since".
// The card's details line says so in words, so it needs no hover to explain.
function PractisedIcon({ className }) {
  return <FitnessCenterRoundedIcon className={className} titleAccess="Practised in exercises since" />;
}

// A word over its translation. For the learner: tap the word to hear it, the
// translation to edit it. For a teacher (forTeacher): the word alone -- what
// matters is which words the student looked up, not what they mean; onToggle
// opens the sentence it was translated in.
function WordPair({ word, results = null, onEditClick, onToggle = null, isOpen = false, forTeacher = false }) {
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
      {results &&
        results.map((ok, idx) => (
          <r.Result key={idx} $ok={ok} title={ok ? "right" : "wrong"}>
            {ok ? "✓" : "✗"}
          </r.Result>
        ))}
      {word.practised && <PractisedIcon className="mark" />}
    </>
  );

  if (forTeacher) {
    const origin = (
      <span className="origin">
        {word.origin}
        {marks}
      </span>
    );
    return onToggle ? (
      <r.Pair type="button" $clickable aria-expanded={isOpen} onClick={onToggle}>
        {origin}
      </r.Pair>
    ) : (
      <r.Pair as="div">{origin}</r.Pair>
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

// An exercise session's words, each once with its results (✓ green, ✗ red),
// the ones that needed help first.
function ExerciseWords({ words, onEditWord, forTeacher }) {
  const { neededHelp, right } = groupExerciseWords(words);
  const group = (label, list) =>
    list.length > 0 && (
      <r.ExerciseGroup>
        <r.GroupLabel>{label}</r.GroupLabel>
        <r.Pairs>
          {list.map((word, idx) => (
            <WordPair key={idx} word={word} results={word.results} onEditClick={onEditWord} forTeacher={forTeacher} />
          ))}
        </r.Pairs>
      </r.ExerciseGroup>
    );
  return (
    <>
      {group("Needed help", neededHelp)}
      {group("Right every time", right)}
    </>
  );
}

// A session's words. The learner sees the first few and can show the rest; a
// teacher sees them all and opens one at a time in its sentence (the word
// highlighted, "…" where the stored excerpt was cut). A browsing session's
// words stand under the title of the article they were translated in on the
// article list; the learner's title opens the article.
function SessionWords({ session, onEditWord, forTeacher, linkArticles }) {
  const [open, setOpen] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const words = session.words || [];
  if (words.length === 0) return null;

  if (session.session_type === "exercise") {
    return <ExerciseWords words={words} onEditWord={onEditWord} forTeacher={forTeacher} />;
  }

  const browsing = session.session_type === "browsing";
  const shown = forTeacher || showAll || browsing ? words : words.slice(0, LEARNER_WORDS_SHOWN);
  const hidden = words.length - shown.length;
  const opened = open !== null ? words[open] : null;
  const groups = browsing ? groupBrowsingWords(shown) : [{ articleId: null, title: null, words: shown }];

  return groups.map((group, groupIdx) => (
    <r.ArticleGroup key={group.articleId ?? "none"}>
      {group.title && (
        <r.ArticleLabel>
          {linkArticles ? <Link to={`/read/article?id=${group.articleId}`}>{group.title}</Link> : group.title}
        </r.ArticleLabel>
      )}
      <r.Pairs>
        {group.words.map((word) => {
          const idx = words.indexOf(word);
          return (
            <WordPair
              key={idx}
              word={word}
              onEditClick={onEditWord}
              onToggle={forTeacher ? () => setOpen(open === idx ? null : idx) : null}
              isOpen={open === idx}
              forTeacher={forTeacher}
            />
          );
        })}
        {hidden > 0 && groupIdx === groups.length - 1 && (
          <r.More onClick={() => setShowAll(true)}>+{hidden} more</r.More>
        )}
      </r.Pairs>
      {opened?.context && group.words.includes(opened) && (
        <w.Excerpt>
          {excerptParts(opened).map((part, idx) => (part.isWord ? <mark key={idx}>{part.text}</mark> : part.text))}
        </w.Excerpt>
      )}
    </r.ArticleGroup>
  ));
}

// For a teacher: the reading session from start to last action, the page in
// focus in the reading colour, every trip to another tab or app in red, the
// article closed (between two readings) in grey -- so twenty short trips
// elsewhere look different from twenty minutes of reading.
function FocusStrip({ session }) {
  const stretches = awayStretches(session);
  return (
    <r.FocusStrip
      role="img"
      aria-label={`On the page, away ${stretches.length} times`}
      title={`From ${new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to ${new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: red is away in another tab or app, grey is the article closed`}
    >
      {stretches.map((stretch, idx) => (
        <r.Away key={idx} $closed={stretch.closed} style={{ left: `${stretch.left}%`, width: `${stretch.width}%` }} />
      ))}
    </r.FocusStrip>
  );
}

function SessionItem({ session, onEditWord, linkArticles, forTeacher, studentArticlePath }) {
  const kind = session.session_type;
  const duration = durationLabel(session.duration);
  const details = sessionDetails(session);
  const practised = practisedCount(session);

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
  } else if (kind === "reading" && forTeacher && studentArticlePath && session.article_id) {
    // the text as the student left it, their translations in place
    title = <Link to={studentArticlePath(session.article_id)}>{title}</Link>;
  }

  return (
    <r.SessionRow $kind={kind}>
      <r.Head>
        <r.Title>{title}</r.Title>
        <r.Duration>{duration}</r.Duration>
      </r.Head>
      <r.Details>
        {details.join(" · ")}
        {leftThePage(session) && (
          <r.Distracted title="Switched to another tab or app this many times during the session">
            {leftThePage(session)}
          </r.Distracted>
        )}
        {practised > 0 && (
          <r.Practised>
            <PractisedIcon className="icon" />
            {practised} practised since
          </r.Practised>
        )}
      </r.Details>
      {forTeacher && kind === "reading" && session.away?.length > 0 && <FocusStrip session={session} />}
      <SessionWords session={session} onEditWord={onEditWord} forTeacher={forTeacher} linkArticles={linkArticles} />
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
// forTeacher: every word shown without its translation, each opening the
// sentence it was translated in (the teacher variant of the API sends the
// sentences).
// studentArticlePath(articleId): for a teacher, where a reading session's
// title leads -- the text with the student's translations in place.
export default function SessionTimeline({
  sessions,
  onEditWord = null,
  linkArticles = true,
  forTeacher = false,
  studentArticlePath = null,
}) {
  const groupedSessions = groupByDate(sessions);
  return (
    <>
      {Object.keys(groupedSessions).map((date) => (
        <r.Day key={date}>
          <s.DateHeader>{formatDate(groupedSessions[date][0].start_time)}</s.DateHeader>
          {/* Days newest first; within a day, the way it went: earliest first. */}
          {[...groupedSessions[date]].reverse().map((session, idx) => (
            <SessionItem
              key={idx}
              session={session}
              onEditWord={onEditWord}
              linkArticles={linkArticles}
              forTeacher={forTeacher}
              studentArticlePath={studentArticlePath}
            />
          ))}
        </r.Day>
      ))}
      {showsBrowsingNote(sessions) && <s.InfoNote>Browsing sessions are tracked since Dec 11, 2025</s.InfoNote>}
    </>
  );
}
