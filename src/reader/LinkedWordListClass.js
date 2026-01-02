import { v4 as uuid } from "uuid";
import { List, Item } from "linked-list";

// Set to true to enable verbose MWE debugging
const MWE_DEBUG = false;

export class Word extends Item {
  constructor(token) {
    super();
    this.id = uuid();
    let bookmark = token.bookmark;
    this.word = token.text;
    this.translation = null;
    this.total_tokens = 1;
    if (bookmark) {
      // For MWE bookmarks, don't override word text with the full expression
      // Each word in the MWE should keep its original text
      if (bookmark.is_mwe) {
        this.translation = bookmark.translation;
        this.bookmark_id = bookmark.id;
        this.total_tokens = 1; // Each word is still just one token visually
        this.mweExpression = bookmark.origin; // Store full expression for reference
      } else {
        // For single-word bookmarks, keep original token text (preserves case)
        // For multi-word, reconstruct from merged tokens to preserve original case
        if (bookmark.t_total_token === 1) {
          // Single word: keep token.text (e.g., "Dingue" not "dingue")
          // this.word is already set to token.text above
        } else if (token.mergedTokens && token.mergedTokens.length > 1) {
          // Multi-word: reconstruct from merged tokens to preserve original case
          this.word = token.mergedTokens.map(t => t.text).join(" ");
        } else {
          // Fallback to bookmark.origin if no merged tokens available
          this.word = bookmark.origin;
        }
        this.translation = bookmark.translation;
        this.total_tokens = bookmark.t_total_token;
        this.bookmark_id = bookmark.id;
      }
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
    this.total_tokens += this.prev.total_tokens;

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
    // polluting the DB
    let newWord = this;

    // Don't fuse with neighbors that are part of an MWE (e.g., particle verbs)
    // MWEs should stand alone as their own unit
    const prevIsMWE = this.prev?.token?.mwe_group_id;
    const nextIsMWE = this.next?.token?.mwe_group_id;

    if (this.prev && this.prev.translation && !prevIsMWE) {
      newWord = this.fuseWithPrevious(api);
    }

    if (this.next && this.next.translation && !nextIsMWE) {
      newWord = this.fuseWithNext(api);
    }
    return newWord;
  }

  /**
   * Check if this word is part of a Multi-Word Expression (MWE).
   * MWE metadata comes from the backend MWE detector.
   *
   * LIMITATION: MWE groupings are determined by the backend during tokenization.
   * If the backend incorrectly identifies an MWE (e.g., "sollte belastet" instead
   * of "sollte belastet werden"), the user cannot currently correct this on the
   * frontend. They can only:
   * 1. Delete the incorrect MWE translation
   * 2. Report the issue via "Report Issue" button
   * 3. Translate words individually
   *
   * Future improvement: Add an "Edit MWE" dialog that allows users to:
   * - Break/ungroup incorrectly detected MWEs
   * - Extend MWEs to include additional words
   * - Store corrections and potentially send them back to improve the detector
   */
  isMWE() {
    return !!this.token.mwe_group_id;
  }

  /**
   * Get the MWE group ID for this word.
   */
  getMWEGroupId() {
    return this.token.mwe_group_id;
  }

  /**
   * Find all MWE partner Word objects in the linked list.
   * Returns array of Word objects that share the same mwe_group_id.
   */
  findMWEPartners() {
    if (!this.isMWE()) return [this];

    const groupId = this.getMWEGroupId();
    const sentenceIndex = this.token.sent_i;
    const partners = [this];

    // Search backwards in linked list for partners in same sentence
    let current = this.prev;
    while (current && current.token.sent_i === sentenceIndex) {
      if (current.token.mwe_group_id === groupId) {
        partners.unshift(current);
      }
      current = current.prev;
    }

    // Search forwards in linked list for partners in same sentence
    current = this.next;
    while (current && current.token.sent_i === sentenceIndex) {
      if (current.token.mwe_group_id === groupId) {
        partners.push(current);
      }
      current = current.next;
    }

    return partners;
  }

  /**
   * Prepare MWE for translation.
   * - Adjacent MWE words: fuse visually into single word with combined translation
   * - Non-adjacent MWE words (gaps in between): keep separate, use combined expression for translation only
   */
  fuseMWEPartners(api) {
    const partners = this.findMWEPartners();
    if (partners.length <= 1) return this;

    // Build combined expression text (for translation)
    const combinedExpression = partners.map(p => p.word).join(" ");

    // Check if all partners are adjacent (no gaps > 1)
    let allAdjacent = true;
    for (let i = 1; i < partners.length; i++) {
      const gap = partners[i].token.token_i - partners[i-1].token.token_i;
      if (gap > 1) {
        allAdjacent = false;
        break;
      }
    }

    // If first partner already has translation, don't create another
    const firstPartner = partners[0];
    if (firstPartner.translation) {
      MWE_DEBUG && console.log("MWE already translated, skipping:", combinedExpression);
      return null; // Signal to not translate
    }

    // Find groups of TRULY ADJACENT partners to fuse
    // Only fuse words that are directly next to each other (gap == 1)
    // Words with anything between them should NOT be fused visually
    let fusionGroups = [];
    let currentGroup = [partners[0]];

    for (let i = 1; i < partners.length; i++) {
      const gap = partners[i].token.token_i - partners[i-1].token.token_i;
      if (gap === 1) {
        // Truly adjacent - fuse with current group
        currentGroup.push(partners[i]);
      } else {
        // Not adjacent (has words between) - start a new group
        fusionGroups.push(currentGroup);
        currentGroup = [partners[i]];
      }
    }
    fusionGroups.push(currentGroup);

    // Only fuse the first group (which contains the head word)
    // Other groups stay as separate words with MWE styling
    const mainGroup = fusionGroups[0];
    const mainExpression = mainGroup.map(p => p.word).join(" ");

    MWE_DEBUG && console.log("MWE fusion:", {
      fullExpression: combinedExpression,
      fusedExpression: mainExpression,
      numGroups: fusionGroups.length,
      separated: this.token?.mwe_is_separated,
    });

    let headWord = mainGroup.find(w => w.token.mwe_role === "head") || mainGroup[0];

    // Update head word with fused group info
    let mergedTokens = mainGroup.map(p => ({ ...p.token }));
    headWord.word = mainExpression;
    headWord.mweExpression = combinedExpression; // Keep full expression for translation
    headWord.mergedTokens = mergedTokens;
    headWord.total_tokens = mainGroup.length;

    // Remove other partners in the main group from the list
    for (const partner of mainGroup) {
      if (partner !== headWord) {
        partner.token.skipRender = true;
        partner.detach();
      }
    }

    // Partners in other groups keep their styling but stay in place
    // (they'll show MWE color but won't be fused)

    return headWord;
  }

  // Prevent circular reference issues during JSON serialization (e.g., Sentry Replay)
  // The Word class extends Item from linked-list, which has prev/next pointers
  // that create circular references and cause "Maximum call stack size exceeded" errors
  toJSON() {
    return {
      id: this.id,
      word: this.word,
      translation: this.translation,
      total_tokens: this.total_tokens,
      bookmark_id: this.bookmark_id,
      service_name: this.service_name,
      // Omit prev/next (inherited from Item) to break circular reference
      // Omit token and mergedTokens as they may contain complex nested objects
    };
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
