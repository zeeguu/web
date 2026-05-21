import { useEffect, useState } from "react";
import InteractiveText from "../../reader/InteractiveText.js";
import InteractiveExerciseText from "../../reader/InteractiveExerciseText.js";
import { adaptExerciseBookmark } from "./exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "./useNotifyExerciseLoaded.js";

/**
 * Builds the InteractiveText that drives an exercise's reveal-time
 * rendering. Each exercise type does roughly the same thing:
 *
 *   1. Bail if `context_tokenized` isn't a usable array.
 *   2. Adapt the bookmark into the same shape `past_bookmarks` use in
 *      the reader so `updateTokensWithBookmarks` paints the answer
 *      with the chip + dotted underline + tap-to-pronounce treatment
 *      for free.
 *   3. Instantiate InteractiveText, or InteractiveExerciseText when
 *      the exercise needs click/typed-solution detection.
 *
 * The hook also forwards `onExerciseLoaded` up to ExerciseSession.
 *
 * `preloadBookmark` defaults to true: the bookmark is restored on the
 * InteractiveText immediately. Click-word exercises pass false so the
 * pre-reveal text has no pre-set translations (which would block
 * `TranslatableWord.clickOnWord` from routing to `trackWordClick`).
 * They then re-mount the InteractiveText post-reveal by including
 * `isExerciseOver` in `extraDeps`.
 */
export function useInteractiveTextForBookmark({
  bookmark,
  api,
  speech,
  exerciseType,
  reload,
  onExerciseLoaded,
  expectedSolution = null,
  expectedPosition = null,
  onSolutionFound = null,
  preloadBookmark = true,
  extraDeps = [],
}) {
  const [interactiveText, setInteractiveText] = useState(null);
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);

  useEffect(() => {
    // Skip placeholder bookmarks (IndividualExercise renders one before
    // the API resolves): the placeholder's context_tokenized isn't the
    // [paragraph][sentence][token] shape InteractiveText expects.
    const hasValidShape =
      Array.isArray(bookmark?.context_tokenized) &&
      Array.isArray(bookmark.context_tokenized[0]) &&
      Array.isArray(bookmark.context_tokenized[0][0]);
    if (!hasValidShape) {
      setInteractiveText(null);
      return;
    }

    const adapted = preloadBookmark ? adaptExerciseBookmark(bookmark) : null;
    const options = {
      tokenizedParagraphs: bookmark.context_tokenized,
      sourceId: bookmark.source_id,
      api,
      previousBookmarks: adapted ? [adapted] : [],
      translationEvent: api.TRANSLATE_WORDS_IN_EXERCISE,
      language: bookmark.from_lang,
      source: exerciseType,
      zeeguuSpeech: speech,
      contextIdentifier: bookmark.context_identifier,
    };

    const isExerciseText = expectedSolution !== null || onSolutionFound !== null;
    setInteractiveText(
      isExerciseText
        ? new InteractiveExerciseText({ ...options, expectedSolution, expectedPosition, onSolutionFound })
        : new InteractiveText(options),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmark, reload, ...extraDeps]);

  return interactiveText;
}
