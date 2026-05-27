import React, { useEffect, useState } from "react";
import { Dialog } from "../components/DialogWrapper";
import SuggestionSelector, { pillToBackend, backendToPill } from "./SuggestionSelector";
import { SubtleTextButton } from "./LessonView.sc";
import { BannerButton } from "./SharedLessonView.sc";
import { zeeguuOrange } from "../components/colors";

/**
 * Setup / "Change daily topic" dialog. Hosts the lesson-type selector and
 * persists the per-language daily-lesson preference. The dialog never
 * generates audio itself — it hands the chosen (type, suggestion) back to the
 * parent via onSubmit, which owns the generation state machine and progress UI.
 *
 * onSubmit(backendType, verbatimSuggestion, regenerate):
 *   regenerate=true  → apply now (parent regenerates today's lesson)
 *   regenerate=false → save for tomorrow only (keeps today's existing lesson)
 */
export default function DailyLessonSettingsDialog({
  api,
  initialType,
  initialSuggestion,
  todaysLessonExists,
  onSubmit,
  onDismiss,
}) {
  const [pillType, setPillType] = useState(initialType ? backendToPill(initialType) : "topic");
  // Per-type subject so switching pills — or to Vocabulary and back — never
  // clobbers what was typed for Topic vs Situation.
  const [subjectByType, setSubjectByType] = useState(() => ({
    topic: initialType === "topic" ? initialSuggestion || "" : "",
    situation: initialType === "situation" ? initialSuggestion || "" : "",
  }));
  const [autoDisabled, setAutoDisabled] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);

  // Changing the type/subject after the regenerate-or-tomorrow prompt has shown
  // would leave it describing a stale choice (and could strand the confirm
  // buttons if the new subject is empty) — so drop back to "Save settings".
  useEffect(() => {
    setConfirmRegen(false);
  }, [pillType, subjectByType]);

  // Vocabulary needs enough study words; disable the pill when there aren't.
  useEffect(() => {
    api.checkDailyLessonFeasibility(
      (data) => {
        setAutoDisabled(!data.feasible);
        if (!data.feasible) setPillType((t) => (t === "auto" ? "topic" : t));
      },
      () => setAutoDisabled(false),
    );
  }, [api]);

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
  const initialSubject =
    initialType === "topic" || initialType === "situation" ? (initialSuggestion || "").trim() : "";
  const changed =
    pillToBackend(pillType) !== (initialType || null) ||
    (needsSubject ? currentSubject.trim() : "") !== initialSubject;
  const canSave = canSubmit && changed;

  // Saving a changed setting while today's lesson already exists asks whether to
  // apply it now or from tomorrow. Otherwise just save — generating right away
  // when there's no lesson for today yet (first run / cron miss).
  const handleSaveClick = () => {
    if (!canSave) return;
    if (todaysLessonExists) setConfirmRegen(true);
    else submit(true);
  };

  const buttonStyle = { width: "100%", padding: "12px", fontSize: "1rem", fontWeight: 600 };

  const saveButton = (
    <BannerButton
      onClick={handleSaveClick}
      disabled={!canSave}
      style={{ ...buttonStyle, opacity: canSave ? 1 : 0.5, cursor: canSave ? "pointer" : "not-allowed" }}
    >
      Save settings
    </BannerButton>
  );

  const confirmStep = (
    <>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", textAlign: "center" }}>
        Apply this to today's lesson, or start from tomorrow?
      </p>
      <BannerButton onClick={() => submit(true)} style={buttonStyle}>
        Regenerate today's lesson
      </BannerButton>
      <SubtleTextButton onClick={() => submit(false)}>Start from tomorrow</SubtleTextButton>
    </>
  );

  return (
    <Dialog
      onDismiss={onDismiss}
      aria-label="Configure daily lessons"
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
      <h2 style={{ margin: "0 0 16px", fontSize: "1.25rem", color: zeeguuOrange }}>
        Configure daily lessons
      </h2>

      <SuggestionSelector
        suggestionType={pillType}
        setSuggestionType={setPillType}
        suggestion={currentSubject}
        setSuggestion={setCurrentSubject}
        autoDisabled={autoDisabled}
      />

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {confirmRegen ? confirmStep : saveButton}
      </div>
    </Dialog>
  );
}
