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
      <h2 style={{ margin: "0 0 4px", fontSize: "1.25rem", color: zeeguuOrange }}>
        {todaysLessonExists ? "Change your daily lesson" : "Set up your daily lessons"}
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        {todaysLessonExists
          ? "A new lesson, ready for you daily. Pick what you'd like instead — we'll make today's right away."
          : "A new lesson, ready for you daily. Pick what kind — we'll make your first one right now."}
      </p>

      <SuggestionSelector
        suggestionType={pillType}
        setSuggestionType={setPillType}
        suggestion={suggestion}
        setSuggestion={setSuggestion}
        autoDisabled={autoDisabled}
      />

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <BannerButton
          onClick={() => submit(true)}
          disabled={!canSubmit}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            opacity: canSubmit ? 1 : 0.5,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {todaysLessonExists ? "Generate today's lesson" : "Start today's lesson"}
        </BannerButton>

        {todaysLessonExists && (
          <SubtleTextButton onClick={() => submit(false)} disabled={!canSubmit}>
            Save for tomorrow instead
          </SubtleTextButton>
        )}
      </div>
    </Dialog>
  );
}
