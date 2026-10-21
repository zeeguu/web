import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import * as s from "./SavedArticleRow.sc";

// How far the learner read, for a row's MetaStrip: "40% read", or "Read" at
// the end, and nothing at 0. `ratio` is 0..1, as the backend sends it.
export default function ReadingCompletion({ ratio }) {
  const percent = Math.round((ratio || 0) * 100);
  if (percent >= 100) {
    return (
      <s.CompletionDone>
        <CheckCircleRoundedIcon style={{ fontSize: 14 }} /> Read
      </s.CompletionDone>
    );
  }
  if (percent > 0) return <s.CompletionInProgress>{percent}% read</s.CompletionInProgress>;
  return null;
}
