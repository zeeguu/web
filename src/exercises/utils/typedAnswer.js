import { removePunctuation } from "../../utils/text/preprocessing";
import levenshtein from "fast-levenshtein";

export const EXACT = "exact";
// Within one edit per four letters of the expected word (at least one): a
// spelling slip, not another word, so the correction plays without asking the
// API. Stricter than charDiff's isCloseMiss, which only decides how to draw a
// correction: "et stykke" shares enough letters with "en del" to pass it.
export const MISSPELLING = "misspelling";
// A different word that might also fit the blank: worth asking the API.
export const OTHER_WORD = "other_word";
export const EMPTY = "empty";

function normalize(text) {
  return removePunctuation(text).trim().toLowerCase();
}

export function classifyTypedAnswer(typed, expected) {
  const answer = normalize(typed);
  const solution = normalize(expected);
  if (!answer) return EMPTY;
  if (answer === solution) return EXACT;
  const allowedEdits = Math.max(1, Math.floor([...solution].length / 4));
  if (levenshtein.get(answer, solution) <= allowedEdits) return MISSPELLING;
  return OTHER_WORD;
}
