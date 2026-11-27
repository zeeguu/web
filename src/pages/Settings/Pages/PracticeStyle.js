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
import * as s from "./PracticeStyle.sc";

const PAGE_TITLE = "Practice style";
const PREF_AUDIO_EXERCISES = "audio_exercises";
const PREF_VARY_EXERCISE_CONTEXTS = "vary_exercise_contexts";

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
  // Tri-state: null until the API reports "true" or "false", so a web deploy
  // ahead of the API never renders a placebo switch or flashes OFF for users in
  // the 50% ON rollout arm.
  const [varyExerciseContexts, setVaryExerciseContexts] = useState(() =>
    parseStrictBool(userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS]),
  );
  const [saveError, setSaveError] = useState(false);
  const [autoPronounceBookmark, , toggleAutoPronounceState] = useBookmarkAutoPronounce();

  const mountedRef = useRef(true);
  const touchedKeysRef = useRef(new Set());
  const saveSeqRef = useRef({ [PREF_AUDIO_EXERCISES]: 0, [PREF_VARY_EXERCISE_CONTEXTS]: 0 });
  // Last server-confirmed snapshot per key, so rapid toggles while offline
  // revert to what the server actually holds rather than an unconfirmed click.
  const confirmedRef = useRef({
    [PREF_VARY_EXERCISE_CONTEXTS]: {
      value: parseStrictBool(userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS]),
      cached: userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS],
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

  function handleToggleVaryContexts(nextValue) {
    const serialized = nextValue ? "true" : "false";
    const seq = ++saveSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS];

    touchedKeysRef.current.add(PREF_VARY_EXERCISE_CONTEXTS);
    setSaveError(false);
    setVaryExerciseContexts(nextValue);
    updateCachedPreference(PREF_VARY_EXERCISE_CONTEXTS, serialized);

    api.saveUserPreferences(
      { [PREF_VARY_EXERCISE_CONTEXTS]: serialized },
      () => {
        if (saveSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS] === seq) {
          confirmedRef.current[PREF_VARY_EXERCISE_CONTEXTS] = { value: nextValue, cached: serialized };
        }
      },
      () => {
        if (saveSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS] !== seq) return;
        const confirmed = confirmedRef.current[PREF_VARY_EXERCISE_CONTEXTS];
        // Revert shared cache even if unmounted (e.g. user tapped toggle then Back).
        updateCachedPreference(PREF_VARY_EXERCISE_CONTEXTS, confirmed.cached, serialized);
        if (!mountedRef.current) return;
        setVaryExerciseContexts(confirmed.value);
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
          {varyExerciseContexts !== null && (
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
