import { v4 as uuid } from "uuid";
import { List, Item } from "linked-list";

export class Word extends Item {
  constructor(token, prevTranslation = null) {
    super();
    this.id = uuid();
    this.word = token.text;
    this.translation = prevTranslation;
    this.paragraph_i = token.par_i;
    // Store only token? Or unpack the properties?
    this.token = token;
    this.sent_i = token.sent_i;
    this.token_i = token.token_i;
    this.is_sent_start = token.is_sent_start;
    this.is_punct = token.is_punct;
    this.is_left_punct = token.is_left_punct;
    this.is_right_punct = token.is_right_punct;
    this.is_like_num = token.is_like_num;
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
    this.wordIndexInContent = this.prev.wordIndexInContent;
    this.prev.detach();
    return this;
  }

  fuseWithNext(api) {
    this.word = this.word + " " + this.next.word;
    console.log("FUSED WITH NEXT");
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
  constructor(sentList, previousTranslations) {
    let result = splitTextIntoWords(sentList, previousTranslations);
    this.linkedWords = List.from(result);
  }

  getWords() {
    return this.linkedWords.toArray();
  }
}

// Private functions
function splitTextIntoWords(sentList, previousTranslations) {
  let wordList = [];
  for (let sent_i = 0; sent_i < sentList.length; sent_i++) {
    let sent = sentList[sent_i];
    for (let token_i = 0; token_i < sent.length; token_i++) {
      let token = sent[token_i];
      wordList.push(new Word(token, token["translation"]));
    }
  }

  return wordList;
}
