import { useEffect, useState } from "react";
import InteractiveText from "../../reader/InteractiveText.js";
import { adaptExerciseBookmark } from "./exerciseBookmarkAdapter.js";

/**
 * Constructs an InteractiveText for an exercise with the exercise's
 * bookmark pre-loaded via the standard `previousBookmarks` path
 * (same pathway ArticleReader uses for past_bookmarks). This is the
 * mechanism that makes the bookmark word render with the dotted-orange
 * mwe-adjacent treatment + the chip-above translation post-reveal, the
 * same way a tapped word in the reader is rendered.
 *
 * Each exercise that wants this treatment should call this hook
 * instead of constructing `new InteractiveText(...)` directly. The
 * `extraConstructorArgs` array lets callers append exercise-specific
 * trailing args (e.g. TranslateL2toL1 passes expectedSolution +
 * expectedPosition, TranslateWhatYouHear passes formatting +
 * fragment_id) without each exercise duplicating the adapter + slot
 * logic.
 *
 * Use `InteractiveTextClass` to swap in a subclass like
 * InteractiveExerciseText when an exercise needs the click-tracking
 * extensions.
 */
export function useBookmarkedInteractiveText({
  exerciseBookmark,
  api,
  speech,
  exerciseType,
  reload,
  InteractiveTextClass = InteractiveText,
  extraConstructorArgs = [],
}) {
  const [interactiveText, setInteractiveText] = useState();

  useEffect(() => {
    if (
      !exerciseBookmark?.context_tokenized ||
      !Array.isArray(exerciseBookmark.context_tokenized)
    ) {
      setInteractiveText(null);
      return;
    }

    const adaptedBookmark = adaptExerciseBookmark(exerciseBookmark);

    setInteractiveText(
      new InteractiveTextClass(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        exerciseType,
        speech,
        exerciseBookmark.context_identifier,
        ...extraConstructorArgs,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  return [interactiveText, setInteractiveText];
}
