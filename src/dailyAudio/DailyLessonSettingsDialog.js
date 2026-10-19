import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "../components/DialogWrapper";
import SuggestionSelector, { pillToBackend, backendToPill } from "./SuggestionSelector";
import { PillRow, SelectablePill } from "./SuggestionSelector.sc";
import { BannerButton } from "./SharedLessonView.sc";
import { SubtleTextButton } from "./LessonView.sc";
import { zeeguuOrange } from "../components/colors";
import { UserContext } from "../contexts/UserContext";
import { isA0Learner } from "../utils/misc/userCefrLevel";

// At A0 the learner drills their own role in the dialogue. Who they speak as is
// theirs to say, never guessed from their name; "either" lets the lessons take
// turns. Stored as the audio_lesson_character user preference.
const CHARACTERS = [
  { value: "man", label: "A man" },
  { value: "woman", label: "A woman" },
  { value: "either", label: "Either" },
];

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
  const { userDetails } = useContext(UserContext);
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
  const [savedCharacter, setSavedCharacter] = useState(null);
  const [character, setCharacter] = useState(null);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (!a0) return;
    api
      .getUserPreferences()
      .then((preferences) => {
        const value = preferences.audio_lesson_character || "either";
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
  const canSave = (canSubmit && changed) || characterChanged;

  // First-ever setup generates today's lesson now; reconfiguring an existing
  // subscription only saves — the change applies from the next scheduled lesson
  // (we never regenerate the same day).
  const handleSaveClick = () => {
    if (!canSave) return;
    const saveSituation = () => {
      if (canSubmit && changed) submit(!alreadySubscribed);
      else onDismiss();
    };
    if (!characterChanged) return saveSituation();
    // The character first: a lesson generated right after must already use it.
    setSaveError(false);
    api.saveUserPreferences({ audio_lesson_character: character }, saveSituation, () => setSaveError(true));
  };

  const buttonStyle = { width: "100%", padding: "12px", fontSize: "1rem", fontWeight: 600 };

  // Unchanged → neutral "Close"; changed → orange "Save settings". Reserving the
  // brand orange for the action that actually persists makes "there's something
  // to save" legible at a glance.
  const primaryButton = canSave ? (
    <BannerButton onClick={handleSaveClick} style={buttonStyle}>
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

      <SuggestionSelector
        suggestionType={pillType}
        setSuggestionType={setPillType}
        suggestion={currentSubject}
        setSuggestion={setCurrentSubject}
        autoDisabled={autoDisabled}
        types={types}
        placeholder={a0 ? "A situation to get through — e.g. ordering a coffee, buying a train ticket" : undefined}
      />

      {a0 && character && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span id="character-label" style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            In the dialogues you speak as
          </span>
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
        {onTurnOff && (
          <SubtleTextButton onClick={onTurnOff} style={{ marginTop: "8px" }}>
            Turn off daily lessons
          </SubtleTextButton>
        )}
      </div>
    </Dialog>
  );
}
