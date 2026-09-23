import InteractiveText from "./InteractiveText";

// InteractiveText for the account-less shared-article page. Taps translate
// through /public_translate_word, which persists nothing — there is no user to
// own a bookmark — and every tap asks the page's meter first, so after a
// handful of words the page can swap translation for a sign-up invitation.
//
// meter: { allow(text) -> bool, remaining() -> n, onBlocked(reason) } where
// reason is "limit" (the free words are used up) or "rate" (the server said 429).
// askTarget(onChosen, onCancelled): the visitor hasn't picked a translation
// language yet; the page asks, then the tap resumes.
export default class PublicInteractiveText extends InteractiveText {
  constructor({ getTargetLanguage, askTarget, meter, ...rest }) {
    super({ ...rest, source: "public_article" });
    this.getTargetLanguage = getTargetLanguage;
    this.askTarget = askTarget;
    this.meter = meter;
    this.readOnly = true;
  }

  translate(word, fuseWithNeighbours, onSuccess, onFusionComplete = null) {
    if (!this.getTargetLanguage()) {
      this.askTarget(() => this.translate(word, fuseWithNeighbours, onSuccess, onFusionComplete), onSuccess);
      return;
    }
    // Check before fusing: fusion merges the tapped word into an already
    // translated neighbour, so a tap refused afterwards would wipe that
    // neighbour's translation. (Re-taps of translated words never get here.)
    if (this.meter.remaining() === 0) {
      this.meter.onBlocked("limit");
      onSuccess();
      return;
    }

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
      .publicTranslateWord(this.language, this.getTargetLanguage(), textToTranslate, context, isSeparatedMwe, fullSentence)
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
