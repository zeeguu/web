import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
const PRACTICE_CONFIG_KEY = "practice_config";

const LabelTitle = styled.span`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const DirectionPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background-color: ${({ $active }) => ($active ? "rgba(255, 187, 84, 0.22)" : "var(--bg-tertiary)")};
  color: ${({ $active }) => ($active ? "var(--text-primary)" : "var(--text-muted)")};
`;

function shortLangCode(code, fallback) {
  const base = (code || "").split("-")[0].trim().toUpperCase();
  return base || fallback;
}

function parseStrictBool(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

// Derive the 4 UI switches (3 practice formats + 1 cross-cutting typing switch)
// from the stored `exercise_families` + `flashcard_self_grade` preferences.
// Returns null until the API has sent valid `exercise_families`.
function parsePracticeConfig(preferences) {
  const families = parseExerciseFamilies(preferences?.[PREF_EXERCISE_FAMILIES]);
  if (!families) return null;
  const sentences = families.has(FAMILY_MULTIPLE_CHOICE) || families.has(FAMILY_TYPING);
  const flashcardsMeaning = families.has(FAMILY_FLASHCARDS_MEANING);
  const flashcardsWord = families.has(FAMILY_FLASHCARDS_WORD);
  const selfGrade = parseStrictBool(preferences?.[PREF_FLASHCARD_SELF_GRADE]) === true;
  const typing = !selfGrade && (!sentences || families.has(FAMILY_TYPING));
  return { sentences, flashcardsMeaning, flashcardsWord, typing };
}

function serializePracticeConfig(config) {
  const families = new Set();
  if (config.sentences) {
    families.add(FAMILY_MULTIPLE_CHOICE);
    if (config.typing) families.add(FAMILY_TYPING);
  }
  if (config.flashcardsMeaning) families.add(FAMILY_FLASHCARDS_MEANING);
  if (config.flashcardsWord) families.add(FAMILY_FLASHCARDS_WORD);
  return {
    [PREF_EXERCISE_FAMILIES]: serializeExerciseFamilies(families),
    [PREF_FLASHCARD_SELF_GRADE]: config.typing ? "false" : "true",
  };
}

function enabledFormatCount(config) {
  return Number(config.sentences) + Number(config.flashcardsMeaning) + Number(config.flashcardsWord);
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
  const { session, userDetails, userPreferences, setUserPreferences } = useContext(UserContext);

  const [serverAudioOn, setServerAudioOn] = useState(() => isServerAudioEnabled(userPreferences));
  const [sessionAudioDisabled, setSessionAudioDisabled] = useState(() => isSessionAudioExplicitlyDisabled());
  // Tri-state: null until the API reports valid values, so a web deploy ahead
  // of the API never renders placebo switches.
  const [varyExerciseContexts, setVaryExerciseContexts] = useState(() =>
    parseStrictBool(userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS]),
  );
  const [practiceConfig, setPracticeConfig] = useState(() => parsePracticeConfig(userPreferences));
  const [saveError, setSaveError] = useState(false);
  const [autoPronounceBookmark, , toggleAutoPronounceState] = useBookmarkAutoPronounce();

  const mountedRef = useRef(true);
  const touchedKeysRef = useRef(new Set());
  const saveSeqRef = useRef({
    [PREF_AUDIO_EXERCISES]: 0,
    [PREF_VARY_EXERCISE_CONTEXTS]: 0,
    [PRACTICE_CONFIG_KEY]: 0,
  });
  const confirmedSeqRef = useRef({
    [PREF_AUDIO_EXERCISES]: 0,
    [PREF_VARY_EXERCISE_CONTEXTS]: 0,
    [PRACTICE_CONFIG_KEY]: 0,
  });
  // Last server-confirmed snapshot per key, so rapid toggles while offline
  // revert to what the server actually holds rather than an unconfirmed click.
  const confirmedRef = useRef({
    [PREF_VARY_EXERCISE_CONTEXTS]: {
      value: parseStrictBool(userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS]),
      cached: userPreferences?.[PREF_VARY_EXERCISE_CONTEXTS],
    },
    [PRACTICE_CONFIG_KEY]: {
      value: parsePracticeConfig(userPreferences),
      cached: {
        [PREF_EXERCISE_FAMILIES]: userPreferences?.[PREF_EXERCISE_FAMILIES],
        [PREF_FLASHCARD_SELF_GRADE]: userPreferences?.[PREF_FLASHCARD_SELF_GRADE],
      },
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
        if (!touchedKeysRef.current.has(PRACTICE_CONFIG_KEY)) {
          const config = parsePracticeConfig(preferences);
          setPracticeConfig(config);
          confirmedRef.current[PRACTICE_CONFIG_KEY] = {
            value: config,
            cached: {
              [PREF_EXERCISE_FAMILIES]: preferences[PREF_EXERCISE_FAMILIES],
              [PREF_FLASHCARD_SELF_GRADE]: preferences[PREF_FLASHCARD_SELF_GRADE],
            },
          };
          if (preferences[PREF_EXERCISE_FAMILIES] !== undefined) {
            updates[PREF_EXERCISE_FAMILIES] = preferences[PREF_EXERCISE_FAMILIES];
          }
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

  function updateCachedPreferences(entries, expectedCurrent) {
    if (!setUserPreferences) return;
    setUserPreferences((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;
      if (expectedCurrent) {
        for (const [key, expectedVal] of Object.entries(expectedCurrent)) {
          if (prev[key] !== expectedVal) return prev;
        }
      }
      const next = { ...prev };
      for (const [key, value] of Object.entries(entries)) {
        if (value === undefined) delete next[key];
        else next[key] = value;
      }
      return next;
    });
  }

  function handleToggleVaryContexts(nextValue) {
    const serialized = nextValue ? "true" : "false";
    const seq = ++saveSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS];

    touchedKeysRef.current.add(PREF_VARY_EXERCISE_CONTEXTS);
    setSaveError(false);
    setVaryExerciseContexts(nextValue);
    updateCachedPreferences({ [PREF_VARY_EXERCISE_CONTEXTS]: serialized });

    api.saveUserPreferences(
      { [PREF_VARY_EXERCISE_CONTEXTS]: serialized },
      () => {
        if (seq > confirmedSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS]) {
          confirmedSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS] = seq;
          confirmedRef.current[PREF_VARY_EXERCISE_CONTEXTS] = { value: nextValue, cached: serialized };
        }
      },
      () => {
        if (saveSeqRef.current[PREF_VARY_EXERCISE_CONTEXTS] !== seq) return;
        const confirmed = confirmedRef.current[PREF_VARY_EXERCISE_CONTEXTS];
        updateCachedPreferences(
          { [PREF_VARY_EXERCISE_CONTEXTS]: confirmed.cached },
          { [PREF_VARY_EXERCISE_CONTEXTS]: serialized },
        );
        if (!mountedRef.current) return;
        setVaryExerciseContexts(confirmed.value);
        setSaveError(true);
      },
    );
  }

  function handleUpdatePracticeConfig(field, nextValue) {
    if (!practiceConfig) return;
    const nextConfig = { ...practiceConfig, [field]: nextValue };
    // Always keep at least one practice format enabled so sessions are never empty.
    if (enabledFormatCount(nextConfig) === 0) return;

    const payload = serializePracticeConfig(nextConfig);
    const seq = ++saveSeqRef.current[PRACTICE_CONFIG_KEY];

    touchedKeysRef.current.add(PRACTICE_CONFIG_KEY);
    setSaveError(false);
    setPracticeConfig(nextConfig);
    updateCachedPreferences(payload);

    api.saveUserPreferences(
      payload,
      () => {
        if (seq > confirmedSeqRef.current[PRACTICE_CONFIG_KEY]) {
          confirmedSeqRef.current[PRACTICE_CONFIG_KEY] = seq;
          confirmedRef.current[PRACTICE_CONFIG_KEY] = { value: nextConfig, cached: payload };
        }
      },
      () => {
        if (saveSeqRef.current[PRACTICE_CONFIG_KEY] !== seq) return;
        const confirmed = confirmedRef.current[PRACTICE_CONFIG_KEY];
        updateCachedPreferences(confirmed.cached, payload);
        if (!mountedRef.current) return;
        setPracticeConfig(confirmed.value);
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
    updateCachedPreferences({ [PREF_AUDIO_EXERCISES]: serialized });

    api.saveUserPreferences(
      { [PREF_AUDIO_EXERCISES]: serialized },
      () => {
        if (seq > confirmedSeqRef.current[PREF_AUDIO_EXERCISES]) {
          confirmedSeqRef.current[PREF_AUDIO_EXERCISES] = seq;
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
        updateCachedPreferences(
          { [PREF_AUDIO_EXERCISES]: confirmed.cached },
          { [PREF_AUDIO_EXERCISES]: serialized },
        );
        if (!mountedRef.current) return;
        setServerAudioOn(confirmed.serverOn);
        setSessionAudioDisabled(confirmed.sessionDisabled);
        setSaveError(true);
      },
    );
  }

  const audioChecked = serverAudioOn && !sessionAudioDisabled;
  const audioTemporarilyDisabled = serverAudioOn && sessionAudioDisabled;
  const learnedCode = shortLangCode(userDetails?.learned_language, "L2");
  const nativeCode = shortLangCode(userDetails?.native_language, "L1");

  function renderToggle({ key, label, description, checked, onToggle, tag }) {
    return (
      <s.OptionRow key={key}>
        <ToggleOption
          checked={checked}
          onToggle={onToggle}
          className={checked ? "selected" : ""}
          label={
            <s.OptionText>
              <s.OptionLabel>
                <LabelTitle>
                  <span>{label}</span>
                  {tag && (
                    <DirectionPill aria-hidden="true" $active={checked}>
                      {tag}
                    </DirectionPill>
                  )}
                </LabelTitle>
              </s.OptionLabel>
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
          {practiceConfig !== null && (
            <s.Section>
              <s.SectionHeader>What to practice</s.SectionHeader>
              {renderToggle({
                key: "sentences",
                label: "In sentences",
                description: "Practice words inside sentences with multiple choice, matching, and blanks.",
                checked: practiceConfig.sentences,
                onToggle: (next) => handleUpdatePracticeConfig("sentences", next),
              })}
              {renderToggle({
                key: "flashcards-meaning",
                label: "Flashcards: word → meaning",
                description: 'See the word alone and recall its meaning ("What does this mean?").',
                tag: `${learnedCode} → ${nativeCode}`,
                checked: practiceConfig.flashcardsMeaning,
                onToggle: (next) => handleUpdatePracticeConfig("flashcardsMeaning", next),
              })}
              {renderToggle({
                key: "flashcards-word",
                label: "Flashcards: meaning → word",
                description: 'See the meaning alone and recall the word ("How do you say this?").',
                tag: `${nativeCode} → ${learnedCode}`,
                checked: practiceConfig.flashcardsWord,
                onToggle: (next) => handleUpdatePracticeConfig("flashcardsWord", next),
              })}
              {enabledFormatCount(practiceConfig) === 1 && (
                <s.SizeDescription>At least one practice format must stay on.</s.SizeDescription>
              )}
            </s.Section>
          )}

          <s.Section>
            <s.SectionHeader>Input &amp; audio</s.SectionHeader>
            {practiceConfig !== null &&
              renderToggle({
                key: "typing-exercises",
                label: "Typing exercises",
                description:
                  "Type answers in blanks and flashcards. Turn off for tap-only practice and flip cards.",
                checked: practiceConfig.typing,
                onToggle: (next) => handleUpdatePracticeConfig("typing", next),
              })}
            {renderToggle({
              key: "audio-exercises",
              label: audioTemporarilyDisabled
                ? "Include audio exercises (Temporarily disabled)"
                : "Include audio exercises",
              description: "Include listening and dictation exercises in your practice sessions.",
              checked: audioChecked,
              onToggle: handleToggleAudioExercises,
            })}
          </s.Section>

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
            <s.SectionHeader>Pronunciation</s.SectionHeader>
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
