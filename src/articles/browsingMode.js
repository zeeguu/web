/**
 * The card shape the reader picked in Settings, as ArticlePreview props.
 *
 * Every list of articles should honour the preference -- it used to live in
 * the feed alone, so the classroom's texts kept rendering as the big
 * interactive card long after the reader had asked for headlines everywhere.
 */
export function browsingModeProps(browsingMode) {
  return {
    interactive: browsingMode === "interactive",
    compact: browsingMode === "titles",
  };
}
