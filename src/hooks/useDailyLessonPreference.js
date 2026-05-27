import { useCallback, useEffect, useState } from "react";

// Per-language daily audio lesson preference. The daily lesson is stored and
// queried per learned-language on the backend, so the preference is keyed per
// language too (e.g. "daily_audio_lesson_type_da"). The suggestion is stored
// verbatim — exactly what the user typed — and only canonicalized at
// generation time.
const typeKeyFor = (lang) => `daily_audio_lesson_type_${lang}`;
const suggestionKeyFor = (lang) => `daily_audio_lesson_suggestion_${lang}`;

export default function useDailyLessonPreference(api, lang) {
  // dailyType is the canonical backend value: three_words_lesson | topic | situation,
  // or null when the user hasn't set up a daily lesson for this language.
  const [dailyType, setDailyType] = useState(null);
  const [dailySuggestion, setDailySuggestion] = useState("");
  const [prefLoaded, setPrefLoaded] = useState(false);

  useEffect(() => {
    if (!lang) return;
    let cancelled = false;
    setPrefLoaded(false);
    api
      .getUserPreferences()
      .then((prefs) => {
        if (cancelled) return;
        setDailyType(prefs[typeKeyFor(lang)] || null);
        setDailySuggestion(prefs[suggestionKeyFor(lang)] || "");
        setPrefLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setPrefLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [api, lang]);

  const saveDailyLesson = useCallback(
    (lessonType, suggestion) => {
      // Optimistic local update so the UI reflects the choice immediately.
      setDailyType(lessonType);
      const verbatim = lessonType === "three_words_lesson" ? "" : suggestion || "";
      setDailySuggestion(verbatim);
      api.saveUserPreferences({
        [typeKeyFor(lang)]: lessonType,
        [suggestionKeyFor(lang)]: verbatim,
      });
    },
    [api, lang],
  );

  return {
    dailyType,
    dailySuggestion,
    prefLoaded,
    isConfigured: !!dailyType,
    saveDailyLesson,
  };
}
