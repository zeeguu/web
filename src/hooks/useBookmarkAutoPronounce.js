import { useState, useEffect } from "react";
import LocalStorage from "../assorted/LocalStorage";
import {
  PRONOUNCIATION_SETTING,
  PRONOUNCIATION_SETTING_NAME,
} from "../exercises/ExerciseTypeConstants";

export default function useBookmarkAutoPronounce() {
  const [currentPronouncingState, setCurrentPronouncingState] = useState();
  const [currentPronouncingString, setCurrentPronouncingString] = useState();
  const [IsPronounceBookmark, setIsPronounceBookmark] = useState();
  const MAX_AVAILABLE_SETTING = Math.max(
    ...Object.values(PRONOUNCIATION_SETTING),
  );

  function __updateState(value) {
    setCurrentPronouncingState(value);
    setCurrentPronouncingString(PRONOUNCIATION_SETTING_NAME[value]);
    setIsPronounceBookmark(value !== PRONOUNCIATION_SETTING.off);
  }

  useEffect(() => {
    let currentState = LocalStorage.getAutoPronounceInExercises();
    if (currentState === undefined) currentState = PRONOUNCIATION_SETTING.off;
    __updateState(currentState);
  });

  function cyclePronounciationState() {
    let optionSelected;
    if (currentPronouncingState < MAX_AVAILABLE_SETTING) {
      optionSelected = currentPronouncingState + 1;
    } else optionSelected = PRONOUNCIATION_SETTING.off;
    __updateState(optionSelected);
    LocalStorage.setAutoPronounceInExercises(optionSelected);
  }

  return [
    IsPronounceBookmark,
    currentPronouncingState,
    currentPronouncingString,
    cyclePronounciationState,
  ];
}
