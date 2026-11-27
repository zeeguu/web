import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "../components/DialogWrapper";
import SuggestionSelector, { pillToBackend, backendToPill } from "./SuggestionSelector";
import { PillRow, SelectablePill } from "./SuggestionSelector.sc";
import { BannerButton } from "./SharedLessonView.sc";
import { SubtleTextButton } from "./LessonView.sc";
import { zeeguuOrange } from "../components/colors";
import { UserContext } from "../contexts/UserContext";
import { isA0Learner } from "../utils/misc/userCefrLevel";
import A0SituationPicker from "./A0SituationPicker";

// At A0 the learner drills their own role in the dialogue. Who they speak as is
// theirs to say, never guessed from their name. There is no "either": in
// languages where the words depend on the speaker's gender (French, Bulgarian…)
// it made the learner's gender change from one lesson to the next. Stored as the
// audio_lesson_character user preference; old app versions may still have
// stored "either", which counts as not chosen. Asked here only until it is
// chosen, since the first lesson needs it; after that it is changed with the
// other audio lesson settings (Settings > Audio lessons), as is the length.
const CHARACTERS = [
  { value: "man", label: "A man" },
  { value: "woman", label: "A woman" },
];
const isCharacter = (value) => CHARACTERS.some((c) => c.value === value);

/**
 * Setup / "Change daily topic" dialog. Hosts the lesson-type selector and
 * persists the per-language daily-lesson preference. The dialog never
 * generates audio itself — it hands the chosen (type, suggestion) back to the
 * parent via onSubmit, which owns the generation state machine and progress UI.
 *
 * onSubmit(backendType, verbatimSuggestion, generateNow):
 *   generateNow=true  → first-ever setup: generate today's lesson now
 *   generateNow=false → reconfigure: save; the change applies from the next
 *                       scheduled lesson (we never regenerate the same day)
 */
export default function DailyLessonSettingsDialog({
  api,
  initialType,
  initialSuggestion,
  alreadySubscribed,
  onSubmit,
  onTurnOff,
  onDismiss,
}) {
  // At A0 every lesson is a situation the learner learns to get through (see
  // future-work/a0-audio-lessons.md in the docs repo): no Vocabulary, no Topic.
  const { userDetails, setUserPreferences } = useContext(UserContext);
  const a0 = isA0Learner(userDetails);
  const types = a0 ? ["situation"] : undefined;

  // The primary button is always meaningful: with no pending change it's a
  // neutral "Close" that just dismisses; once the user edits something it
  // morphs into the active orange "Save settings". No dead greyed-out slab.
  const [pillType, setPillType] = useState(a0 ? "situation" : initialType ? backendToPill(initialType) : "topic");
  // Per-type subject so switching pills — or to Vocabulary and back — never
  // clobbers what was typed for Topic vs Situation.
  const [subjectByType, setSubjectByType] = useState(() => ({
    topic: initialType === "topic" ? initialSuggestion || "" : "",
    situation: initialType === "situation" ? initialSuggestion || "" : "",
  }));
  const [autoDisabled, setAutoDisabled] = useState(false);

  // null until the saved choice is loaded; the choice is not shown before then.
  // "" once loaded when the learner has not chosen yet.
  const [savedCharacter, setSavedCharacter] = useState(null);
  const [character, setCharacter] = useState(null);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (!a0) return;
    api
      .getUserPreferences()
      .then((preferences) => {
        const value = isCharacter(preferences.audio_lesson_character) ? preferences.audio_lesson_character : "";
        setSavedCharacter(value);
        setCharacter(value);
      })
      .catch(() => {});
  }, [api, a0]);

  // Vocabulary needs enough study words; disable the pill when there aren't.
  useEffect(() => {
    if (a0) return;
    api.checkDailyLessonFeasibility(
      (data) => {
        setAutoDisabled(!data.feasible);
        if (!data.feasible) setPillType((t) => (t === "auto" ? "topic" : t));
      },
      () => setAutoDisabled(false),
    );
  }, [api, a0]);

  const needsSubject = pillType === "topic" || pillType === "situation";
  const currentSubject = needsSubject ? subjectByType[pillType] : "";
  const setCurrentSubject = (val) => setSubjectByType((prev) => ({ ...prev, [pillType]: val }));
  const canSubmit = !needsSubject || currentSubject.trim().length > 0;

  const submit = (regenerate) => {
    if (!canSubmit) return;
    // Store the subject exactly as typed; Vocabulary carries no subject.
    onSubmit(pillToBackend(pillType), needsSubject ? currentSubject : "", regenerate);
  };

  // Did the user actually pick something different from their current setup?
  // Save stays disabled until they do.
  const initialSubject = initialType === "topic" || initialType === "situation" ? (initialSuggestion || "").trim() : "";
  const changed =
    pillToBackend(pillType) !== (initialType || null) || (needsSubject ? currentSubject.trim() : "") !== initialSubject;
  const characterChanged = a0 && character !== savedCharacter;
  const preferencesChanged = characterChanged;
  const hasChanges = (canSubmit && changed) || preferencesChanged;
  // At A0 nothing saves until the learner says who they speak as.
  const characterMissing = a0 && savedCharacter !== null && !character;
  const canSave = hasChanges && !characterMissing;

  // First-ever setup generates today's lesson now; reconfiguring an existing
  // subscription only saves — the change applies from the next scheduled lesson
  // (we never regenerate the same day).
  const handleSaveClick = () => {
    if (!canSave) return;
    const saveSituation = () => {
      if (canSubmit && changed) submit(!alreadySubscribed);
      else onDismiss();
    };
    if (!preferencesChanged) return saveSituation();
    // The preferences first: a lesson generated right after must already use them.
    setSaveError(false);
    const preferences = {};
    if (characterChanged) preferences.audio_lesson_character = character;
    api.saveUserPreferences(
      preferences,
      () => {
        // Others read these from the context: Settings > Audio lessons.
        setUserPreferences?.((current) => (current ? { ...current, ...preferences } : current));
        saveSituation();
      },
      () => setSaveError(true),
    );
  };

  const buttonStyle = { width: "100%", padding: "12px", fontSize: "1rem", fontWeight: 600 };

  // Unchanged → neutral "Close"; changed → orange "Save settings". Reserving the
  // brand orange for the action that actually persists makes "there's something
  // to save" legible at a glance.
  // With changes but no character chosen yet, "Save settings" shows but stays
  // disabled, so what was picked is not lost to a "Close"; the hint by the
  // character pills says why.
  const primaryButton = canSave ? (
    <BannerButton onClick={handleSaveClick} style={buttonStyle}>
      Save settings
    </BannerButton>
  ) : hasChanges ? (
    <BannerButton disabled style={{ ...buttonStyle, opacity: 0.5, cursor: "default" }}>
      Save settings
    </BannerButton>
  ) : (
    <BannerButton
      onClick={onDismiss}
      style={{
        ...buttonStyle,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-light)",
      }}
    >
      Close
    </BannerButton>
  );

  return (
    <Dialog
      onDismiss={onDismiss}
      aria-label="Daily lesson settings"
      style={{
        background: "var(--card-bg)",
        color: "var(--text-primary)",
        borderRadius: "16px",
        width: "min(86vw, 330px)",
        padding: "1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Section heading, not a dialog title: it names what the pills below
          control. Future settings (frequency, delivery time…) become their own
          labeled sections stacked below — or tabs — without rewording this. */}
      <h2 style={{ margin: "0 0 16px", fontSize: "1.25rem", color: zeeguuOrange }}>
        {a0 ? "Daily situation" : "Daily lesson type"}
      </h2>

      {a0 ? (
        <A0SituationPicker
          api={api}
          language={userDetails?.learned_language}
          subject={currentSubject}
          setSubject={setCurrentSubject}
        />
      ) : (
        <SuggestionSelector
          suggestionType={pillType}
          setSuggestionType={setPillType}
          suggestion={currentSubject}
          setSuggestion={setCurrentSubject}
          autoDisabled={autoDisabled}
          types={types}
        />
      )}

      {a0 && savedCharacter === "" && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span id="character-label" style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            In the dialogues you speak as
          </span>
          {!character && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center" }}>
              Choose one: in many languages the words you say depend on it.
            </span>
          )}
          <PillRow role="radiogroup" aria-labelledby="character-label">
            {CHARACTERS.map(({ value, label }) => (
              <SelectablePill
                key={value}
                type="button"
                $selected={character === value}
                role="radio"
                aria-checked={character === value}
                onClick={() => setCharacter(value)}
              >
                {label}
              </SelectablePill>
            ))}
          </PillRow>
        </div>
      )}

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {primaryButton}
        {saveError && (
          <p
            role="alert"
            style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center" }}
          >
            Could not save. Please try again.
          </p>
        )}
        {canSave && alreadySubscribed && (
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center" }}>
            Applies from your next lesson.
          </p>
        )}
        {/* How lessons are said is not about the next lesson: it has its own
            page. Linked here, where the learner looks for lesson settings. */}
        <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center" }}>
          Time to answer, repetition:{" "}
          <Link to="/account_settings/audio_lessons" onClick={onDismiss} style={{ color: "var(--text-secondary)" }}>
            Audio lesson settings ›
          </Link>
        </p>
        {onTurnOff && (
          <SubtleTextButton onClick={onTurnOff} style={{ marginTop: "8px" }}>
            Turn off daily lessons
          </SubtleTextButton>
        )}
      </div>
    </Dialog>
  );
}
