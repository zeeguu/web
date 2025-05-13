import { useEffect, useState } from "react";
import SessionStorage from "../assorted/SessionStorage";

const TRANSLATE_IN_READER = "translate_reader";
const PRONOUNCE_IN_READER = "pronounce_reader";
const AUDIO_EXERCISES = "audio_exercises";
const MAX_WORDS_TO_SCHEDULE = "max_words_to_schedule";

export default function useUserPreferences(api) {
  const [audioExercises, setAudioExercises] = useState(true);
  const [translateInReader, setTranslateInReader] = useState(true);
  const [pronounceInReader, setPronounceInReader] = useState(true);
  const [maxWordsToSchedule, setMaxWordsToSchedule] = useState(15);

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

  useEffect(() => {
    api.getUserPreferences((preferences) => {
      console.log(preferences);
      setAudioExercises(_boolPreferenceParse(preferences, AUDIO_EXERCISES) && SessionStorage.isAudioExercisesEnabled());
      setTranslateInReader(_boolPreferenceParse(preferences, TRANSLATE_IN_READER));
      setPronounceInReader(_boolPreferenceParse(preferences, PRONOUNCE_IN_READER));
      setMaxWordsToSchedule(parseInt(preferences[MAX_WORDS_TO_SCHEDULE]));
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
  };
}
