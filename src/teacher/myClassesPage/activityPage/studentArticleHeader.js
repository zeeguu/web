import { durationLabel } from "../../../words/sessionHistory/sessionCard";

// How many words the student translated in the text: the title's and every
// paragraph's past bookmarks.
export function translationCount(article) {
  const parts = [article.tokenized_title_new, ...(article.tokenized_fragments || [])];
  return parts.reduce((sum, part) => sum + (part?.past_bookmarks?.length || 0), 0);
}

// The header over a student's text, reminding the teacher whose reading this
// is: { lead, details } — details is null when there is nothing to say.
//   "Max's translations are shown above the words."
//   "Max spent 5 min on it and read 100% · 12 words translated"
export function studentArticleHeader(name, article) {
  const count = translationCount(article);
  const lead =
    count > 0 ? `${name}'s translations are shown above the words.` : `${name} translated no words in this text.`;

  const did = [];
  if (article.student_reading_seconds > 0)
    did.push(`spent ${durationLabel(article.student_reading_seconds * 1000)} on it`);
  if (article.reading_completion > 0) did.push(`read ${Math.round(article.reading_completion * 100)}%`);

  const details = [];
  if (did.length > 0) details.push(`${name} ${did.join(" and ")}`);
  if (count > 0) details.push(`${count} ${count === 1 ? "word" : "words"} translated`);
  return { lead, details: details.length > 0 ? details.join(" · ") : null };
}
