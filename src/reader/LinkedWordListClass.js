import { v4 as uuid } from "uuid";
import { List, Item } from "linked-list";

export class Word extends Item {
  constructor(token) {
    super();
    this.id = uuid();
    let bookmark = token.bookmark;
    this.word = token.text;
    this.translation = null;
    this.total_tokens = 1;
    if (bookmark) {
      this.word = bookmark.origin;
      this.translation = bookmark.translation;
      this.total_tokens = bookmark.t_total_token;
      this.bookmark_id = bookmark.id;
    }
    this.token = token;
    if (token.mergedTokens) this.mergedTokens = [...token.mergedTokens];
    else this.mergedTokens = [{ ...token }];
  }

  updateTranslation(translation, service_name, bookmark_id) {
    this.translation = translation;
    this.service_name = service_name;
    this.bookmark_id = bookmark_id;
  }

  splitIntoComponents() {
    // mergedTokens contains all the tokens in order that were merged
    // in the current word.
    // Used when deleting translations
    let wordList = this.mergedTokens.map((each) => new Word(each));
    this.append(wordList[0]);

    for (let i = 0; i < wordList.length - 1; i++) {
      wordList[i].append(wordList[i + 1]);
    }

    this.detach();
  }

  unlinkLastWord() {
    let wordList = this.mergedTokens.map((each) => new Word(each));
    this.append(wordList[0]);

    for (let i = 0; i < wordList.length - 1; i++) {
      wordList[i].append(wordList[i + 1]);
    }
    for (let i = 0; i < wordList.length - 2; i++) {
      this.next.fuseWithNext();
    }
    let new_word = this.next;
    this.detach();
    return new_word;
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
    // We keep track of merged tokens in case the user wants to delete the bookmark
    this.prev.mergedTokens.push({ ...this.token });
    this.mergedTokens = [...this.prev.mergedTokens];

    this.token = this.prev.token;

    this.prev.detach();
    return this;
  }

  fuseWithNext(api) {
    // Next is in relation to the word you click. (Next has translation)
    this.word = this.word + " " + this.next.word;
    if (this.next && this.next.bookmark_id) {
      api.deleteBookmark(this.next.bookmark_id);
    }
    this.total_tokens += this.next.total_tokens;
    this.mergedTokens = this.mergedTokens.concat(...this.next.mergedTokens);
    this.next.detach();
    return this;
  }

  fuseWithNeighborsIfNeeded(api) {
    // api: this is needed because we want to delete the previous
    // bookmark in the case of a fusion; no need to save the partial
    // translations to the DB; we used to do that; but it was just
    // poluting the DB and the
    let newWord = this;
    if (this.prev && this.prev.translation) {
      newWord = this.fuseWithPrevious(api);
    }

    if (this.next && this.next.translation) {
      newWord = this.fuseWithNext(api);
    }
    return newWord;
  }
}

export default class LinkedWordList {
  constructor(sentList) {
    let result = splitTextIntoWords(sentList);
    this.linkedWords = List.from(result);
  }

  getWords() {
    return this.linkedWords.toArray();
  }
}

// Private functions
function splitTextIntoWords(sentList) {
  let wordList = [];
  for (let sent_i = 0; sent_i < sentList.length; sent_i++) {
    let sent = sentList[sent_i];
    for (let token_i = 0; token_i < sent.length; token_i++) {
      let token = sent[token_i];
      if (token.skipRender) continue;
      wordList.push(new Word(token));
    }
  }
  return wordList;
}
