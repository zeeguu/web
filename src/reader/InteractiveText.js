import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";

function getParagraphsWithIndexStart(content) {
  const paragraphDivider = /\n\n/g;
  const allMatches = [...content.matchAll(paragraphDivider)];
  let resultList = [];
  let currentStart = 0;
  for (let i = 0; i < allMatches.length - 1; i++) {
    let match = allMatches[i];
    resultList.push([
      content.slice(currentStart, match["index"]),
      currentStart,
    ]);
    currentStart = match["index"] + match[0].length;
  }
  resultList.push([content.slice(currentStart, content.length), currentStart]);
  return resultList;
}
export default class InteractiveText {
  constructor(
    content,
    articleInfo,
    api,
    translationEvent = api.TRANSLATE_TEXT,
    source = "",
    zeeguuSpeech,
  ) {
    this.articleInfo = articleInfo;
    this.api = api;
    this.translationEvent = translationEvent;
    this.source = source;
    this.paragraphs =
      articleInfo.paragraphs || getParagraphsWithIndexStart(content);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (each) => new LinkedWordList(each[0], each[1]),
    );
    if (this.articleInfo.language !== zeeguuSpeech.language) {
      this.zeeguuSpeech = new ZeeguuSpeech(api, this.articleInfo.language);
    } else {
      this.zeeguuSpeech = zeeguuSpeech;
    }
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  translate(word, onSuccess) {
    let context, contextIndexStart;

    [context, contextIndexStart] = this.getContextAndStartingIndex(word);
    let isItTitle = this.articleInfo.title.trim() === context.trim();
    word = word.fuseWithNeighborsIfNeeded(this.api);
    this.api
      .getOneTranslation(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        word.wordIndexInContent - contextIndexStart,
        context,
        isItTitle ? undefined : contextIndexStart,
        window.location,
        this.articleInfo.title,
        this.articleInfo.id,
      )
      .then((response) => response.json())
      .then((data) => {
        word.translation = data.translation;
        word.service_name = data.service_name;
        word.bookmark_id = data.bookmark_id;
        onSuccess();
      })
      .catch(() => {
        console.log("could not retreive translation");
      });

    this.api.logReaderActivity(
      this.translationEvent,
      this.articleInfo.id,
      word.word,
      this.source,
    );
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    this.api.updateBookmark(
      word.bookmark_id,
      word.word,
      alternative,
      this.getContextAndStartingIndex(word),
    );
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logReaderActivity(
      this.api.SEND_SUGGESTION,
      this.articleInfo.id,
      alternative_info,
      this.source,
    );

    onSuccess();
  }

  alternativeTranslations(word, onSuccess) {
    let context = this.getContextAndStartingIndex(word);
    this.api
      .getMultipleTranslations(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        this.articleInfo.url,
        -1,
        word.service_name,
        word.translation,
        this.articleInfo.id,
      )
      .then((response) => response.json())
      .then((data) => {
        word.alternatives = data.translations;
        onSuccess();
      });
  }

  playAll() {
    console.log("playing all");
    this.zeeguuSpeech.playAll(this.articleInfo);
  }

  pause() {
    console.log("pausing");
    this.zeeguuSpeech.pause();
  }

  resume() {
    console.log("resuming");
    this.zeeguuSpeech.resume();
  }

  pronounce(word) {
    this.zeeguuSpeech.speakOut(word.word);

    this.api.logReaderActivity(
      this.api.SPEAK_TEXT,
      this.articleInfo.id,
      word.word,
      this.source,
    );
  }

  /**
   * Homemade... might not work that well for all languages...
   * - won't catch a sentence that ends with ...
   * might be tricked by I'm going to N.Y. to see my friend.
   */
  getContextAndStartingIndex(word) {
    function endOfSentenceIn(word) {
      const endOfSentenceSigns = [".", "?", "!"];
      let text = word.word;

      let lastLetter = text[text.length - 1];

      if (word.next) {
        let startOfNextWord = word.next.word[0];
        let nextWordIsUppercase =
          startOfNextWord === startOfNextWord.toUpperCase();

        return (
          nextWordIsUppercase && endOfSentenceSigns.indexOf(lastLetter) > -1
        );
      } else {
        return endOfSentenceSigns.indexOf(lastLetter) > -1;
      }
    }

    function getLeftContextAndStartIndex(word, count, startingIndex) {
      if (count === 0 || !word || endOfSentenceIn(word))
        return ["", startingIndex];
      let result = getLeftContextAndStartIndex(
        word.prev,
        count - 1,
        word.prev ? word.prev.wordIndexInContent : startingIndex,
      );
      return [result[0] + " " + word.word, result[1]];
    }

    function getRightContext(word, count) {
      if (count === 0 || !word) return "";
      if (endOfSentenceIn(word)) return word.word;
      return word.word + " " + getRightContext(word.next, count - 1);
    }

    let [leftContext, indexAtStart] = ["", word.wordIndexInContent];
    if (word.prev)
      [leftContext, indexAtStart] = getLeftContextAndStartIndex(
        word.prev,
        32,
        word.wordIndexInContent,
      );
    let context = leftContext + " " + getRightContext(word, 32);
    return [context, indexAtStart];
  }
}
