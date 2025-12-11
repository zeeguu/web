import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";
import * as sc from "../components/ColumnWidth.sc";
import { setTitle } from "../assorted/setTitle";
import { PageTitle } from "../components/PageTitle";
import Infobox from "../components/Infobox";
import { APIContext } from "../contexts/APIContext";
import { SpeechContext } from "../contexts/SpeechContext";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WordEditForm from "./WordEditForm";
import * as editStyles from "./WordEdit.sc";
import { toast } from "react-toastify";
import { isTextInSentence } from "../utils/text/expressions";
import { validateWordInContext } from "../utils/validation/wordContextValidation";

const SessionCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1em;
  margin: 0.5em 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
`;

const SessionTime = styled.span`
  font-weight: 600;
  color: #333;
`;

const SessionDuration = styled.span`
  font-size: 0.9em;
  color: #666;
`;

const SessionType = styled.span`
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
  margin-left: 0.5em;

  &.reading {
    background: #e3f2fd;
    color: #1565c0;
  }

  &.exercise {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.browsing {
    background: #fff3e0;
    color: #ef6c00;
  }

  &.audio {
    background: #f3e5f5;
    color: #7b1fa2;
  }
`;

const ArticleTitle = styled.div`
  font-size: 1.1em;
  margin-bottom: 0.5em;

  a {
    color: #1976d2;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const WordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
  margin-top: 0.75em;
  padding-top: 0.5em;
  border-top: 1px solid #eee;
`;

const WordChip = styled.span`
  background: white;
  padding: 0.5em 0.8em;
  border-radius: 6px;
  font-size: 1em;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .origin {
    font-weight: 600;
    color: #1565c0;

    &.clickable:hover {
      text-decoration: underline;
    }
  }

  .separator {
    color: #999;
    margin: 0 0.4em;
  }

  .translation {
    color: #333;
    font-weight: 600;

    &.clickable:hover {
      text-decoration: underline;
    }
  }

  .result {
    margin-left: 0.3em;
  }

  &.reading {
    background: #e3f2fd;
    border-color: #90caf9;
  }

  &.browsing {
    background: #fff8e1;
    border-color: #ffe082;
    .origin {
      color: #ef6c00;
    }
  }

  &.audio {
    background: #f3e5f5;
    border-color: #ce93d8;
    .origin {
      color: #7b1fa2;
    }
  }

  &.correct {
    background: #e8f5e9;
    border-color: #a5d6a7;
    .origin {
      color: #2e7d32;
    }
  }

  &.incorrect {
    background: #ffebee;
    border-color: #ef9a9a;
    .origin {
      color: #c62828;
    }
  }
`;

const ExerciseStats = styled.div`
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.5em;
`;

const FocusBadge = styled.span`
  display: inline-block;
  padding: 0.15em 0.5em;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 500;
  margin-left: 0.5em;

  &.focused {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.moderate {
    background: #fff3e0;
    color: #ef6c00;
  }

  &.distracted {
    background: #ffebee;
    color: #c62828;
  }
`;

const InfoNote = styled.div`
  font-size: 0.85em;
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 0.5em;
  margin: 0.5em 0;
`;

const DateHeader = styled.div`
  font-size: 0.9em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.2em;
  margin-bottom: 1.5em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SummaryTitle = styled.div`
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 1em;
  color: #333;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.2em;
  flex-wrap: wrap;
  gap: 0.5em;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.5em 1em;

  .value {
    font-size: 1.4em;
    font-weight: 700;
    color: ${(props) => props.color || "#333"};
  }

  .label {
    font-size: 0.85em;
    color: #666;
    margin-top: 0.2em;
  }
`;

const BarChartContainer = styled.div`
  margin-top: 0.5em;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.6em;

  .label {
    width: 80px;
    font-size: 0.85em;
    color: #555;
  }

  .bar-wrapper {
    flex: 1;
    height: 20px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .bar.reading {
    background: #64b5f6;
  }

  .bar.exercise {
    background: #81c784;
  }

  .bar.browsing {
    background: #ffb74d;
  }

  .bar.audio {
    background: #ba68c8;
  }

  .time {
    width: 70px;
    text-align: right;
    font-size: 0.85em;
    color: #666;
    margin-left: 0.5em;
  }
`;

const TimeSelector = styled.div`
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;

  select {
    padding: 0.4em 0.8em;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 0.95em;
  }

  .custom-dates {
    display: flex;
    align-items: center;
    gap: 0.5em;

    input[type="date"] {
      padding: 0.4em;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 0.9em;
    }

    span {
      color: #666;
    }

    button {
      padding: 0.4em 0.8em;
      border-radius: 4px;
      border: 1px solid #1565c0;
      background: #1565c0;
      color: white;
      font-size: 0.9em;
      cursor: pointer;

      &:hover {
        background: #1256a0;
      }
    }
  }
`;

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDurationShort(ms) {
  if (!ms) return "0m";
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

function calculateStats(sessions) {
  const stats = {
    reading: { time: 0, words: 0, sessions: 0 },
    exercise: { time: 0, words: 0, correct: 0, sessions: 0 },
    browsing: { time: 0, words: 0, sessions: 0 },
    audio: { time: 0, words: 0, sessions: 0 },
  };

  sessions.forEach((s) => {
    const type = s.session_type;
    if (stats[type]) {
      stats[type].time += s.duration || 0;
      stats[type].words += s.word_count || 0;
      stats[type].sessions += 1;
      if (type === "exercise") {
        stats[type].correct += s.correct_count || 0;
      }
    }
  });

  return stats;
}

function Summary({ sessions, label }) {
  const stats = calculateStats(sessions);
  const totalTime = stats.reading.time + stats.exercise.time + stats.browsing.time + stats.audio.time;
  const totalWords = stats.reading.words + stats.exercise.words + stats.browsing.words + stats.audio.words;
  const maxTime = Math.max(stats.reading.time, stats.exercise.time, stats.browsing.time, stats.audio.time, 1);

  return (
    <SummaryCard>
      <SummaryTitle>{label}</SummaryTitle>

      <StatsRow>
        <StatItem color="#1565c0">
          <div className="value">{formatDurationShort(stats.reading.time)}</div>
          <div className="label">Reading</div>
        </StatItem>
        <StatItem color="#2e7d32">
          <div className="value">{formatDurationShort(stats.exercise.time)}</div>
          <div className="label">Exercises</div>
        </StatItem>
        {stats.audio.time > 0 && (
          <StatItem color="#7b1fa2">
            <div className="value">{formatDurationShort(stats.audio.time)}</div>
            <div className="label">Audio</div>
          </StatItem>
        )}
        <StatItem color="#333">
          <div className="value">{totalWords}</div>
          <div className="label">Words</div>
        </StatItem>
      </StatsRow>

      <BarChartContainer>
        <BarRow>
          <span className="label">Reading</span>
          <div className="bar-wrapper">
            <div className="bar reading" style={{ width: `${(stats.reading.time / maxTime) * 100}%` }} />
          </div>
          <span className="time">{formatDurationShort(stats.reading.time)}</span>
        </BarRow>
        <BarRow>
          <span className="label">Exercises</span>
          <div className="bar-wrapper">
            <div className="bar exercise" style={{ width: `${(stats.exercise.time / maxTime) * 100}%` }} />
          </div>
          <span className="time">{formatDurationShort(stats.exercise.time)}</span>
        </BarRow>
        {stats.audio.time > 0 && (
          <BarRow>
            <span className="label">Audio</span>
            <div className="bar-wrapper">
              <div className="bar audio" style={{ width: `${(stats.audio.time / maxTime) * 100}%` }} />
            </div>
            <span className="time">{formatDurationShort(stats.audio.time)}</span>
          </BarRow>
        )}
        {stats.browsing.time > 0 && (
          <BarRow>
            <span className="label">Browsing</span>
            <div className="bar-wrapper">
              <div className="bar browsing" style={{ width: `${(stats.browsing.time / maxTime) * 100}%` }} />
            </div>
            <span className="time">{formatDurationShort(stats.browsing.time)}</span>
          </BarRow>
        )}
      </BarChartContainer>
    </SummaryCard>
  );
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  }
}

function groupByDate(sessions) {
  const groups = {};
  sessions.forEach((session) => {
    const date = new Date(session.start_time).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
  });
  return groups;
}

function InteractiveWordChip({ word, className, showResult, onEditClick }) {
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
    <WordChip className={className}>
      <span
        className="origin clickable"
        onClick={handleSpeak}
        title="Click to pronounce"
        style={{ cursor: "pointer", textDecoration: isSpeaking ? "underline" : "none" }}
      >
        {word.origin}
      </span>
      <span className="separator">→</span>
      {word.id ? (
        <span
          className="translation clickable"
          onClick={handleEditClick}
          title="Click to edit"
          style={{ cursor: "pointer" }}
        >
          {word.translation}
        </span>
      ) : (
        <span className="translation">{word.translation}</span>
      )}
      {showResult && <span className="result">{word.correct ? "✓" : "✗"}</span>}
    </WordChip>
  );
}

function SessionItem({ session, onEditWord }) {
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
      <WordList>
        {session.words.slice(0, 10).map((word, idx) => (
          <InteractiveWordChip
            key={idx}
            word={word}
            className={getChipClass(word)}
            showResult={session.session_type === "exercise"}
            onEditClick={onEditWord}
          />
        ))}
        {session.words.length > 10 && (
          <WordChip style={{ background: "#f0f0f0", fontStyle: "italic" }}>+{session.words.length - 10} more</WordChip>
        )}
      </WordList>
    );
  };

  return (
    <SessionCard>
      <SessionHeader>
        <div>
          <SessionTime>{formatTime(session.start_time)}</SessionTime>
          <SessionType className={session.session_type}>
            {session.session_type === "reading" && "Reading"}
            {session.session_type === "exercise" && "Exercises"}
            {session.session_type === "browsing" && "Browsing"}
            {session.session_type === "audio" && "Audio Lesson"}
          </SessionType>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          {session.focus_level && (
            <FocusBadge className={session.focus_level}>
              {session.focus_level === "focused" && "Focused"}
              {session.focus_level === "moderate" && "Moderate"}
              {session.focus_level === "distracted" && "Distracted"}
            </FocusBadge>
          )}
          <SessionDuration>{session.duration_readable}</SessionDuration>
        </div>
      </SessionHeader>

      {session.session_type === "reading" && session.article_title && (
        <ArticleTitle>
          <Link to={`/read/article?id=${session.article_id}`}>{session.article_title}</Link>
        </ArticleTitle>
      )}

      {session.session_type === "exercise" && (
        <ExerciseStats>
          {session.word_count} words practiced - {session.accuracy}% correct
        </ExerciseStats>
      )}

      {session.session_type === "audio" && (
        <ExerciseStats>
          {session.word_count} words reviewed{session.completed ? " ✓ Completed" : ""}
        </ExerciseStats>
      )}

      {renderWords()}
    </SessionCard>
  );
}

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatDateForInput(date) {
  return date.toISOString().split("T")[0];
}

export default function SessionHistory() {
  const api = useContext(APIContext);
  const [sessions, setSessions] = useState();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("7");

  // Pending values for custom date inputs (not yet applied)
  const [pendingFrom, setPendingFrom] = useState(formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [pendingTo, setPendingTo] = useState(formatDateForInput(new Date()));

  // Applied custom dates (used for fetching)
  const [appliedFrom, setAppliedFrom] = useState(null);
  const [appliedTo, setAppliedTo] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBookmark, setEditBookmark] = useState(null);
  const [editError, setEditError] = useState(null);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const handleEditWord = (bookmarkId) => {
    if (!bookmarkId) {
      toast.error("Cannot edit this word.");
      return;
    }
    setLoadingBookmark(true);
    api.getBookmarkWithContext(bookmarkId, (bookmark) => {
      setLoadingBookmark(false);
      if (bookmark && typeof bookmark.from === "string") {
        setEditBookmark(bookmark);
        setTimeout(() => setEditModalOpen(true), 0);
      } else {
        toast.error("Could not load word details. Please try again.");
      }
    });
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditBookmark(null);
    setEditError(null);
  };

  const updateBookmark = (bookmark, newWord, newTranslation, newContext, newFitForStudy) => {
    if (!isTextInSentence(newWord, newContext)) {
      setEditError(`'${newWord}' is not present in the context. Make sure the context contains the word.`);
      return;
    }

    const validation = validateWordInContext(newWord, newContext);
    if (!validation.valid) {
      setEditError(validation.errorMessage);
      return;
    }

    api
      .updateBookmark(bookmark.id, newWord, newTranslation, newContext, bookmark.context_identifier)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.data);
        }
        return response.data;
      })
      .then((newBookmark) => {
        // Update the word in sessions to reflect changes
        setSessions((prevSessions) =>
          prevSessions.map((session) => ({
            ...session,
            words: session.words.map((word) =>
              word.id === bookmark.id
                ? { ...word, origin: newBookmark.from, translation: newBookmark.to }
                : word
            ),
          }))
        );

        if (newFitForStudy) {
          api.userSetForExercises(newBookmark.id);
        } else {
          api.userSetNotForExercises(newBookmark.id);
        }

        if (newBookmark._message) {
          toast.info(newBookmark._message);
        } else {
          toast.success("Word updated successfully!");
        }

        handleEditClose();
      })
      .catch((error) => {
        console.error("Error updating bookmark:", error);
        let errorMessage = "Failed to update bookmark. Please try again.";
        try {
          if (typeof error.message === "string") {
            const errorData = JSON.parse(error.message);
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          }
        } catch (e) {
          // If parsing fails, use default message
        }
        setEditError(errorMessage);
      });
  };

  const deleteBookmark = () => {
    if (!editBookmark) return;
    api.deleteBookmark(
      editBookmark.id,
      (response) => {
        if (response === "OK") {
          // Remove word from sessions
          setSessions((prevSessions) =>
            prevSessions.map((session) => ({
              ...session,
              words: session.words.filter((word) => word.id !== editBookmark.id),
              word_count: session.words.filter((word) => word.id !== editBookmark.id).length,
            }))
          );
          toast.success("Word deleted successfully!");
          handleEditClose();
        }
      },
      (error) => {
        console.log(error);
        alert("Something went wrong and we could not delete the bookmark; try again later.");
      }
    );
  };

  const applyCustomRange = () => {
    setAppliedFrom(pendingFrom);
    setAppliedTo(pendingTo);
  };

  const getDateRange = () => {
    const now = new Date();
    let fromDate,
      toDate = now;

    switch (timeRange) {
      case "7":
        fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "14":
        fromDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        break;
      case "30":
        fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "week":
        fromDate = getStartOfWeek();
        break;
      case "month":
        fromDate = getStartOfMonth();
        break;
      case "custom":
        if (appliedFrom && appliedTo) {
          fromDate = new Date(appliedFrom);
          toDate = new Date(appliedTo);
          toDate.setHours(23, 59, 59, 999);
        } else {
          // Default to last 30 days if custom not yet applied
          fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }
        break;
      default:
        fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    return { fromDate, toDate };
  };

  const getDisplayLabel = () => {
    switch (timeRange) {
      case "7":
        return "Last 7 days";
      case "14":
        return "Last 14 days";
      case "30":
        return "Last 30 days";
      case "week":
        return "This week";
      case "month":
        return "This month";
      case "custom":
        return appliedFrom && appliedTo ? `${appliedFrom} to ${appliedTo}` : "Custom range";
      default:
        return "Last 7 days";
    }
  };

  useEffect(() => {
    // Don't fetch if custom is selected but not yet applied
    if (timeRange === "custom" && (!appliedFrom || !appliedTo)) {
      return;
    }

    setLoading(true);
    const { fromDate, toDate } = getDateRange();
    api.getSessionHistoryByRange(fromDate.toISOString(), toDate.toISOString(), (data) => {
      setSessions(data);
      setLoading(false);
    });
    setTitle("Activity History");
  }, [api, timeRange, appliedFrom, appliedTo]);

  const isCustomNotApplied = timeRange === "custom" && (!appliedFrom || !appliedTo);

  if (sessions === undefined && !isCustomNotApplied) {
    return <LoadingAnimation />;
  }

  const groupedSessions = sessions ? groupByDate(sessions) : {};
  const dates = Object.keys(groupedSessions);

  return (
    <sc.NarrowColumn>
      <PageTitle>Activity History</PageTitle>

      <TimeSelector>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>

        {timeRange === "custom" && (
          <div className="custom-dates">
            <input type="date" value={pendingFrom} onChange={(e) => setPendingFrom(e.target.value)} />
            <span>to</span>
            <input type="date" value={pendingTo} onChange={(e) => setPendingTo(e.target.value)} />
            <button onClick={applyCustomRange} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        )}
      </TimeSelector>

      {loading && <LoadingAnimation />}

      {!loading && sessions && sessions.length === 0 && (
        <Infobox>No activity recorded for {getDisplayLabel().toLowerCase()}.</Infobox>
      )}

      {!loading && sessions && sessions.length > 0 && <Summary sessions={sessions} label={getDisplayLabel()} />}

      {!loading &&
        (() => {
          let shownBrowsingNote = false;
          return dates.map((date) => (
            <div key={date}>
              <DateHeader>{formatDate(groupedSessions[date][0].start_time)}</DateHeader>
              {groupedSessions[date].map((session, idx) => {
                const showNote = session.session_type === "browsing" && !shownBrowsingNote;
                if (showNote) shownBrowsingNote = true;
                return (
                  <div key={idx}>
                    <SessionItem session={session} onEditWord={handleEditWord} />
                    {showNote && <InfoNote>Browsing sessions are tracked since Dec 11, 2025</InfoNote>}
                  </div>
                );
              })}
            </div>
          ));
        })()}

      {/* Loading indicator when fetching bookmark for edit */}
      {loadingBookmark && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000 }}>
          <LoadingAnimation />
        </div>
      )}

      {/* Edit Word Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-word-modal"
        aria-describedby="edit-word-form"
      >
        <Box sx={window.innerWidth < 800 ? editStyles.stylePhone : editStyles.style}>
          {editBookmark && editBookmark.from && (
            <WordEditForm
              bookmark={editBookmark}
              errorMessage={editError}
              handleClose={handleEditClose}
              updateBookmark={updateBookmark}
              deleteAction={deleteBookmark}
            />
          )}
        </Box>
      </Modal>
    </sc.NarrowColumn>
  );
}
