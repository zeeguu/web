// What /aiki offers a learner who came to earn time for the apps they paused,
// best first: due exercises, then today's audio lesson (always there to make
// or hear again), then the article they last left halfway. The article is
// last and shown as a preview: they may have left it because it was dull.
export function aikiChoices({ exercisesDue, lesson, unfinishedArticles }) {
  const choices = [];
  if (exercisesDue > 0) {
    choices.push({
      kind: "exercises",
      title: "Exercises",
      meta: `${exercisesDue} ${exercisesDue === 1 ? "word" : "words"} due`,
      href: "/exercises",
    });
  }
  choices.push({ kind: "lesson", kicker: "Audio lesson", ...lessonChoice(lesson), href: "/daily-audio" });
  const article = unfinishedArticles?.[0];
  if (article) {
    choices.push({
      kind: "article",
      kicker: "Continue reading",
      title: article.title,
      progress: Math.round((article.last_reading_percentage || 0) * 100),
      article,
      href: "/read/article?id=" + article.id,
    });
  }
  return choices;
}

function lessonChoice(lesson) {
  if (!lesson?.lesson_id) return { title: "Today's lesson", meta: "Make today's lesson" };
  const minutes = Math.max(1, Math.round((lesson.duration_seconds || 0) / 60));
  return {
    title: lesson.title || "Today's lesson",
    meta: lesson.is_completed ? `Listen again · ${minutes} min` : `${minutes} min`,
  };
}
