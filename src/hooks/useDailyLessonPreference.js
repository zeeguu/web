import { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

// Per-(user, learned-language) daily audio lesson config, owned by the backend
// DailyAudioSubscription model and read/written via the dedicated
// /daily_subscription + /configure_daily_subscription endpoints. The suggestion
// is stored verbatim — exactly what the user typed — and only canonicalized at
// generation time.
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
    api.getDailySubscription(
      lang,
      (sub) => {
        if (cancelled) return;
        setDailyType(sub?.lesson_type || null);
        setDailySuggestion(sub?.raw_suggestion || "");
        setPrefLoaded(true);
      },
      () => {
        if (!cancelled) setPrefLoaded(true);
      },
    );
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
      api.configureDailySubscription(
        lang,
        lessonType,
        verbatim,
        null,
        (err) =>
          Sentry.captureException(err, { tags: { feature: "daily_audio_preference" } }),
      );
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
