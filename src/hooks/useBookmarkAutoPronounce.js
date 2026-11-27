import { useState, useEffect } from "react";
import LocalStorage from "../assorted/LocalStorage";
import {
  PRONOUNCIATION_SETTING,
  PRONOUNCIATION_SETTING_NAME,
} from "../exercises/ExerciseTypeConstants";

// Fired on window when the setting changes, so every mounted instance (the
// toggle on a card's front and the one under Next) agrees.
const CHANGED_EVENT = "zeeguu:auto-pronounce-changed";

function storedState() {
  const value = LocalStorage.getAutoPronounceInExercises();
  return value === undefined ? PRONOUNCIATION_SETTING.off : value;
}

export default function useBookmarkAutoPronounce() {
  /*
    Handles the Auto-Pronounce feature for the exercises.

    This setting is stored in the LocalStorage and can be toggled On/Off.

    If enabled, the bookmark being practiced is pronounced when the exercise
    is completed, or, in the case of match, when it's correctly linked.
    Exercises whose prompt is the L2 word itself (e.g. the "What does it
    mean?" flashcard) also pronounce it as soon as it is shown.
  */
  const [currentPronouncingState, setCurrentPronouncingState] = useState(storedState);
  const MAX_AVAILABLE_SETTING = Math.max(...Object.values(PRONOUNCIATION_SETTING));

  useEffect(() => {
    const sync = () => setCurrentPronouncingState(storedState());
    window.addEventListener(CHANGED_EVENT, sync);
    return () => window.removeEventListener(CHANGED_EVENT, sync);
  }, []);

  function toggleAutoPronounceState() {
    const optionSelected =
      currentPronouncingState < MAX_AVAILABLE_SETTING ? currentPronouncingState + 1 : PRONOUNCIATION_SETTING.off;
    LocalStorage.setAutoPronounceInExercises(optionSelected);
    window.dispatchEvent(new Event(CHANGED_EVENT));
  }

  return [
    currentPronouncingState !== PRONOUNCIATION_SETTING.off,
    PRONOUNCIATION_SETTING_NAME[currentPronouncingState],
    toggleAutoPronounceState,
  ];
}
