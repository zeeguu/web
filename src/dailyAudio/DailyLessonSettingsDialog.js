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
  const [suggestion, setSuggestion] = useState(initialSuggestion || "");
  const [autoDisabled, setAutoDisabled] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);

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
  const canSubmit = !needsSubject || suggestion.trim().length > 0;

  const submit = (regenerate) => {
    if (!canSubmit) return;
    // Store the subject exactly as typed; Vocabulary carries no subject.
    onSubmit(pillToBackend(pillType), needsSubject ? suggestion : "", regenerate);
  };

  // Did the user actually pick something different from their current setup?
  const changed =
    pillToBackend(pillType) !== initialType ||
    (needsSubject ? suggestion.trim() : "") !== (initialSuggestion || "").trim();

  // Saving a *changed* setting while today's lesson already exists asks whether
  // to apply it now or from tomorrow. Otherwise just save — generating right
  // away when there's no lesson for today yet (first run / cron miss).
  const handleSaveClick = () => {
    if (!canSubmit) return;
    if (todaysLessonExists && changed) setConfirmRegen(true);
    else submit(!todaysLessonExists);
  };

  const buttonStyle = { width: "100%", padding: "12px", fontSize: "1rem", fontWeight: 600 };

  const saveButton = (
    <BannerButton
      onClick={handleSaveClick}
      disabled={!canSubmit}
      style={{ ...buttonStyle, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}
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
      <h2 style={{ margin: "0 0 16px", fontSize: "1.25rem", color: zeeguuOrange }}>
        Daily lesson settings
      </h2>

      <SuggestionSelector
        suggestionType={pillType}
        setSuggestionType={setPillType}
        suggestion={suggestion}
        setSuggestion={setSuggestion}
        autoDisabled={autoDisabled}
      />

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {confirmRegen ? confirmStep : saveButton}
      </div>
    </Dialog>
  );
}
