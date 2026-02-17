import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getOneTranslation = function (
  from_lang,
  to_lang,
  word,
  bookmark_token_i,
  context,
  context_token_i,
  sourceID,
  leftEllipsis,
  rightEllipsis,
  contextIdentifier,
  translationSource = 'reading',
  browsingSessionId = null,
  readingSessionId = null,
  isMweExpression = false,
  isSeparatedMwe = false,
  fullSentenceContext = null,
  mwePartnerTokenI = null,
) {
  console.log(`[TRANSLATION] getOneTranslation called`, {
    timestamp: new Date().toISOString(),
    word,
    from_lang,
    to_lang,
    translationSource,
    contextLength: context?.length || 0,
    isMweExpression,
  });

  let w_sent_i, w_token_i, w_total_tokens;
  let c_paragraph_i, c_sent_i, c_token_i;
  [w_sent_i, w_token_i, w_total_tokens] = bookmark_token_i;
  if (context_token_i) [c_paragraph_i, c_sent_i, c_token_i] = context_token_i;

  let payload = {
    word: word,
    context: context,
    source_id: sourceID,
    w_sent_i: w_sent_i,
    w_token_i: w_token_i,
    w_total_tokens: w_total_tokens,
    c_paragraph_i: c_paragraph_i,
    c_sent_i: c_sent_i,
    c_token_i: c_token_i,
    left_ellipsis: leftEllipsis,
    right_ellipsis: rightEllipsis,
    context_identifier: contextIdentifier,
    translation_source: translationSource,
    browsing_session_id: browsingSessionId,
    reading_session_id: readingSessionId,
    is_mwe_expression: isMweExpression,
    is_separated_mwe: isSeparatedMwe,
    full_sentence_context: fullSentenceContext,
    mwe_partner_token_i: mwePartnerTokenI,
  };

  console.log(`[TRANSLATION] About to call apiPost`, { timestamp: new Date().toISOString(), payloadSize: JSON.stringify(payload).length });

  return this.apiPost(`/get_one_translation/${from_lang}/${to_lang}`, payload);
};

Zeeguu_API.prototype.getMultipleTranslations = function (
  from_lang,
  to_lang,
  word,
  context,
  numberOfResults,
  serviceToExclude,
  translationToExclude,
  articleID,
  isSeparatedMwe = false,
  fullSentenceContext = null,
) {
  let payload = {
    word: word,
    context: context,
    numberOfResults: numberOfResults,
    articleID: articleID,
    is_separated_mwe: isSeparatedMwe,
  };
  if (fullSentenceContext) {
    payload["full_sentence_context"] = fullSentenceContext;
  }
  if (serviceToExclude) {
    payload["service"] = serviceToExclude;
  }

  if (translationToExclude) {
    payload["currentTranslation"] = translationToExclude;
  }

  return this._post(
    `get_multiple_translations/${from_lang}/${to_lang}`,
    qs.stringify(payload),
  );
};

/**
 * Stream translations as they arrive using Server-Sent Events.
 * Calls onTranslation for each translation as it arrives.
 *
 * @param {string} from_lang - Source language code
 * @param {string} to_lang - Target language code
 * @param {string} word - Word to translate
 * @param {string} context - Sentence context
 * @param {function} onTranslation - Callback called with each translation object
 * @param {function} onComplete - Callback called when all translations received
 * @param {boolean} isSeparatedMwe - Whether this is a separated MWE
 * @param {string} fullSentenceContext - Full sentence for separated MWEs
 */
Zeeguu_API.prototype.getTranslationsStreaming = function (
  from_lang,
  to_lang,
  word,
  context,
  onTranslation,
  onComplete,
  isSeparatedMwe = false,
  fullSentenceContext = null,
) {
  const payload = new FormData();
  payload.append("word", word);
  payload.append("context", context);
  payload.append("is_separated_mwe", isSeparatedMwe.toString());
  if (fullSentenceContext) {
    payload.append("full_sentence_context", fullSentenceContext);
  }

  const url = this._appendSessionToUrl(
    `get_translations_stream/${from_lang}/${to_lang}`
  );

  // Use fetch with streaming for SSE over POST
  fetch(url, {
    method: "POST",
    body: payload,
  })
    .then((response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      function processStream() {
        reader.read().then(({ done, value }) => {
          if (done) {
            onComplete && onComplete();
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split("\n");
          buffer = lines.pop(); // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                onComplete && onComplete();
                return;
              }
              try {
                const translation = JSON.parse(data);
                onTranslation && onTranslation(translation);
              } catch (e) {
                console.error("Failed to parse translation:", e);
              }
            }
          }

          processStream();
        });
      }

      processStream();
    })
    .catch((error) => {
      console.error("Streaming error:", error);
      onComplete && onComplete();
    });
};

Zeeguu_API.prototype.contributeTranslation = function (
  from_lang,
  to_lang,
  word,
  translation,
  context,
  pageUrl,
  pageTitle,
) {
  /* Currently (13-01-2025), unused in the frontend */
  let payload = {
    word: word,
    translation: translation,
    context: context,
    url: pageUrl,
    pageTitle: pageTitle,
  };
  return this._post(
    `contribute_translation/${from_lang}/${to_lang}`,
    qs.stringify(payload),
  );
};

// Simple translation-only update (from reader alternative selection)
// Preserves all position data
Zeeguu_API.prototype.updateBookmarkTranslation = async function (
  bookmark_id,
  translation,
) {
  return await this.apiPost(`/update_bookmark_translation/${bookmark_id}`, {
    translation: translation,
  });
};

// Full bookmark update (from WordEditForm - can change word, context, translation)
Zeeguu_API.prototype.updateBookmark = async function (
  bookmark_id,
  word,
  translation,
  context,
  context_identifier,
) {
  let payload = {
    word: word,
    translation: translation,
    context: context,
    context_identifier: context_identifier,
  };

  return await this.apiPost(`/update_bookmark/${bookmark_id}`, payload);
};

Zeeguu_API.prototype.basicTranlsate = function (from_lang, to_lang, phrase) {
  let url = this._appendSessionToUrl(`basic_translate/${from_lang}/${to_lang}`);
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `phrase=${phrase}`,
  });
};

Zeeguu_API.prototype.getTranslationHistory = function (limit = 50) {
  return this.apiGet(`/translation_history?limit=${limit}`).then((res) => res.data);
};
