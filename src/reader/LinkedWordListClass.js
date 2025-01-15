import { v4 as uuid } from "uuid";
import { List, Item } from "linked-list";

export class Word extends Item {
  constructor(token) {
    super();
    this.id = uuid();
    let bookmark = token.bookmark;
    if (bookmark) {
      this.word = bookmark.origin;
      this.translation = bookmark.translation;
      this.total_tokens = bookmark.t_total_token;
      this.bookmark_id = bookmark.bookmark_id;
    } else {
      this.word = token.text;
      this.translation = null;
      this.total_tokens = 1;
    }

    // Store only token? Or unpack the properties?
    this.token = token;
    this.paragraph_i = token.paragraph_i;
    this.sent_i = token.sent_i;
    this.token_i = token.token_i;
    this.is_sent_start = token.is_sent_start;
    this.is_punct = token.is_punct;
    this.is_left_punct = token.is_left_punct;
    this.is_right_punct = token.is_right_punct;
    this.is_like_num = token.is_like_num;
    this.is_like_email = token.is_like_email;
    this.is_like_url = token.is_like_url;
    if (token.mergedTokens) this.mergedTokens = [...token.mergedTokens];
    else this.mergedTokens = [{ ...token }];
  }

  splitIntoComponents() {
    // mergedTokens contains all the tokens in order that were merged
    // in the current word.
    // Used when deleting translations
    let wordList = this.mergedTokens.map((each) => new Word(each));
    wordList[0].translation = null;
    this.append(wordList[0]);

    for (let i = 0; i < wordList.length - 1; i++) {
      // set translation of word to null
      wordList[i].translation = null;
      wordList[i].append(wordList[i + 1]);
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
    // We keep track of merged tokens in case the user wants to delete the bookmark
    this.prev.mergedTokens.push({ ...this.token });
    this.mergedTokens = [...this.prev.mergedTokens];

    this.token = this.prev.token;
    this.paragraph_i = this.prev.paragraph_i;
    this.sent_i = this.prev.sent_i;
    this.token_i = this.prev.token_i;
    this.is_sent_start = this.prev.is_sent_start;
    this.is_punct = this.prev.is_punct;
    this.is_left_punct = this.prev.is_left_punct;
    this.is_right_punct = this.prev.is_right_punct;
    this.is_like_num = this.prev.is_like_num;
    this.is_like_email = this.prev.token.is_like_email;
    this.is_like_url = this.prev.token.is_like_url;
    this.total_tokens += this.prev.total_tokens;

    this.prev.detach();
    return this;
  }

  fuseWithNext(api) {
    console.log("Fuse with next!");
    this.word = this.word + " " + this.next.word;
    if (this.next && this.next.bookmark_id) {
      api.deleteBookmark(this.next.bookmark_id);
    }
    this.total_tokens += this.next.total_tokens;
    this.mergedTokens.push({ ...this.next.token });
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
