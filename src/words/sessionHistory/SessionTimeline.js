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
  openSpan,
  outOfFocusMs,
  idleMs,
  idleUnplaced,
  summaryStrip,
  scaledPercent,
  durationLabel,
  groupBrowsingWords,
  groupExerciseWords,
  isBlip,
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

// Every reading a teacher sees as a card gets a focus strip (a slim one is a
// single line).
const hasFocusStrip = (session, forTeacher) =>
  forTeacher && session.session_type === "reading" && !isSlim(session);

// For a teacher: a reading session on the scale of the summary bar above.
// Its timeline from start to last action -- the page being read in the
// reading colour, away (another tab or app) red, idle in focus pale, the
// article closed grey -- so twenty short trips elsewhere look different from
// twenty minutes of reading. Sessions from before idle was logged, left open
// far longer than they were read, show only what is known, from the start:
// nobody knows when in those hours the reading happened.
function FocusStrip({ session, scale, duration }) {
  const outOfFocus = outOfFocusMs(session);
  const idle = idleMs(session);
  const summary = idleUnplaced(session) ? summaryStrip(session) : null;
  const stretches = summary ? summary.stretches : awayStretches(session);
  const length = summary ? summary.length : openSpan(session);
  const time = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const showIdle = idle >= 60 * 1000;
  return (
    <r.FocusBlock>
      {(outOfFocus > 0 || showIdle) && (
        <r.BarLabel>
          {outOfFocus > 0 && (
            <span className="away">
              {durationLabel(outOfFocus)} away
              {session.interruptions > 0 &&
                `, left the article ${session.interruptions} ${session.interruptions === 1 ? "time" : "times"}`}
            </span>
          )}
          {outOfFocus > 0 && showIdle && " · "}
          {showIdle && `${durationLabel(idle)} idle`}
        </r.BarLabel>
      )}
      <r.FocusRow>
        <r.FocusStrip
          role="img"
          aria-label={`Open ${durationLabel(openSpan(session))}: ${durationLabel(session.duration)} reading, ${durationLabel(outOfFocus)} away, ${durationLabel(idle)} idle`}
          title={
            summary
              ? "The reading and the time away; when in the session they happened was not recorded"
              : `From ${time(session.start_time)} to ${time(session.end_time)}: red is away in another tab or app, pale is idle on the page, grey is the article closed`
          }
          style={{ flexBasis: `${scaledPercent(length, scale)}%` }}
        >
          {stretches.map((stretch, idx) => (
            <r.Away key={idx} $kind={stretch.kind} style={{ left: `${stretch.left}%`, width: `${stretch.width}%` }} />
          ))}
        </r.FocusStrip>
        <r.StripMinutes>{duration} reading</r.StripMinutes>
      </r.FocusRow>
    </r.FocusBlock>
  );
}

function SessionItem({ session, onEditWord, linkArticles, forTeacher, studentArticlePath, scale }) {
  const kind = session.session_type;
  const duration = durationLabel(session.duration);
  const details = sessionDetails(session);
  const practised = practisedCount(session);
  const withStrip = hasFocusStrip(session, forTeacher);

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
        {!withStrip && <r.Duration>{duration}</r.Duration>}
      </r.Head>
      <r.Details>
        {details.join(" · ")}
        {!withStrip && leftThePage(session) && (
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
      {withStrip && <FocusStrip session={session} scale={scale} duration={duration} />}
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
  const groupedSessions = groupByDate(sessions.filter((session) => !isBlip(session)));
  // the strips drawn to the summary bar's scale: its total fills the width
  const strips = sessions.filter((session) => hasFocusStrip(session, forTeacher));
  const scale = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  return (
    <>
      {strips.length > 0 && (
        <r.StripLegend>
          Under a reading, to the scale of the bar above: <span className="on">■</span> reading,{" "}
          <span className="away">■</span> in another tab or app, <span className="idle">■</span> idle on the page,{" "}
          <span className="closed">■</span> article closed
        </r.StripLegend>
      )}
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
              scale={scale}
            />
          ))}
        </r.Day>
      ))}
      {showsBrowsingNote(sessions) && <s.InfoNote>Browsing sessions are tracked since Dec 11, 2025</s.InfoNote>}
    </>
  );
}
