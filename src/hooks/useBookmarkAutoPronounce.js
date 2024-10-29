import { useState, useEffect } from "react";
import LocalStorage from "../assorted/LocalStorage";
import {
  PRONOUNCIATION_SETTING,
  PRONOUNCIATION_SETTING_NAME,
} from "../exercises/ExerciseTypeConstants";

export default function useBookmarkAutoPronounce() {
  /*
    Handles the Auto-Pronounce feature for the exercises.

    This setting is stored in the LocalStorage and can be toggled On/Off.

    If enabled, then the bookmark being practiced is pronounced when the exercise
    is completed, or, in the case of match, when it's correctly linked. 

    This hooks manages the state of the setting based on whether it's on/off, and
    updates it when the user toggles it in the exercises.
  */
  const [currentPronouncingState, setCurrentPronouncingState] = useState();
  const [currentPronouncingString, setCurrentPronouncingString] = useState();
  const [autoPronounceBookmark, setAutoPronounceBookmark] = useState();
  const MAX_AVAILABLE_SETTING = Math.max(
    ...Object.values(PRONOUNCIATION_SETTING),
  );

  function __updateState(value) {
    setCurrentPronouncingState(value);
    setCurrentPronouncingString(PRONOUNCIATION_SETTING_NAME[value]);
    setAutoPronounceBookmark(value !== PRONOUNCIATION_SETTING.off);
  }

  useEffect(() => {
    let currentState = LocalStorage.getAutoPronounceInExercises();
    if (currentState === undefined) currentState = PRONOUNCIATION_SETTING.off;
    __updateState(currentState);
  });

  function toggleAutoPronounceState() {
    let optionSelected;
    if (currentPronouncingState < MAX_AVAILABLE_SETTING) {
      optionSelected = currentPronouncingState + 1;
    } else optionSelected = PRONOUNCIATION_SETTING.off;
    __updateState(optionSelected);
    LocalStorage.setAutoPronounceInExercises(optionSelected);
  }

  return [
    autoPronounceBookmark,
    currentPronouncingString,
    toggleAutoPronounceState,
  ];
}
