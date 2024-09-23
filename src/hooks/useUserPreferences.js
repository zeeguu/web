import { useEffect, useState } from "react";
import SessionStorage from "../assorted/SessionStorage";

export default function useUserPreferences(api) {
  const TRANSLATE_IN_READER = "translate_reader";
  const PRONOUNCE_IN_READER = "pronounce_reader";
  const AUDIO_EXERCISES = "audio_exercises";
  const EXERCISE_SCHEDULING = "exercise_scheduling";

  const [audioExercises, setAudioExercises] = useState(true);
  const [translateInReader, setTranslateInReader] = useState(true);
  const [pronounceInReader, setPronounceInReader] = useState(true);
  const [exerciseScheduling, setExerciseScheduling] =
    useState("scheduled_only");

  function _boolPreferenceParse(preferences, key) {
    return preferences[key] === undefined || preferences[key] === "true";
  }

  function _exerciseSchedulingParse(preferences, key) {
    if (preferences[key] === undefined) return "scheduled_only";
    return preferences[key];
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

  function updateExerciseScheduling(value) {
    setExerciseScheduling(value);
    api.saveUserPreferences({
      [EXERCISE_SCHEDULING]: value,
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
      setAudioExercises(
        _boolPreferenceParse(preferences, AUDIO_EXERCISES) &&
          SessionStorage.isAudioExercisesEnabled(),
      );
      setTranslateInReader(
        _boolPreferenceParse(preferences, TRANSLATE_IN_READER),
      );
      setPronounceInReader(
        _boolPreferenceParse(preferences, PRONOUNCE_IN_READER),
      );
      setExerciseScheduling(
        _exerciseSchedulingParse(preferences, EXERCISE_SCHEDULING),
      );
    });
  }, [api]);

  return {
    translateInReader,
    pronounceInReader,
    audioExercises,
    exerciseScheduling,
    updateAudioExercises,
    updateTranslateInReader,
    updatePronounceInReader,
    updateExerciseScheduling,
  };
}
