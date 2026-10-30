// Current language first, then the most recently practised (ISO dates compare
// as strings; never-practised languages go last), then the longest streak.
export function orderModalLanguages(languages, { learnedLanguage, lastPracticedByCode, streaksByCode }) {
  return [...languages].sort((a, b) => {
    if (a.code === learnedLanguage) return -1;
    if (b.code === learnedLanguage) return 1;
    const aLast = lastPracticedByCode[a.code] || "";
    const bLast = lastPracticedByCode[b.code] || "";
    if (aLast !== bLast) return aLast < bLast ? 1 : -1;
    return (streaksByCode[b.code] || 0) - (streaksByCode[a.code] || 0);
  });
}
