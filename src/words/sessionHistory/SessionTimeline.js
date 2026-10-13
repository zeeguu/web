import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SpeechContext } from "../../contexts/SpeechContext";
import * as s from "../SessionHistory.sc";
import { formatTime, formatDate, groupByDate } from "./sessionStats";

function InteractiveWordChip({ word, className, showResult, onEditClick, showContext }) {
  const speech = useContext(SpeechContext);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async (e) => {
    e.preventDefault();
    if (!isSpeaking) {
      try {
        await speech.speakOut(word.origin, setIsSpeaking);
      } catch (err) {
        console.log("Speech error:", err);
      }
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    if (word.id && onEditClick) {
      onEditClick(word.id);
    }
  };

  return (
    // A teacher's words carry their whole sentence: shown on hover.
    <s.WordChip className={className} title={(showContext && word.context) || undefined}>
      <s.ClickableOrigin onClick={handleSpeak} title="Click to pronounce" isSpeaking={isSpeaking}>
        {word.origin}
      </s.ClickableOrigin>
      <span className="separator">→</span>
      {word.id && onEditClick ? (
        <s.ClickableTranslation onClick={handleEditClick} title="Click to edit">
          {word.translation}
        </s.ClickableTranslation>
      ) : (
        <span className="translation">{word.translation}</span>
      )}
      {showResult && <span className="result">{word.correct ? "✓" : "✗"}</span>}
      {word.practised && (
        <span className="result" title="Practised in exercises since">
          ★
        </span>
      )}
    </s.WordChip>
  );
}

function SessionItem({ session, onEditWord, linkArticles, forTeacher }) {
  const renderWords = () => {
    if (!session.words || session.words.length === 0) {
      return null;
    }

    const getChipClass = (word) => {
      if (session.session_type === "exercise") {
        return word.correct ? "correct" : "incorrect";
      }
      return session.session_type; // 'reading', 'browsing', or 'audio'
    };

    return (
      <s.WordList>
        {session.words.slice(0, 10).map((word, idx) => (
          <InteractiveWordChip
            key={idx}
            word={word}
            className={getChipClass(word)}
            showResult={session.session_type === "exercise"}
            onEditClick={onEditWord}
            showContext={forTeacher}
          />
        ))}
        {session.words.length > 10 && <s.WordChip className="more">+{session.words.length - 10} more</s.WordChip>}
      </s.WordList>
    );
  };

  return (
    <s.SessionCard>
      <s.SessionHeader>
        <div>
          <s.SessionTime>{formatTime(session.start_time)}</s.SessionTime>
          <s.SessionType className={session.session_type}>
            {session.session_type === "reading" && "Reading"}
            {session.session_type === "exercise" && "Exercising"}
            {session.session_type === "browsing" && "Browsing"}
            {session.session_type === "audio" && "Listening"}
          </s.SessionType>
          {session.session_type === "reading" && session.reading_source === "extension" && (
            <span className="source-badge extension" title="Read via browser extension">
              ext
            </span>
          )}
          {session.session_type === "reading" && session.reading_source === "web" && (
            <span className="source-badge web" title="Read in Zeeguu">
              web
            </span>
          )}
        </div>
        <s.HeaderActions>
          {session.focus_level && (
            <s.FocusBadge className={session.focus_level}>
              {session.focus_level === "focused" && "Focused"}
              {session.focus_level === "moderate" && "Moderate"}
              {session.focus_level === "distracted" && "Distracted"}
            </s.FocusBadge>
          )}
          <s.SessionDuration>{session.duration_readable}</s.SessionDuration>
        </s.HeaderActions>
      </s.SessionHeader>

      {session.session_type === "reading" && session.article_title && (
        <s.ArticleTitle>
          {linkArticles ? (
            <Link to={`/read/article?id=${session.article_id}`}>{session.article_title}</Link>
          ) : (
            session.article_title
          )}
        </s.ArticleTitle>
      )}

      {forTeacher && session.session_type === "reading" && session.article_word_count > 0 && (
        <s.ExerciseStats>
          {session.article_word_count} words
          {session.article_difficulty > 0 && ` · difficulty ${(session.article_difficulty / 10).toFixed(1)}/10`}
        </s.ExerciseStats>
      )}

      {session.session_type === "audio" && session.lesson_title && (
        <s.ArticleTitle>{session.lesson_title}</s.ArticleTitle>
      )}

      {session.session_type === "exercise" && (
        <s.ExerciseStats>
          {session.word_count} words practiced - {session.accuracy}% correct
        </s.ExerciseStats>
      )}

      {session.session_type === "audio" && session.completed && session.word_count > 0 && (
        <s.ExerciseStats>{session.word_count} words in lesson ✓</s.ExerciseStats>
      )}

      {renderWords()}
    </s.SessionCard>
  );
}

// The sessions, grouped by day, newest first. Shared by the learner's History
// and the teacher's view of a student.
//
// onEditWord(bookmarkId): makes translations clickable for editing; leave it
// out where the words aren't the viewer's own.
// linkArticles: reading sessions link to the article in the reader. Off for a
// teacher, whose opening it would count as their own reading.
// forTeacher: also the text's length and difficulty on reading sessions, a
// word's sentence on hover and a star on words practised since (the teacher
// variant of the API sends those).
export default function SessionTimeline({ sessions, onEditWord = null, linkArticles = true, forTeacher = false }) {
  const groupedSessions = groupByDate(sessions);
  let shownBrowsingNote = false;
  return Object.keys(groupedSessions).map((date) => (
    <div key={date}>
      <s.DateHeader>{formatDate(groupedSessions[date][0].start_time)}</s.DateHeader>
      {groupedSessions[date].map((session, idx) => {
        const showNote = session.session_type === "browsing" && !shownBrowsingNote;
        if (showNote) shownBrowsingNote = true;
        return (
          <div key={idx}>
            <SessionItem
              session={session}
              onEditWord={onEditWord}
              linkArticles={linkArticles}
              forTeacher={forTeacher}
            />
            {showNote && <s.InfoNote>Browsing sessions are tracked since Dec 11, 2025</s.InfoNote>}
          </div>
        );
      })}
    </div>
  ));
}
