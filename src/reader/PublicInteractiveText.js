import InteractiveText from "./InteractiveText";

// InteractiveText for the account-less shared-article page. Taps translate
// through /public_translate, which persists nothing for the visitor — there is
// no user to own a bookmark — and every tap asks the page's meter first, so
// after a handful of words the page can swap translation for a sign-up
// invitation. The request carries the word's *position*, never its text: the
// server reads the word from the article and caches the answer per position.
//
// meter: { allow(text) -> bool, remaining() -> n, onBlocked(reason) } where
// reason is "limit" (the free words are used up) or "rate" (the server said 429).
// askTarget(onChosen, onCancelled): the visitor hasn't picked a translation
// language yet; the page asks, then the tap resumes.
export default class PublicInteractiveText extends InteractiveText {
  constructor({ articleId, shareCode, getTargetLanguage, askTarget, meter, ...rest }) {
    super({ ...rest, source: "public_article" });
    this.articleId = articleId;
    this.shareCode = shareCode;
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
    const position = {
      part: this.contextIdentifier?.context_type === "ArticleTitle" ? "title" : this.contextIdentifier?.article_fragment_id,
      paragraph_i: word.token.paragraph_i,
      sent_i: word.token.sent_i,
      token_i: word.token.token_i,
      total_tokens: word.total_tokens,
      partner_token_i: isSeparatedMwe ? (word.token.mwe_partner_indices?.[0] ?? -1) : -1,
      s: this.shareCode || undefined,
    };

    this.api
      .publicTranslateWord(this.articleId, this.getTargetLanguage(), position)
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
