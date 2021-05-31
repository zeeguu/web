import { v4 as uuid } from "uuid";
import LinkedList from "linked-list";

export class Word extends LinkedList.Item {
  constructor(word) {
    super();
    this.id = uuid();
    this.word = word;
    this.translation = null;
  }

  splitIntoComponents() {
    let words = this.word.split(" ").map((e) => new Word(e));

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
  constructor(text) {
    this.linkedWords = LinkedList.from(splitTextIntoWords(text));
  }

  getWords() {
    return this.linkedWords.toArray();
  }
}

// Private functions
function splitTextIntoWords(text) {
  let splitWords = text
    .trim()
    .split(/[\s,]+/)
    .map((word) => new Word(word));
  return splitWords;
}
