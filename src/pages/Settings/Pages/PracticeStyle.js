import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { APIContext } from "../../../contexts/APIContext";
import SessionStorage from "../../../assorted/SessionStorage";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import ToggleOption from "../../../components/Toggles/ToggleOption";
import { setTitle } from "../../../assorted/setTitle";
import useBookmarkAutoPronounce from "../../../hooks/useBookmarkAutoPronounce";
import * as s from "./PracticeStyle.sc";

const PAGE_TITLE = "Practice style";
const PREF_AUDIO_EXERCISES = "audio_exercises";
const PREF_VARY_EXERCISE_CONTEXTS = "vary_exercise_contexts";

export default function PracticeStyle() {
  const api = useContext(APIContext);
  const { session, userPreferences, setUserPreferences } = useContext(UserContext);

  const [audioExercises, setAudioExercises] = useState(
    (userPreferences?.[PREF_AUDIO_EXERCISES] === undefined || userPreferences?.[PREF_AUDIO_EXERCISES] === "true") &&
      SessionStorage.isAudioExercisesEnabled(),
  );
  const [varyExerciseContexts, setVaryExerciseContexts] = useState(
    userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS] === "true",
  );
  const [autoPronounceBookmark, , toggleAutoPronounceState] = useBookmarkAutoPronounce();

  useEffect(() => {
    setTitle(PAGE_TITLE);
  }, []);

  useEffect(() => {
    api.getUserPreferences().then((preferences) => {
      setAudioExercises(
        (preferences[PREF_AUDIO_EXERCISES] === undefined || preferences[PREF_AUDIO_EXERCISES] === "true") &&
          SessionStorage.isAudioExercisesEnabled(),
      );
      setVaryExerciseContexts(preferences[PREF_VARY_EXERCISE_CONTEXTS] === "true");
    });
  }, [session, api]);

  function updateCachedPreference(key, value) {
    if (setUserPreferences) {
      setUserPreferences((prev) => ({ ...(prev || {}), [key]: value }));
    }
  }

  function handleToggleVaryContexts(nextValue) {
    const serialized = nextValue ? "true" : "false";
    const previousSerialized = !nextValue ? "true" : "false";
    setVaryExerciseContexts(nextValue);
    updateCachedPreference(PREF_VARY_EXERCISE_CONTEXTS, serialized);
    api.saveUserPreferences(
      { [PREF_VARY_EXERCISE_CONTEXTS]: serialized },
      () => {},
      () => {
        setVaryExerciseContexts(!nextValue);
        updateCachedPreference(PREF_VARY_EXERCISE_CONTEXTS, previousSerialized);
      },
    );
  }

  function handleToggleAudioExercises(nextValue) {
    const serialized = nextValue ? "true" : "false";
    const previousSerialized = !nextValue ? "true" : "false";
    setAudioExercises(nextValue);
    SessionStorage.setAudioExercisesEnabled(nextValue);
    updateCachedPreference(PREF_AUDIO_EXERCISES, serialized);
    api.saveUserPreferences(
      { [PREF_AUDIO_EXERCISES]: serialized },
      () => {},
      () => {
        setAudioExercises(!nextValue);
        SessionStorage.setAudioExercisesEnabled(!nextValue);
        updateCachedPreference(PREF_AUDIO_EXERCISES, previousSerialized);
      },
    );
  }

  function renderToggle({ key, label, description, checked, onToggle }) {
    return (
      <s.OptionRow key={key}>
        <ToggleOption
          checked={checked}
          onToggle={onToggle}
          className={checked ? "selected" : ""}
          label={
            <s.OptionText>
              <s.OptionLabel>{label}</s.OptionLabel>
              <s.OptionDescription>{description}</s.OptionDescription>
            </s.OptionText>
          }
        />
      </s.OptionRow>
    );
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title={PAGE_TITLE} />
      <Main>
        <s.PageBody>
          <s.Section>
            <s.SectionHeader>Example sentences</s.SectionHeader>
            {renderToggle({
              key: "vary-contexts",
              label: "Vary example sentences",
              description:
                "Show a different example sentence each time you practice a word, so you learn the word itself rather than memorizing one sentence.",
              checked: varyExerciseContexts,
              onToggle: handleToggleVaryContexts,
            })}
          </s.Section>

          <s.Section>
            <s.SectionHeader>Audio &amp; pronunciation</s.SectionHeader>
            {renderToggle({
              key: "audio-exercises",
              label: SessionStorage.isAudioExercisesEnabled()
                ? "Include audio exercises"
                : "Include audio exercises (Temporarily disabled)",
              description: "Include listening and dictation exercises in your practice sessions.",
              checked: audioExercises,
              onToggle: handleToggleAudioExercises,
            })}
            {renderToggle({
              key: "auto-pronounce",
              label: "Auto-pronounce words",
              description: "Play the pronunciation automatically after you complete an exercise.",
              checked: Boolean(autoPronounceBookmark),
              onToggle: toggleAutoPronounceState,
            })}
          </s.Section>
        </s.PageBody>
      </Main>
    </CardPage>
  );
}
