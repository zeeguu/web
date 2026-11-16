// The passage of an article's text where a typed search matched, as the API
// sends it (search_snippet): plain text with the matched words between
// <mark> and </mark>, the tags Elasticsearch was asked for (SNIPPET_HIGHLIGHT
// in the API's elastic_query_builder.py).
//
// Split into parts here instead of rendering it as HTML: the text is the
// article's, and only the two tags are ours.
export function snippetParts(snippet) {
  if (!snippet) return [];
  const parts = [];
  // Each piece after a split on <mark> starts with a marked run up to </mark>.
  snippet.split("<mark>").forEach((piece, index) => {
    if (index === 0) {
      if (piece) parts.push({ text: piece, marked: false });
      return;
    }
    const end = piece.indexOf("</mark>");
    const marked = end === -1 ? piece : piece.slice(0, end);
    const rest = end === -1 ? "" : piece.slice(end + "</mark>".length);
    if (marked) parts.push({ text: marked, marked: true });
    if (rest) parts.push({ text: rest, marked: false });
  });
  // An empty mark ("<mark></mark>") leaves two plain parts side by side: join them.
  return parts.reduce((merged, part) => {
    const last = merged[merged.length - 1];
    if (last && last.marked === part.marked) last.text += part.text;
    else merged.push({ ...part });
    return merged;
  }, []);
}

// A passage is cut to about a sentence; when the cut falls mid-sentence the
// card says so with an ellipsis.
export function endsMidSentence(snippet) {
  // Sentence-final punctuation, optionally followed by a closing quote or
  // bracket (Danish and German close quotes with «).
  return !/[.!?…]["”»«)]?\s*$/.test(snippet || "");
}
