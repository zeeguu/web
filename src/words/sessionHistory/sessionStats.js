// Pure helpers for a list of sessions as /session_history and
// /student_session_history return it (newest first, times in UTC).

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDurationShort(ms) {
  if (!ms) return "0 min";
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins} min` : `${hours}h`;
}

export function calculateStats(sessions) {
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

export function formatDate(isoString) {
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

export function groupByDate(sessions) {
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
