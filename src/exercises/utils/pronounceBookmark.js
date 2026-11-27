// The bookmark's word as linked in its context, so a multi-word expression
// ("vil fortælle") is spoken whole via word.mweExpression.
export function findBookmarkWord(interactiveText, bookmarkId) {
  if (!interactiveText?.paragraphsAsLinkedWordLists) return null;
  for (const par of interactiveText.paragraphsAsLinkedWordLists) {
    for (let w = par.linkedWords.head; w; w = w.next) {
      if (w.bookmark_id === bookmarkId) return w;
    }
  }
  return null;
}

// Route through interactiveText.pronounce so MWE-aware pronunciation and
// SPEAK_TEXT activity logging come for free (the same path
// TranslatableWord.clickOnWord uses). Falls back to bookmark.from if the
// linked word can't be found.
export function pronounceBookmark(interactiveText, speech, bookmark) {
  const word = findBookmarkWord(interactiveText, bookmark.id);
  if (word) {
    interactiveText.pronounce(word);
  } else {
    speech.speakOut(bookmark.from);
  }
}
