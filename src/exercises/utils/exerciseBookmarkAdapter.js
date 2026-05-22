/**
 * Adapt an exercise bookmark to the past-bookmark shape that
 * updateTokensWithBookmarks expects (the same path ArticleReader uses
 * for past_bookmarks).
 *
 * Returns null if the bookmark or its context are not in a usable
 * shape (e.g. the URL-fallback placeholder rendered before the API
 * response arrives) — callers should pass an empty array of past
 * bookmarks in that case.
 *
 * Two non-obvious adjustments:
 * - `origin` is reconstructed from the actual token texts at the
 *   bookmark position, because findTokenForBookmark does a
 *   case-sensitive verification for multi-word bookmarks and the
 *   backend ships `bookmark.from` lowercased ("virker det" while the
 *   tokens are "Virker det").
 * - `is_mwe` is true when t_total_token > 1 OR when the target token
 *   already has a tokenizer-detected mwe_group_id (handles separated
 *   MWEs whose t_total_token is 1).
 */
export function adaptExerciseBookmark(exerciseBookmark) {
  if (
    !exerciseBookmark ||
    !Array.isArray(exerciseBookmark.context_tokenized) ||
    !Array.isArray(exerciseBookmark.context_tokenized[0]) ||
    !Array.isArray(exerciseBookmark.context_tokenized[0][0]) ||
    exerciseBookmark.t_sentence_i == null ||
    exerciseBookmark.t_token_i == null
  ) {
    return null;
  }

  const targetSentTokens = exerciseBookmark.context_tokenized[0][exerciseBookmark.t_sentence_i] || [];
  const tokenAtTarget = targetSentTokens[exerciseBookmark.t_token_i];
  const totalTokens = exerciseBookmark.t_total_token || 1;

  const originFromTokens = [];
  for (let i = 0; i < totalTokens; i++) {
    const t = targetSentTokens[exerciseBookmark.t_token_i + i];
    if (t?.text) originFromTokens.push(t.text);
  }
  // Trust the position: build origin from the actual token text at the
  // bookmark's claimed offset. Alternative sentences often use a
  // different morphological form than bookmark.from (e.g. conjugated
  // verb), so we'd reject perfectly fine restorations if we required an
  // exact lemma match.
  const properOrigin = originFromTokens.length ? originFromTokens.join(" ") : exerciseBookmark.from;

  return {
    id: exerciseBookmark.id,
    origin: properOrigin,
    translation: exerciseBookmark.to,
    is_mwe: totalTokens > 1 || !!tokenAtTarget?.mwe_group_id,
    t_sentence_i: exerciseBookmark.t_sentence_i,
    t_token_i: exerciseBookmark.t_token_i,
    t_total_token: totalTokens,
    context_sent: exerciseBookmark.context_sent || 0,
    context_token: 0,
  };
}
