import { v4 as uuid } from "uuid";
import { List, Item } from "linked-list";

export class Word extends Item {
  constructor(word, word_i) {
    super();
    this.id = uuid();
    this.word = word;
    this.translation = null;
    // Stores the i'th position that the word starts in the content.
    // Note this is in the article's content, which is needed to calculate
    // the start of the context's start at the article as a whole.
    this.wordIndexInContent = word_i;
  }

  splitIntoComponents() {
    let words = splitTextIntoWords(this.word + " ", this.wordIndexInContent);

    this.append(words[0]);

    for (let i = 0; i < words.length - 1; i++) {
      words[i].append(words[i + 1]);
    }

    this.detach();
  }

  fuseWithPrevious(api) {
    this.word = this.prev.word + " " + this.word;

    if (this.prev && this.prev.bookmark_id) {
      // consider hide bookmark; here
      // this would allow caching of partial translations
      // would also keep a better trace of user interactions?
      // would it? i know they clicked on every word already...
      // it won't bring anything... besides the partial translation again..
      // which might still be useful for a teacher helping students...?
      // To think more about
      api.deleteBookmark(this.prev.bookmark_id);
    }

    this.wordIndexInText = this.prev.wordIndexInText;
    this.prev.detach();
    return this;
  }

  fuseWithNext(api) {
    this.word = this.word + " " + this.next.word;

    if (this.next && this.next.bookmark_id) {
      api.deleteBookmark(this.next.bookmark_id);
    }
    this.next.detach();
    return this;
  }

  isEndOfSentence() {
    return ".;".includes(this.word[this.word.length - 1]);
  }

  fuseWithNeighborsIfNeeded(api) {
    // api: this is needed because we want to delete the previous
    // bookmark in the case of a fusion; no need to save the partial
    // translations to the DB; we used to do that; but it was just
    // poluting the DB and the
    let newWord = this;
    if (this.prev && this.prev.translation && !this.prev.isEndOfSentence()) {
      newWord = this.fuseWithPrevious(api);
    }

    if (this.next && this.next.translation && !this.isEndOfSentence()) {
      newWord = this.fuseWithNext(api);
    }

    return newWord;
  }
}

export default class LinkedWordList {
  constructor(text, start_char_i) {
    let result = splitTextIntoWords(text, start_char_i);
    this.linkedWords = List.from(result);
    this.start_char_i = start_char_i;
  }

  getWords() {
    return this.linkedWords.toArray();
  }
}

// Private functions
function splitTextIntoWords(text, start_char_i) {
  function sliceAndTrim(text, start, end) {
    return text.slice(start, end).trim();
  }
  const wordDivider = /[\s]+/g;
  const allMatches = [...text.matchAll(wordDivider)];
  let splitWords = [];
  let currentStart = 0;
  for (let i = 0; i < allMatches.length - 1; i++) {
    let match = allMatches[i];
    splitWords.push(
      new Word(
        sliceAndTrim(text, currentStart, match["index"]),
        currentStart + start_char_i,
      ),
    );
    currentStart = match["index"] + match[0].length;
  }
  splitWords.push(
    new Word(
      sliceAndTrim(text, currentStart, text.length),
      currentStart + start_char_i,
    ),
  );
  return splitWords;
}
