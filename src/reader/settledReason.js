// The reason an LLM gave when it settled a translator disagreement on this
// word, while the word still shows that answer. Once the learner picks
// something else the reason argues for a translation they rejected, so
// there is none. Explain shows it instead of asking again.
export function settledReason(word) {
  const settled = word.resolution;
  if (!settled?.reason || settled.translation !== word.translation) return null;
  return settled.reason;
}
