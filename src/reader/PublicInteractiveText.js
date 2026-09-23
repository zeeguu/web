import InteractiveText from "./InteractiveText";

// InteractiveText for the account-less shared-article page. Taps translate
// through /public_translate_word, which persists nothing — there is no user to
// own a bookmark — and every tap asks the page's meter first, so after a
// handful of words the page can swap translation for a sign-up invitation.
//
// meter: { allow(text) -> bool, onBlocked(reason) } where reason is "limit"
// (the page's free words are used up) or "rate" (the server said 429).
export default class PublicInteractiveText extends InteractiveText {
  constructor({ targetLanguage, meter, ...rest }) {
    super({ ...rest, source: "public_article" });
    this.targetLanguage = targetLanguage;
    this.meter = meter;
    this.readOnly = true;
  }

  translate(word, fuseWithNeighbours, onSuccess, onFusionComplete = null) {
    const [context] = this.getContextAndCoordinates(word);

    if (word.isMWE && word.isMWE()) {
      word = word.fuseMWEPartners(this.api);
      if (word === null) {
        onSuccess();
        return;
      }
      if (onFusionComplete) onFusionComplete();
    } else if (fuseWithNeighbours) {
      word = word.fuseWithNeighborsIfNeeded(this.api);
    }

    const textToTranslate = word.mweExpression || word.word;
    if (!this.meter.allow(textToTranslate)) {
      this.meter.onBlocked("limit");
      onSuccess();
      return;
    }

    const isSeparatedMwe = !!word.token?.mwe_is_separated;
    const fullSentence = isSeparatedMwe ? this._getSentenceText(word) : null;

    this.api
      .publicTranslateWord(this.language, this.targetLanguage, textToTranslate, context, isSeparatedMwe, fullSentence)
      .then((data) => {
        word.updateTranslation(data.translation, data.source, null, null, false, null);
        word.isTranslationVisible = true;
        onSuccess();
      })
      .catch((e) => {
        if (e.status === 429) this.meter.onBlocked("rate");
        else console.error("Public translation failed:", e);
        onSuccess();
      });
  }

  // No account: nothing to log, no alternatives menu, no audio.
  pronounce() {}
  fetchAlternatives(word, onComplete) {
    onComplete && onComplete();
  }
}
