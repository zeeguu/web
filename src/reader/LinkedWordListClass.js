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

  fuseWithPrevious() {
    this.word = this.prev.word + " " + this.word;
    this.prev.detach();
    return this;
  }

  fuseWithNext() {
    this.word = this.word + " " + this.next.word;
    this.next.detach();
    return this;
  }

  isEndOfSentence() {
    return ".;".includes(this.word[this.word.length - 1]);
  }

  fuseWithNeighborsIfNeeded() {
    let newWord = this;
    if (this.prev && this.prev.translation && !this.prev.isEndOfSentence()) {
      newWord = this.fuseWithPrevious();
    }

    if (this.next && this.next.translation && !this.isEndOfSentence()) {
      newWord = this.fuseWithNext();
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
