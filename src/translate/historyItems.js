// Translate's History: the words the learner searched and the texts they read
// interactively, in one list, newest first. Texts in every language: one the
// reader guessed as another language can be found again (and fixed, or
// removed); the row names that language.
const when = (iso) => (iso ? Date.parse(iso) || 0 : 0);

export function historyItems(searches, texts, learnedLanguage) {
  return [
    ...(searches || []).map((search) => ({ key: `s${search.id}`, at: when(search.search_time), search })),
    ...(texts || []).map((text) => ({
      key: `t${text.id}`,
      at: when(text.last_opened_at),
      text,
      otherLanguage: text.language !== learnedLanguage ? text.language : null,
    })),
  ].sort((a, b) => b.at - a.at);
}
