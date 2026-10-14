import { removePunctuation } from "../../utils/text/preprocessing";
import levenshtein from "fast-levenshtein";

export const EXACT = "exact";
// Within one edit per four letters of an expected word of five letters or
// more: a spelling slip, not another word, so the correction plays without
// asking the API. Short words are never misspellings: one edit turns "tror"
// into "tro" and "han" into "hun", real words worth judging. Stricter than
// charDiff's isCloseMiss, which only decides how to draw a correction:
// "et stykke" shares enough letters with "en del" to pass it.
export const MISSPELLING = "misspelling";
// A different word that might also fit the blank: worth asking the API.
export const OTHER_WORD = "other_word";
export const EMPTY = "empty";

const SHORT_WORD_LENGTH = 4;

function normalize(text) {
  return removePunctuation(text).trim().toLowerCase();
}

export function classifyTypedAnswer(typed, expected) {
  const answer = normalize(typed);
  const solution = normalize(expected);
  if (!answer) return EMPTY;
  if (answer === solution) return EXACT;
  const length = [...solution].length;
  if (length > SHORT_WORD_LENGTH && levenshtein.get(answer, solution) <= Math.floor(length / 4)) {
    return MISSPELLING;
  }
  return OTHER_WORD;
}
