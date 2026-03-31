import { useEffect, useState } from "react";
import SessionStorage from "../assorted/SessionStorage";

const TRANSLATE_IN_READER = "translate_reader";
const PRONOUNCE_IN_READER = "pronounce_reader";
const AUDIO_EXERCISES = "audio_exercises";
const MAX_WORDS_TO_SCHEDULE = "max_words_to_schedule";
const SHOW_MWE_HINTS = "show_mwe_hints";
const SHOW_READING_TIMER = "show_reading_timer";

export default function useUserPreferences(api) {
  const [audioExercises, setAudioExercises] = useState(true);
  const [translateInReader, setTranslateInReader] = useState(true);
  const [pronounceInReader, setPronounceInReader] = useState(true);
  const [maxWordsToSchedule, setMaxWordsToSchedule] = useState(15);
  const [showMweHints, setShowMweHints] = useState(false);
  const [showReadingTimer, setShowReadingTimer] = useState(false);

  function _boolPreferenceParse(preferences, key) {
    return preferences[key] === undefined || preferences[key] === "true";
  }

  function updateMaxWordsToSchedule(value) {
    setMaxWordsToSchedule(value);

    api.saveUserPreferences({
      [MAX_WORDS_TO_SCHEDULE]: value,
    });
  }

  function updateTranslateInReader(value) {
    setTranslateInReader(value);

    api.saveUserPreferences({
      [TRANSLATE_IN_READER]: value,
    });
  }

  function updatePronounceInReader(value) {
    setPronounceInReader(value);
    api.saveUserPreferences({
      [PRONOUNCE_IN_READER]: value,
    });
  }

  function updateAudioExercises(value) {
    setAudioExercises(value);
    api.saveUserPreferences({
      [AUDIO_EXERCISES]: value,
    });
  }

  function updateShowMweHints(value) {
    setShowMweHints(value);
    api.saveUserPreferences({
      [SHOW_MWE_HINTS]: value,
    });
  }

  function updateShowReadingTimer(value) {
    setShowReadingTimer(value);
    api.saveUserPreferences({
      [SHOW_READING_TIMER]: value,
    });
  }

  useEffect(() => {
    api.getUserPreferences().then((preferences) => {
      console.log(preferences);
      setAudioExercises(_boolPreferenceParse(preferences, AUDIO_EXERCISES) && SessionStorage.isAudioExercisesEnabled());
      setTranslateInReader(_boolPreferenceParse(preferences, TRANSLATE_IN_READER));
      setPronounceInReader(_boolPreferenceParse(preferences, PRONOUNCE_IN_READER));
      setMaxWordsToSchedule(parseInt(preferences[MAX_WORDS_TO_SCHEDULE]));
      setShowMweHints(preferences[SHOW_MWE_HINTS] === "true");
      setShowReadingTimer(preferences[SHOW_READING_TIMER] === "true");
    });
  }, [api]);

  return {
    translateInReader,
    pronounceInReader,
    audioExercises,
    updateAudioExercises,
    updateTranslateInReader,
    updatePronounceInReader,
    maxWordsToSchedule,
    updateMaxWordsToSchedule,
    showMweHints,
    updateShowMweHints,
    showReadingTimer,
    updateShowReadingTimer,
  };
}
