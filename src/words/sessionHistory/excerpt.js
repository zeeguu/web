// A translated word's stored excerpt, ready to show: split around the word so
// it can be highlighted, with "…" where the reader cut the sentence.

// [{ text, isWord }] -- the first occurrence of `word`, ignoring case.
export function highlightWord(context, word) {
  if (!context) return [];
  const at = word ? context.toLowerCase().indexOf(word.toLowerCase()) : -1;
  if (at < 0) return [{ text: context, isWord: false }];
  return [
    { text: context.slice(0, at), isWord: false },
    { text: context.slice(at, at + word.length), isWord: true },
    { text: context.slice(at + word.length), isWord: false },
  ].filter((part) => part.text);
}

export function excerptParts(word) {
  const parts = highlightWord((word.context || "").trim(), word.origin);
  if (parts.length === 0) return parts;
  if (word.context_cut_left) parts.unshift({ text: "… ", isWord: false });
  if (word.context_cut_right) parts.push({ text: " …", isWord: false });
  return parts;
}
