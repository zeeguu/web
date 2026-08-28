import React, { useState, useEffect, useContext, useCallback } from "react";
import { APIContext } from "../../contexts/APIContext";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import debounce from "lodash-es/debounce";
import { effectiveCefrLevel } from "../../utils/misc/articleDifficulty";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function CefrAssessmentDisplay({
  articleID,
  articleContent,
  articleTitle,
  languageCode,
  onOverrideChange,
  onEffectiveLevelChange, // Optional: notified whenever the difficulty (effective level) changes
  initialAssessments, // Optional: pre-loaded assessment data from article
  adaptedLevel // Optional: level the text has been rewritten to via the "Rewrite" bar
}) {
  const api = useContext(APIContext);

  const [llmAssessment, setLlmAssessment] = useState(initialAssessments?.llm?.level || null);
  const [mlAssessment, setMlAssessment] = useState(initialAssessments?.ml?.level || null);
  const [effectiveLevel, setEffectiveLevel] = useState(null);
  const [teacherOverride, setTeacherOverride] = useState(initialAssessments?.teacher?.level || null);
  const [isComputingLLM, setIsComputingLLM] = useState(false);
  const [isComputingML, setIsComputingML] = useState(false);
  const [contentChanged, setContentChanged] = useState(false);
  const [llmLastUpdated, setLlmLastUpdated] = useState(null);
  const [mlLastUpdated, setMlLastUpdated] = useState(null);
  const [showHow, setShowHow] = useState(false); // "(how?)" disclosure: reveals the two estimators
  const [showManualPicker, setShowManualPicker] = useState(false); // "set manually" reveals the level picker

  // The difficulty shown to students. The rule lives in effectiveCefrLevel so
  // that the teacher's texts list derives the same number from the same inputs;
  // this component holds the estimators in state (they re-run as the text is
  // edited), so it re-derives rather than reading article.cefr_assessments.
  // Deriving it here (rather than setting it imperatively in each async handler)
  // keeps a rewritten/overridden level from being clobbered when ML re-runs.
  useEffect(() => {
    setEffectiveLevel(
      effectiveCefrLevel(
        {
          llm: { level: llmAssessment },
          ml: { level: mlAssessment },
          teacher: { level: teacherOverride },
        },
        adaptedLevel,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaptedLevel, teacherOverride, llmAssessment, mlAssessment]);

  // Notify parent whenever the difficulty changes, so sibling UI (e.g. the
  // "Rewrite" bar) knows the original assessed level.
  useEffect(() => {
    if (onEffectiveLevelChange) {
      onEffectiveLevelChange(effectiveLevel);
    }
  }, [effectiveLevel, onEffectiveLevelChange]);

  // Load initial assessments when initialAssessments prop changes
  useEffect(() => {
    if (initialAssessments) {
      const llm = initialAssessments.llm?.level || null;
      const ml = initialAssessments.ml?.level || null;
      const teacher = initialAssessments.teacher?.level || null;

      setLlmAssessment(llm);
      setMlAssessment(ml);
      setTeacherOverride(teacher);

      // Set initial timestamps if assessments exist
      if (llm) setLlmLastUpdated(new Date());
      if (ml) setMlLastUpdated(new Date());
    }
  }, [initialAssessments]);

  // Debounced ML assessment recomputation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recomputeML = useCallback(
    debounce((content, languageCode) => {
      if (!content || !languageCode) return;

      setIsComputingML(true);

      // Use estimate endpoint for both new and existing articles
      api.estimateArticleCEFR(
        articleTitle || "Untitled",
        content,
        languageCode,
        (data) => {
          setMlAssessment(data.cefr_level);
          setMlLastUpdated(new Date());
          setIsComputingML(false);
        },
        (err) => {
          console.error("Failed to recompute ML assessment:", err);
          setMlAssessment(null);
          setIsComputingML(false);
        }
      );
    }, 1500), // 1.5 second debounce
    [api, articleTitle]
  );

  // Detect content changes and trigger ML recomputation
  // Track initial content to detect actual changes
  const [initialContent, setInitialContent] = useState(null);
  const [lastLanguageCode, setLastLanguageCode] = useState(null);

  // Reset when language changes
  useEffect(() => {
    if (languageCode && languageCode !== "default" && languageCode !== lastLanguageCode) {
      setLastLanguageCode(languageCode);
      setMlAssessment(null);
      setInitialContent(null);
      setMlLastUpdated(null);
      // Trigger ML assessment with new language if we have content
      if (articleContent) {
        recomputeML(stripHtml(articleContent), languageCode);
        setInitialContent(articleContent);
      }
    }
  }, [languageCode, lastLanguageCode, articleContent, recomputeML]);

  useEffect(() => {
    if (articleContent && languageCode && languageCode !== "default" && initialContent === null) {
      // First load - set initial content without marking as changed
      setInitialContent(articleContent);
      // Only compute ML if we don't already have it
      if (!mlAssessment) {
        recomputeML(stripHtml(articleContent), languageCode);
      }
    } else if (articleContent && languageCode && languageCode !== "default" && articleContent !== initialContent) {
      // Content actually changed
      setContentChanged(true);
      recomputeML(stripHtml(articleContent), languageCode);
    }
  }, [articleContent, languageCode, initialContent, mlAssessment, recomputeML]);

  // Recompute LLM assessment (button click, inside the "how?" details)
  const recomputeLLM = () => {
    if (!articleID || articleID === "new") return;

    setIsComputingLLM(true);
    api.assessLLM(
      articleID,
      articleTitle,
      stripHtml(articleContent),
      (data) => {
        setLlmAssessment(data.llm_assessment);
        setLlmLastUpdated(new Date());
        setIsComputingLLM(false);
        setContentChanged(false);
      },
      (err) => {
        console.error("Failed to recompute LLM assessment:", err);
        setLlmAssessment(null);
        setIsComputingLLM(false);
      }
    );
  };

  // Set a manual level (teacher disagrees with the automatic estimate). This
  // relabels the difficulty; it does not change the text.
  const applyManualLevel = (value) => {
    setTeacherOverride(value);
    setShowManualPicker(false);
    if (value && articleID && articleID !== "new") {
      api.resolveCEFR(
        articleID,
        value,
        (response) => console.log("Teacher override saved:", response),
        (error) => console.error("Failed to save teacher override:", error),
      );
    }
    if (onOverrideChange) {
      onOverrideChange(value);
    }
  };

  // Strip HTML tags to get plain text
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Format timestamp for display
  const formatTimestamp = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isNewArticle = !articleID || articleID === "new";

  // Which state are we in? A rewrite supersedes a manual override supersedes the
  // automatic estimate.
  const difficultyLabel = adaptedLevel
    ? "Difficulty"
    : teacherOverride
    ? "Difficulty (set by you)"
    : "Automatically assessed difficulty";
  const difficultyColor = adaptedLevel ? "#7c3aed" : teacherOverride ? "#dc2626" : "#2563eb";
  const difficultySuffix = adaptedLevel ? "(rewritten)" : "";
  const isAutomatic = !adaptedLevel && !teacherOverride;

  return (
    <div
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#f0f7ff",
        border: "1px solid #b8d4f1",
        borderRadius: "5px",
        padding: "1rem",
      }}
    >
      {/* Difficulty row — the single number the teacher cares about */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
        <span style={{ fontWeight: "bold" }}>{difficultyLabel}:</span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "1.4em",
            fontWeight: "bold",
            color: effectiveLevel ? difficultyColor : "#888",
          }}
        >
          {effectiveLevel || "—"}
        </span>
        {difficultySuffix && (
          <span style={{ fontSize: "0.85em", color: "#666", fontStyle: "italic" }}>{difficultySuffix}</span>
        )}
        {isAutomatic && !isNewArticle && (
          <button
            type="button"
            onClick={() => setShowHow((v) => !v)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#2563eb",
              cursor: "pointer",
              fontSize: "0.9em",
              textDecoration: "underline",
            }}
          >
            {showHow ? "(hide)" : "(how?)"}
          </button>
        )}

        {/* Right-hand control depends on the state */}
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isAutomatic && !showManualPicker && (
            <StyledButton
              $secondary
              onClick={() => setShowManualPicker(true)}
              style={{ fontSize: "0.9em", padding: "0.4rem 0.8rem" }}
            >
              Set manually
            </StyledButton>
          )}
          {isAutomatic && showManualPicker && (
            <select
              autoFocus
              value=""
              onChange={(e) => applyManualLevel(e.target.value || null)}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "1em",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontFamily: "monospace",
              }}
            >
              <option value="">Choose a level…</option>
              {CEFR_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          )}
          {teacherOverride && !adaptedLevel && (
            <StyledButton
              $secondary
              onClick={() => applyManualLevel(null)}
              style={{ fontSize: "0.9em", padding: "0.4rem 0.8rem" }}
            >
              Use automatic
            </StyledButton>
          )}
        </span>
      </div>

      {/* "how?" disclosure — the only place the two estimators appear */}
      {showHow && isAutomatic && !isNewArticle && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid #b8d4f1",
            fontSize: "0.9em",
            color: "#444",
          }}
        >
          <div style={{ marginBottom: "0.5rem", fontStyle: "italic", color: "#666" }}>
            Two automatic estimates of this text's level; the harder of the two is used, so students aren't
            under-pitched.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <span style={{ minWidth: "170px" }}>Language model (LLM):</span>
            <span style={{ fontFamily: "monospace", fontWeight: "bold", color: llmAssessment ? "#2563eb" : "#888" }}>
              {llmAssessment || "—"}
            </span>
            {llmLastUpdated && (
              <span style={{ color: "#888", fontStyle: "italic" }}>updated {formatTimestamp(llmLastUpdated)}</span>
            )}
            <StyledButton
              $secondary
              onClick={recomputeLLM}
              $disabled={isComputingLLM}
              disabled={isComputingLLM}
              style={{ marginLeft: "auto", fontSize: "0.85em", padding: "0.3rem 0.7rem" }}
            >
              {isComputingLLM ? "Computing…" : "Recompute"}
            </StyledButton>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ minWidth: "170px" }}>Trained classifier (ML):</span>
            <span style={{ fontFamily: "monospace", fontWeight: "bold", color: mlAssessment ? "#16a34a" : "#888" }}>
              {mlAssessment || "—"}
            </span>
            {isComputingML && <span style={{ color: "#888", fontStyle: "italic" }}>updating…</span>}
            {!isComputingML && mlLastUpdated && mlAssessment && (
              <span style={{ color: "#888", fontStyle: "italic" }}>updated {formatTimestamp(mlLastUpdated)}</span>
            )}
            {!isComputingML && !mlAssessment && languageCode && languageCode !== "default" && (
              <span style={{ color: "#888", fontStyle: "italic" }}>(not available for this language)</span>
            )}
          </div>
          {contentChanged && (
            <div style={{ marginTop: "0.5rem", color: "#b45309", fontStyle: "italic" }}>
              The text changed — recompute for an up-to-date LLM estimate.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
