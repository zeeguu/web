// The passage of an article's text where a typed search matched, as the API
// sends it (search_snippet): plain text with the matched words between
// <mark> and </mark>, the tags Elasticsearch was asked for (SNIPPET_HIGHLIGHT
// in the API's elastic_query_builder.py).
//
// Split into parts here instead of rendering it as HTML: the text is the
// article's, and only the two tags are ours. Splitting on either tag leaves
// plain and marked text alternating, plain first.
export function snippetParts(snippet) {
  if (!snippet) return [];
  return snippet
    .split(/<\/?mark>/)
    .map((text, index) => ({ text, marked: index % 2 === 1 }))
    .filter((part) => part.text);
}

// The card shows two lines, and a passage of ~160 characters can run longer:
// when the first match comes late, start shortly before it (at a word) so the
// matched word is never the part that is cut off.
export function startNearFirstMatch(parts, lead = 40) {
  const [first, ...rest] = parts;
  if (!first || first.marked || first.text.length <= lead) return parts;
  const tail = first.text.slice(-lead);
  const fromWord = tail.slice(tail.indexOf(" ") + 1);
  return [{ text: "…" + fromWord, marked: false }, ...rest];
}

// A passage is cut to about a sentence; when the cut falls mid-sentence the
// card says so with an ellipsis.
export function endsMidSentence(snippet) {
  // Sentence-final punctuation, optionally followed by a closing quote or
  // bracket: ” “ (English, German), » « (Danish, German), › ‹ ’ ‘ ' " ).
  return !/[.!?…]["'”“»«›‹’‘)]?\s*$/.test(snippet || "");
}
