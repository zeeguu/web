import { endsMidSentence, snippetParts, startNearFirstMatch } from "./snippetParts";
import * as s from "./ArticlePreview.sc";

// The passage where a typed search matched the article's text (see
// snippetParts.js). Renders nothing for an article without one: every card
// that is not a search result.
export default function SearchSnippet({ snippet }) {
  const parts = startNearFirstMatch(snippetParts(snippet));
  if (parts.length === 0) return null;
  return (
    <s.SnippetText>
      {parts.map((part, index) =>
        part.marked ? <s.SnippetMatch key={index}>{part.text}</s.SnippetMatch> : part.text,
      )}
      {endsMidSentence(snippet) && "…"}
    </s.SnippetText>
  );
}
