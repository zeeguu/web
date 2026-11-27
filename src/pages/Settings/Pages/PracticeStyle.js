import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { APIContext } from "../../../contexts/APIContext";
import SessionStorage from "../../../assorted/SessionStorage";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import ToggleOption from "../../../components/Toggles/ToggleOption";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import { setTitle } from "../../../assorted/setTitle";
import useBookmarkAutoPronounce from "../../../hooks/useBookmarkAutoPronounce";
import {
  FAMILY_FLASHCARDS_MEANING,
  FAMILY_FLASHCARDS_WORD,
  FAMILY_MULTIPLE_CHOICE,
  FAMILY_TYPING,
  parseExerciseFamilies,
  serializeExerciseFamilies,
} from "../../../exercises/exerciseFamilies";
import * as s from "./ReadingSettings.sc";

const PAGE_TITLE = "Practice style";
const PREF_AUDIO_EXERCISES = "audio_exercises";
const PREF_VARY_EXERCISE_CONTEXTS = "vary_exercise_contexts";
const PREF_EXERCISE_FAMILIES = "exercise_families";
const PREF_FLASHCARD_SELF_GRADE = "flashcard_self_grade";

const FAMILY_OPTIONS = [
  {
    key: FAMILY_MULTIPLE_CHOICE,
    label: "Multiple choice & matching",
    description: "Pick the right word or meaning in context.",
  },
  {
    key: FAMILY_TYPING,
    label: "Typing in context",
    description: "Fill in the blank or translate a word using its sentence.",
  },
  {
    key: FAMILY_FLASHCARDS_MEANING,
    label: "Flashcards: word → meaning",
    description: 'See the word alone and recall its meaning ("What does this mean?").',
  },
  {
    key: FAMILY_FLASHCARDS_WORD,
    label: "Flashcards: meaning → word",
    description: 'See the meaning alone and recall the word ("How do you say this?").',
  },
];

function parseStrictBool(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function isServerAudioEnabled(preferences) {
  return preferences?.[PREF_AUDIO_EXERCISES] !== "false";
}

function isSessionAudioExplicitlyDisabled() {
  return SessionStorage.getAudioExercisesEnabled() === "false";
}

function restoreSessionAudioIfMatching(expectedSerialized, previousRaw) {
  if (SessionStorage.getAudioExercisesEnabled() !== expectedSerialized) return;
  if (previousRaw === undefined || previousRaw === null) {
    sessionStorage.removeItem(SessionStorage.Keys.AudioExercisesEnabled);
  } else {
    SessionStorage.setAudioExercisesEnabled(previousRaw === "true");
  }
}

export default function PracticeStyle() {
  const api = useContext(APIContext);
  const { session, userPreferences, setUserPreferences } = useContext(UserContext);

  const [serverAudioOn, setServerAudioOn] = useState(() => isServerAudioEnabled(userPreferences));
  const [sessionAudioDisabled, setSessionAudioDisabled] = useState(() => isSessionAudioExplicitlyDisabled());
  // Tri-state: null until the API reports valid values, so a web deploy ahead
  // of the API never renders placebo switches.
  const [varyExerciseContexts, setVaryExerciseContexts] = useState(() =>
    parseStrictBool(userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS]),
  );
  const [exerciseFamilies, setExerciseFamilies] = useState(() =>
    parseExerciseFamilies(userPreferences?.[PREF_EXERCISE_FAMILIES]),
  );
  const [flashcardSelfGrade, setFlashcardSelfGrade] = useState(() =>
    parseStrictBool(userPreferences?.[PREF_FLASHCARD_SELF_GRADE]),
  );
  const [saveError, setSaveError] = useState(false);
  const [autoPronounceBookmark, , toggleAutoPronounceState] = useBookmarkAutoPronounce();

  const mountedRef = useRef(true);
  const touchedKeysRef = useRef(new Set());
  const saveSeqRef = useRef({
    [PREF_AUDIO_EXERCISES]: 0,
    [PREF_VARY_EXERCISE_CONTEXTS]: 0,
    [PREF_EXERCISE_FAMILIES]: 0,
    [PREF_FLASHCARD_SELF_GRADE]: 0,
  });
  // Last server-confirmed snapshot per key, so rapid toggles while offline
  // revert to what the server actually holds rather than an unconfirmed click.
  const confirmedRef = useRef({
    [PREF_VARY_EXERCISE_CONTEXTS]: {
      value: parseStrictBool(userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS]),
      cached: userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS],
    },
    [PREF_EXERCISE_FAMILIES]: {
      value: parseExerciseFamilies(userPreferences?.[PREF_EXERCISE_FAMILIES]),
      cached: userPreferences?.[PREF_EXERCISE_FAMILIES],
    },
    [PREF_FLASHCARD_SELF_GRADE]: {
      value: parseStrictBool(userPreferences?.[PREF_FLASHCARD_SELF_GRADE]),
      cached: userPreferences?.[PREF_FLASHCARD_SELF_GRADE],
    },
    [PREF_AUDIO_EXERCISES]: {
      serverOn: isServerAudioEnabled(userPreferences),
      sessionDisabled: isSessionAudioExplicitlyDisabled(),
      sessionRaw: SessionStorage.getAudioExercisesEnabled(),
      cached: userPreferences?.[PREF_AUDIO_EXERCISES],
    },
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setTitle(PAGE_TITLE);
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .getUserPreferences()
      .then((preferences) => {
        if (cancelled || !preferences) return;
        const updates = {};
        if (!touchedKeysRef.current.has(PREF_AUDIO_EXERCISES)) {
          const audioOn = isServerAudioEnabled(preferences);
          setServerAudioOn(audioOn);
          confirmedRef.current[PREF_AUDIO_EXERCISES] = {
            serverOn: audioOn,
            sessionDisabled: isSessionAudioExplicitlyDisabled(),
            sessionRaw: SessionStorage.getAudioExercisesEnabled(),
            cached: preferences[PREF_AUDIO_EXERCISES],
          };
          if (preferences[PREF_AUDIO_EXERCISES] !== undefined) {
            updates[PREF_AUDIO_EXERCISES] = preferences[PREF_AUDIO_EXERCISES];
          }
        }
        if (!touchedKeysRef.current.has(PREF_VARY_EXERCISE_CONTEXTS)) {
          const vary = parseStrictBool(preferences[PREF_VARY_EXERCISE_CONTEXTS]);
          setVaryExerciseContexts(vary);
          confirmedRef.current[PREF_VARY_EXERCISE_CONTEXTS] = {
            value: vary,
            cached: preferences[PREF_VARY_EXERCISE_CONTEXTS],
          };
          if (preferences[PREF_VARY_EXERCISE_CONTEXTS] !== undefined) {
            updates[PREF_VARY_EXERCISE_CONTEXTS] = preferences[PREF_VARY_EXERCISE_CONTEXTS];
          }
        }
        if (!touchedKeysRef.current.has(PREF_EXERCISE_FAMILIES)) {
          const families = parseExerciseFamilies(preferences[PREF_EXERCISE_FAMILIES]);
          setExerciseFamilies(families);
          confirmedRef.current[PREF_EXERCISE_FAMILIES] = {
            value: families,
            cached: preferences[PREF_EXERCISE_FAMILIES],
          };
          if (preferences[PREF_EXERCISE_FAMILIES] !== undefined) {
            updates[PREF_EXERCISE_FAMILIES] = preferences[PREF_EXERCISE_FAMILIES];
          }
        }
        if (!touchedKeysRef.current.has(PREF_FLASHCARD_SELF_GRADE)) {
          const selfGrade = parseStrictBool(preferences[PREF_FLASHCARD_SELF_GRADE]);
          setFlashcardSelfGrade(selfGrade);
          confirmedRef.current[PREF_FLASHCARD_SELF_GRADE] = {
            value: selfGrade,
            cached: preferences[PREF_FLASHCARD_SELF_GRADE],
          };
          if (preferences[PREF_FLASHCARD_SELF_GRADE] !== undefined) {
            updates[PREF_FLASHCARD_SELF_GRADE] = preferences[PREF_FLASHCARD_SELF_GRADE];
          }
        }
        if (setUserPreferences && Object.keys(updates).length > 0) {
          setUserPreferences((prev) => (prev && Object.keys(prev).length > 0 ? { ...prev, ...updates } : prev));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [session, api, setUserPreferences]);

  function updateCachedPreference(key, value, onlyIfCurrent) {
    if (!setUserPreferences) return;
    setUserPreferences((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;
      if (onlyIfCurrent !== undefined && prev[key] !== onlyIfCurrent) return prev;
      if (value === undefined) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  }

  function handleToggleBoolPref(key, setter, nextValue) {
    const serialized = nextValue ? "true" : "false";
    const seq = ++saveSeqRef.current[key];

    touchedKeysRef.current.add(key);
    setSaveError(false);
    setter(nextValue);
    updateCachedPreference(key, serialized);

    api.saveUserPreferences(
      { [key]: serialized },
      () => {
        if (saveSeqRef.current[key] === seq) {
          confirmedRef.current[key] = { value: nextValue, cached: serialized };
        }
      },
      () => {
        if (saveSeqRef.current[key] !== seq) return;
        const confirmed = confirmedRef.current[key];
        updateCachedPreference(key, confirmed.cached, serialized);
        if (!mountedRef.current) return;
        setter(confirmed.value);
        setSaveError(true);
      },
    );
  }

  function handleToggleFamily(familyKey, nextChecked) {
    if (!exerciseFamilies) return;
    // Always keep at least one exercise family enabled so practice is never empty.
    if (!nextChecked && exerciseFamilies.size <= 1 && exerciseFamilies.has(familyKey)) {
      return;
    }

    const nextFamilies = new Set(exerciseFamilies);
    if (nextChecked) nextFamilies.add(familyKey);
    else nextFamilies.delete(familyKey);

    const serialized = serializeExerciseFamilies(nextFamilies);
    const seq = ++saveSeqRef.current[PREF_EXERCISE_FAMILIES];

    touchedKeysRef.current.add(PREF_EXERCISE_FAMILIES);
    setSaveError(false);
    setExerciseFamilies(nextFamilies);
    updateCachedPreference(PREF_EXERCISE_FAMILIES, serialized);

    api.saveUserPreferences(
      { [PREF_EXERCISE_FAMILIES]: serialized },
      () => {
        if (saveSeqRef.current[PREF_EXERCISE_FAMILIES] === seq) {
          confirmedRef.current[PREF_EXERCISE_FAMILIES] = { value: nextFamilies, cached: serialized };
        }
      },
      () => {
        if (saveSeqRef.current[PREF_EXERCISE_FAMILIES] !== seq) return;
        const confirmed = confirmedRef.current[PREF_EXERCISE_FAMILIES];
        updateCachedPreference(PREF_EXERCISE_FAMILIES, confirmed.cached, serialized);
        if (!mountedRef.current) return;
        setExerciseFamilies(confirmed.value);
        setSaveError(true);
      },
    );
  }

  function handleToggleAudioExercises(nextValue) {
    const serialized = nextValue ? "true" : "false";
    const seq = ++saveSeqRef.current[PREF_AUDIO_EXERCISES];

    touchedKeysRef.current.add(PREF_AUDIO_EXERCISES);
    setSaveError(false);
    setServerAudioOn(nextValue);
    setSessionAudioDisabled(!nextValue);
    SessionStorage.setAudioExercisesEnabled(nextValue);
    updateCachedPreference(PREF_AUDIO_EXERCISES, serialized);

    api.saveUserPreferences(
      { [PREF_AUDIO_EXERCISES]: serialized },
      () => {
        if (saveSeqRef.current[PREF_AUDIO_EXERCISES] === seq) {
          confirmedRef.current[PREF_AUDIO_EXERCISES] = {
            serverOn: nextValue,
            sessionDisabled: !nextValue,
            sessionRaw: serialized,
            cached: serialized,
          };
        }
      },
      () => {
        if (saveSeqRef.current[PREF_AUDIO_EXERCISES] !== seq) return;
        const confirmed = confirmedRef.current[PREF_AUDIO_EXERCISES];
        restoreSessionAudioIfMatching(serialized, confirmed.sessionRaw);
        updateCachedPreference(PREF_AUDIO_EXERCISES, confirmed.cached, serialized);
        if (!mountedRef.current) return;
        setServerAudioOn(confirmed.serverOn);
        setSessionAudioDisabled(confirmed.sessionDisabled);
        setSaveError(true);
      },
    );
  }

  const audioChecked = serverAudioOn && !sessionAudioDisabled;
  const audioTemporarilyDisabled = serverAudioOn && sessionAudioDisabled;
  const anyFlashcardsEnabled =
    exerciseFamilies !== null &&
    (exerciseFamilies.has(FAMILY_FLASHCARDS_MEANING) || exerciseFamilies.has(FAMILY_FLASHCARDS_WORD));

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
          {exerciseFamilies !== null && (
            <s.Section>
              <s.SectionHeader>Exercise types</s.SectionHeader>
              {FAMILY_OPTIONS.map((option) =>
                renderToggle({
                  key: option.key,
                  label: option.label,
                  description: option.description,
                  checked: exerciseFamilies.has(option.key),
                  onToggle: (next) => handleToggleFamily(option.key, next),
                }),
              )}
              {exerciseFamilies.size === 1 && (
                <s.SizeDescription>At least one exercise type must stay on.</s.SizeDescription>
              )}
              {anyFlashcardsEnabled &&
                flashcardSelfGrade !== null &&
                renderToggle({
                  key: "flashcard-self-grade",
                  label: "Tap to flip & self-grade flashcards",
                  description:
                    "Reveal the answer with a tap and mark whether you knew it, instead of typing.",
                  checked: flashcardSelfGrade,
                  onToggle: (next) =>
                    handleToggleBoolPref(PREF_FLASHCARD_SELF_GRADE, setFlashcardSelfGrade, next),
                })}
            </s.Section>
          )}

          {varyExerciseContexts !== null && (
            <s.Section>
              <s.SectionHeader>Example sentences</s.SectionHeader>
              {renderToggle({
                key: "vary-contexts",
                label: "Vary example sentences",
                description:
                  "Show a different example sentence each time you practice a word, so you learn the word itself rather than memorizing one sentence.",
                checked: varyExerciseContexts,
                onToggle: (next) =>
                  handleToggleBoolPref(PREF_VARY_EXERCISE_CONTEXTS, setVaryExerciseContexts, next),
              })}
            </s.Section>
          )}

          <s.Section>
            <s.SectionHeader>Audio &amp; pronunciation</s.SectionHeader>
            {renderToggle({
              key: "audio-exercises",
              label: audioTemporarilyDisabled
                ? "Include audio exercises (Temporarily disabled)"
                : "Include audio exercises",
              description: "Include listening and dictation exercises in your practice sessions.",
              checked: audioChecked,
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

          {saveError && <FullWidthErrorMsg>Couldn't save your preference. Please try again.</FullWidthErrorMsg>}
        </s.PageBody>
      </Main>
    </CardPage>
  );
}
