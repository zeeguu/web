import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { EXERCISE_TYPES } from "../exercises/ExerciseTypeConstants";
import { updateTokensWithBookmarks } from "./bookmarkRestoration";
import { pushDrillVocab } from "../assorted/drillCache";
import { isDev } from "../config";

// Set to true to enable verbose MWE/bookmark debugging
const MWE_DEBUG = false;

// We try to capture about a full sentence around a word.
const MAX_WORD_EXPANSION_COUNT = 28;

function isExerciseSource(source) {
  if (!source) return false;

  const exerciseTypeValues = Object.values(EXERCISE_TYPES).filter((value) => typeof value === "string");
  return exerciseTypeValues.some((exerciseType) => source.includes(exerciseType.split("_")[0]));
}

function tokenShouldSkipCount(word) {
  //   When building context, we do not count for the context limit punctuation,
  // symbols, and numbers.
  return word.token.is_punct || word.token.is_symbol || word.token.is_like_num;
}

export default class InteractiveText {
  constructor({
    tokenizedParagraphs,
    sourceId,
    api,
    previousBookmarks = [],
    translationEvent,
    language,
    source = "",
    zeeguuSpeech,
    contextIdentifier,
    formatting = null,
    getBrowsingSessionId = () => null,
    getReadingSessionId = () => null,
  }) {
    this.api = api;
    this.sourceId = sourceId;
    this.language = language;
    this.translationEvent = translationEvent ?? api.TRANSLATE_TEXT;
    this.source = source;
    this.formatting = formatting;
    this.contextIdentifier = contextIdentifier;
    this.getBrowsingSessionId = getBrowsingSessionId;
    this.getReadingSessionId = getReadingSessionId;

    // Might be worth to store a flag to keep track of wether or not the
    // bookmark / text are part of the content or stand by themselves.
    this.previousBookmarks = previousBookmarks;
    this.paragraphs = tokenizedParagraphs;
    updateTokensWithBookmarks(this.previousBookmarks, this.paragraphs);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (sent) => new LinkedWordList(sent),
    );
    this.zeeguuSpeech = language !== zeeguuSpeech.language
      ? new ZeeguuSpeech(api, language)
      : zeeguuSpeech;
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  translate(word, fuseWithNeighbours, onSuccess, onFusionComplete = null) {
    let context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis;

    [context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis] = this.getContextAndCoordinates(word);

    // MWE-aware fusion: if word is part of an MWE, fuse with partners
    // (disabled MWEs have their metadata cleared by backend, so isMWE() returns false)
    if (word.isMWE && word.isMWE()) {
      word = word.fuseMWEPartners(this.api);
      // If null, MWE partner already has translation - don't create duplicate
      if (word === null) {
        onSuccess();
        return;
      }
      // Trigger re-render after fusion so UI shows fused word immediately
      if (onFusionComplete) onFusionComplete();
    } else if (fuseWithNeighbours) {
      word = word.fuseWithNeighborsIfNeeded(this.api);
    }
    let wordSent_i = word.token.sent_i - cSent_i;
    let wordToken_i = word.token.token_i - cToken_i;

    // Use mweExpression for translation if available (separated MWEs)
    const textToTranslate = word.mweExpression || word.word;
    const isMweExpression = !!word.mweExpression;

    // Check if this is a separated MWE (has gaps between parts)
    // Backend sets mwe_is_separated=true when MWE words aren't contiguous
    const isSeparatedMwe = !!word.token?.mwe_is_separated;

    // Get MWE partner token index (for proper bookmark restoration)
    // mwe_partner_indices is always a single-element array (head -> [dep] or dep -> [head])
    const mwePartnerTokenI = word.token?.mwe_partner_indices?.[0] ?? null;

    // Get full sentence for LLM translation context (only needed for separated MWEs)
    let mweSentence = null;
    if (isSeparatedMwe) {
      mweSentence = this._getSentenceText(word);
    }

    MWE_DEBUG &&
      console.log("MWE translating:", {
        text: textToTranslate,
        isMwe: isMweExpression,
        separated: isSeparatedMwe,
      });

    const browsingSessionId = this.getBrowsingSessionId?.();
    const readingSessionId = this.getReadingSessionId?.();

    this.api
      .getOneTranslation(
        this.language,
        localStorage.native_language,
        textToTranslate,
        [wordSent_i, wordToken_i, word.total_tokens],
        context,
        [cParagraph_i, cSent_i, cToken_i],
        this.sourceId,
        leftEllipsis,
        rightEllipsis,
        this.contextIdentifier,
        this.source === "article_preview" ? "article_preview" : isExerciseSource(this.source) ? "exercise" : "reading",
        browsingSessionId,
        readingSessionId,
        isMweExpression,
        isSeparatedMwe,
        mweSentence,
        mwePartnerTokenI,
      )
      .then((response) => response.data)
      .then((data) => {
        // Dev/QA hook: in dev builds, localStorage.force_disagreement = "true"
        // forces the disagreement UI on every tap so the auto-open + bots-
        // disagree header are testable without waiting for a real split.
        // Stripped from prod builds by Vite's import.meta.env.DEV tree-shake.
        const forceDisagreement = isDev && localStorage.getItem("force_disagreement") === "true";
        const competing = forceDisagreement
          ? [{ translation: "(forced test alternative)", source: "DeepL - with context" }]
          : (data.competing_translations || null);
        // ADR 022: backend now returns the full deduped, vote-ordered
        // provider list as `alternatives` (winner at index 0). The dev hook
        // synthesises a 2-entry list so the menu still has something to
        // show when `force_disagreement` is set.
        const alternatives = forceDisagreement
          ? [
              { translation: data.translation, source: data.source || "winner", votes: 1 },
              { translation: "(forced test alternative)", source: "DeepL - with context", votes: 1 },
            ]
          : (data.alternatives || null);
        word.updateTranslation(
          data.translation,
          data.service_name,
          data.bookmark_id,
          competing,
          forceDisagreement || data.disagreement === true,
          alternatives,
        );
        // Mark word's translation as visible so the component renders it
        // This is especially important for MWEs where clicking any word
        // applies translation to the first word
        word.isTranslationVisible = true;

        // Dispatch event for bookmark creation (used by useAnonymousUpgrade)
        window.dispatchEvent(new CustomEvent("zeeguu-bookmark-created"));

        // ADR 022: fire the see-more-translations onboarding only when the
        // user just translated a word that actually has *non-winner*
        // alternatives to look at. `alternatives` always contains the winner
        // at index 0, so length > 1 means "there is more for them to see".
        if ((alternatives?.length ?? 0) > 1) {
          window.dispatchEvent(new CustomEvent('zeeguu-translation-with-alternatives'));
        }

        // Tee to the wait-drill cache so the user's own taps feed the
        // loading-screen vocab drill (see WaitDrill.js).
        if (data.translation && textToTranslate) {
          pushDrillVocab(
            this.language,
            [{ o: textToTranslate, t: data.translation }],
            "translation",
          );
        }

        onSuccess();
      })
      .catch((e) => {
        console.error("Translation failed:", e);
      });

    this.api.logUserActivity(this.translationEvent, null, word.word, this.source, this.sourceId);
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    // Simple translation-only update - preserves all position data
    this.api.updateBookmarkTranslation(word.bookmark_id, alternative);
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logUserActivity(this.api.SEND_SUGGESTION, null, alternative_info, this.source, this.sourceId);

    onSuccess();
  }

  // ADR 022: explicit Ask-LLM action, triggered from AlterMenu. Calls
  // /ask_llm_translation synchronously, appends the result to
  // word.alternatives (deduped by translation text), and fires onComplete.
  // The LLM is the most expensive translator in the bag — gating it behind
  // a user click means we only pay when a learner actually wants it.
  askLlmTranslation(word, onComplete, onError) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    const textToTranslate = word.mweExpression || word.word;

    this.api
      .askLlmTranslation(this.language, localStorage.native_language, textToTranslate, context)
      .then((result) => {
        if (!result?.translation) {
          onError && onError();
          return;
        }
        const newKey = result.translation.trim().toLowerCase();
        const primaryKey = (word.translation || "").trim().toLowerCase();
        const agreedWithPrimary = !!primaryKey && newKey === primaryKey;
        const existing = (word.alternatives || []).map((a) => (a.translation || "").trim().toLowerCase());
        // Skip the append when the LLM just confirmed the primary — the
        // row would be filtered out by AlterMenu's buildAlternatives anyway,
        // so pushing it would leave word.alternatives growing on repeated
        // Ask-LLM clicks for no visible effect. The agreedWithPrimary flag
        // below tells the menu to surface this case in the header.
        if (!agreedWithPrimary && !existing.includes(newKey)) {
          word.alternatives = [
            ...(word.alternatives || []),
            { translation: result.translation, source: result.source || "LLM", votes: 1 },
          ];
        }
        // Tell the caller whether the LLM produced a genuinely new answer
        // or just confirmed what the user already had — the AlterMenu needs
        // that distinction to avoid the "button disappeared, nothing
        // happened" failure mode where an LLM agreement gets filtered
        // out of the alternatives list and the user is left blind.
        onComplete && onComplete({ agreedWithPrimary });
      })
      .catch((e) => {
        console.error("Ask-LLM translation failed:", e);
        onError && onError(e);
      });
  }

  // ADR 022 follow-up: lazy-fetch alternatives for a word whose
  // /translate_word response didn't include them (own-past-translation
  // path). Triggered from AlterMenu open; pays the voter cost only on
  // explicit user interest. Single request, all alternatives back in one
  // response — no streaming, no row shuffling.
  fetchAlternatives(word, onComplete, onError) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    const textToTranslate = word.mweExpression || word.word;

    this.api
      .getTranslationAlternatives(this.language, localStorage.native_language, textToTranslate, context)
      .then((result) => {
        if (result?.alternatives?.length) {
          word.alternatives = result.alternatives;
        }
        onComplete && onComplete();
      })
      .catch((e) => {
        console.error("Lazy alternatives fetch failed:", e);
        onError && onError(e);
      });
  }

  playAll() {
    this.zeeguuSpeech.playAll(this.sourceId);
  }

  pause() {
    this.zeeguuSpeech.pause();
  }

  resume() {
    this.zeeguuSpeech.resume();
  }

  pronounce(word, callback, precomputedMweText = null) {
    // Use pre-computed MWE text if provided (computed before fusion detaches partners)
    // Otherwise fall back to word.mweExpression or word.word
    const textToSpeak = precomputedMweText || word.mweExpression || word.word;

    this.zeeguuSpeech.speakOut(textToSpeak);
    this.api.logUserActivity(this.api.SPEAK_TEXT, null, textToSpeak, this.source, this.sourceId);
  }

  /**
   * Get the full sentence text containing this word.
   * Used for LLM translation of separated MWEs, which need sentence context.
   */
  _getSentenceText(word) {
    const sentenceIndex = word.token.sent_i;
    const parts = [];

    // Go backwards to start of sentence
    let current = word;
    while (current.prev && current.prev.token.sent_i === sentenceIndex) {
      current = current.prev;
    }

    // Build sentence from start to end
    while (current && current.token.sent_i === sentenceIndex) {
      parts.push(current.word);
      current = current.next;
    }

    return parts.join(" ");
  }

  getContextAndCoordinates(word) {
    function _wordShouldSkipCount(word) {
      //   When building context, we do not count for the context limit punctuation,
      // symbols, and numbers.
      return word.token.is_punct || word.token.is_symbol || word.token.is_like_num;
    }

    function getLeftContextAndStartIndex(word, maxLeftContextLength, stopAtWord) {
      let currentWord = word;
      let contextBuilder = "";
      let count = 0;
      while (count < maxLeftContextLength && currentWord.prev && !currentWord.token.is_sent_start) {
        // Stop before pulling in another instance of the tapped word — it
        // would make Azure's word-alignment latch onto the wrong occurrence.
        if (stopAtWord && currentWord.prev.word.toLowerCase() === stopAtWord) break;
        currentWord = currentWord.prev;
        // Don't add space after words ending with hyphen (e.g., "l-" + "a" -> "l-a")
        const addSpace = currentWord.token.has_space && !currentWord.word.endsWith("-");
        contextBuilder = currentWord.word + (addSpace ? " " : "") + contextBuilder;
        count++;
        if (currentWord.token.is_sent_start || currentWord.token.token_i === 0) {
          break;
        }
      }
      return [
        contextBuilder,
        currentWord.token.paragraph_i,
        currentWord.token.sent_i,
        currentWord.token.token_i,
        count > 0,
      ];
    }

    function getRightContext(word, maxRightContextLength, stopAtWord) {
      let currentWord = word;
      let contextBuilder = "";
      let hasRightEllipsis = true;
      let count = 0;
      while (count < maxRightContextLength && currentWord) {
        if (currentWord.token.is_sent_start && currentWord.token.sent_i !== currentWord.prev.token.sent_i) {
          break;
        }
        // Stop before pulling in another instance of the tapped word — see
        // getLeftContextAndStartIndex.
        if (stopAtWord && currentWord.word.toLowerCase() === stopAtWord) break;
        // Don't add space after words ending with hyphen (e.g., "l-" + "a" -> "l-a")
        const addSpace = currentWord.prev.token.has_space && !currentWord.prev.word.endsWith("-");
        contextBuilder = contextBuilder + (addSpace ? " " : "") + currentWord.word;
        count++;
        currentWord = currentWord.next;
      }
      // We have a word, and it's not the start of a sentence.
      hasRightEllipsis = currentWord !== null && !currentWord.token.is_sent_start;
      return [contextBuilder, hasRightEllipsis, count > 0];
    }

    function radialExpansionContext(startingWord) {
      /**
       * Expands the context from the starting word. It adds words by alternating between
       * left and right until we reach a start/end of sentence or run out of budget.
       *
       * We do this to avoid situations where the user might click a final word in an
       * exercise and we end up creating a new BookmarkContext + Text pair.
       *
       * I reused the methods we had defined for left and right, though here they are
       * exclusively used to expand 1 token to left and right.
       */

      let [leftContext, paragraph_i, sent_i, token_i] = [
        "",
        startingWord.token.paragraph_i,
        startingWord.token.sent_i,
        startingWord.token.token_i,
      ];

      let budget = MAX_WORD_EXPANSION_COUNT;
      let leftEllipsis;
      let rightContext, rightEllipsis;
      let leftWord = startingWord;
      let rightWord = startingWord.next;
      let context = startingWord.word;
      const stopAtWord = startingWord.word.toLowerCase();

      while (budget > 0) {
        let rightUpdated = false;
        let leftUpdated = false;

        [leftContext, paragraph_i, sent_i, token_i, leftUpdated] = getLeftContextAndStartIndex(leftWord, 1, stopAtWord);
        if (leftUpdated && !tokenShouldSkipCount(leftWord)) budget -= 1;
        context = leftContext + context;

        if (budget > 0 && rightWord) {
          [rightContext, rightEllipsis, rightUpdated] = getRightContext(rightWord, 1, stopAtWord);
          if (rightUpdated && !tokenShouldSkipCount(rightWord)) budget -= 1;
          context += rightContext;
        }

        // We have captured the sentence in its entirety.
        if (!rightUpdated && !leftUpdated) break;

        // If we update one of the sides, we keep going.
        if (leftUpdated) leftWord = leftWord.prev;
        if (rightUpdated) rightWord = rightWord.next;
      }

      // If we are not at the start of the sentence, we need leftEllipsis.
      leftEllipsis = token_i !== 0;

      return [context, paragraph_i, sent_i, token_i, leftEllipsis, rightEllipsis];
    }

    return radialExpansionContext(word);
  }
}
