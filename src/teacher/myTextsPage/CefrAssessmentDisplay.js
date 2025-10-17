import React, { useState, useEffect, useContext, useCallback } from "react";
import { APIContext } from "../../contexts/APIContext";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import { debounce } from "lodash";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function CefrAssessmentDisplay({
  articleID,
  articleContent,
  articleTitle,
  onOverrideChange,
  initialAssessments // Optional: pre-loaded assessment data from article
}) {
  const api = useContext(APIContext);

  // Debug logging
  console.log("CefrAssessmentDisplay initialized with:", initialAssessments);

  const [llmAssessment, setLlmAssessment] = useState(initialAssessments?.llm?.level || null);
  const [mlAssessment, setMlAssessment] = useState(initialAssessments?.ml?.level || null);
  const [effectiveLevel, setEffectiveLevel] = useState(null);
  const [teacherOverride, setTeacherOverride] = useState(initialAssessments?.teacher?.level || null);
  const [isComputingLLM, setIsComputingLLM] = useState(false);
  const [isComputingML, setIsComputingML] = useState(false);
  const [contentChanged, setContentChanged] = useState(false);
  const [llmLastUpdated, setLlmLastUpdated] = useState(null);
  const [mlLastUpdated, setMlLastUpdated] = useState(null);

  // Get maximum (harder) CEFR level
  const getMaxLevel = (level1, level2) => {
    if (!level1) return level2;
    if (!level2) return level1;
    const idx1 = CEFR_LEVELS.indexOf(level1);
    const idx2 = CEFR_LEVELS.indexOf(level2);
    const result = idx1 > idx2 ? level1 : level2;
    console.log(`getMaxLevel(${level1}, ${level2}): idx1=${idx1}, idx2=${idx2}, result=${result}`);
    return result;
  };

  // Load initial assessments when initialAssessments prop changes
  useEffect(() => {
    if (initialAssessments) {
      // Use pre-loaded data from parent component
      console.log("Loading assessments from initialAssessments:", initialAssessments);

      const llm = initialAssessments.llm?.level || null;
      const ml = initialAssessments.ml?.level || null;
      const teacher = initialAssessments.teacher?.level || null;

      setLlmAssessment(llm);
      setMlAssessment(ml);
      setTeacherOverride(teacher);

      // Set initial timestamps if assessments exist
      if (llm) setLlmLastUpdated(new Date());
      if (ml) setMlLastUpdated(new Date());

      const newEffective = getMaxLevel(llm, ml);
      console.log("Setting effective level:", { llm, ml, teacher, newEffective, final: teacher || newEffective });
      setEffectiveLevel(teacher || newEffective);
    }
  }, [initialAssessments]);

  // Debounced ML assessment recomputation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recomputeML = useCallback(
    debounce((content) => {
      if (!articleID || articleID === "new" || !content) return;

      setIsComputingML(true);
      api.assessML(
        articleID,
        content,
        (data) => {
          setMlAssessment(data.ml_assessment);
          setMlLastUpdated(new Date());
          // Recalculate effective level
          const newEffective = getMaxLevel(llmAssessment, data.ml_assessment);
          setEffectiveLevel(teacherOverride || newEffective);
          setIsComputingML(false);
        },
        (err) => {
          console.error("Failed to recompute ML assessment:", err);
          setMlAssessment(null);
          // Even if ML fails, compute effective level from LLM only
          const newEffective = getMaxLevel(llmAssessment, null);
          setEffectiveLevel(teacherOverride || newEffective);
          setIsComputingML(false);
        }
      );
    }, 1500), // 1.5 second debounce
    [articleID, api, llmAssessment, teacherOverride]
  );

  // Detect content changes and trigger ML recomputation
  // Track initial content to detect actual changes
  const [initialContent, setInitialContent] = useState(null);

  useEffect(() => {
    if (articleContent && initialContent === null) {
      // First load - set initial content without marking as changed
      setInitialContent(articleContent);
      // Only compute ML if we don't already have it
      if (!mlAssessment) {
        console.log("Triggering initial ML assessment");
        recomputeML(stripHtml(articleContent));
      }
    } else if (articleContent && articleContent !== initialContent) {
      // Content actually changed
      setContentChanged(true);
      recomputeML(stripHtml(articleContent));
    }
  }, [articleContent, initialContent, mlAssessment, recomputeML]);

  // Recompute LLM assessment (button click)
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
        // Recalculate effective level
        const newEffective = getMaxLevel(data.llm_assessment, mlAssessment);
        setEffectiveLevel(teacherOverride || newEffective);
        setIsComputingLLM(false);
        setContentChanged(false);
      },
      (err) => {
        console.error("Failed to recompute LLM assessment:", err);
        setLlmAssessment(null);
        // Even if LLM fails, compute effective level from ML only
        const newEffective = getMaxLevel(null, mlAssessment);
        setEffectiveLevel(teacherOverride || newEffective);
        setIsComputingLLM(false);
      }
    );
  };

  // Handle teacher override selection
  const handleOverrideChange = (e) => {
    const value = e.target.value === "" ? null : e.target.value;
    setTeacherOverride(value);
    if (value) {
      setEffectiveLevel(value);
      // Save teacher override to database
      api.resolveCEFR(articleID, value, (response) => {
        console.log("Teacher override saved:", response);
      }, (error) => {
        console.error("Failed to save teacher override:", error);
      });
    } else {
      // No override, use max of LLM and ML
      const newEffective = getMaxLevel(llmAssessment, mlAssessment);
      setEffectiveLevel(newEffective);
      // Note: We can't clear teacher override by passing null, so we skip the API call
      // The teacher would need to select a different level to change it
    }
    // Notify parent component
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Don't show for new articles
  if (!articleID || articleID === "new") {
    return null;
  }

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
      <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1em" }}>CEFR Difficulty Assessment</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* LLM Assessment Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: "bold", minWidth: "120px" }}>LLM:</span>
          {contentChanged && !llmAssessment ? (
            <span style={{ color: "#888", fontStyle: "italic" }}>Click "Recompute LLM" after editing</span>
          ) : (
            <>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.1em",
                  fontWeight: "bold",
                  color: llmAssessment ? "#2563eb" : "#888",
                }}
              >
                {llmAssessment || "—"}
              </span>
              {llmLastUpdated && (
                <span style={{ fontSize: "0.85em", color: "#888", fontStyle: "italic" }}>
                  (last updated {formatTimestamp(llmLastUpdated)})
                </span>
              )}
            </>
          )}
          <StyledButton
            secondary
            onClick={recomputeLLM}
            disabled={isComputingLLM}
            style={{ marginLeft: "auto", fontSize: "0.9em", padding: "0.4rem 0.8rem" }}
          >
            {isComputingLLM ? "Computing..." : "Recompute LLM"}
          </StyledButton>
        </div>

        {/* ML Assessment Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: "bold", minWidth: "120px" }}>ML-1:</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "1.1em",
              fontWeight: "bold",
              color: mlAssessment ? "#16a34a" : "#888",
            }}
          >
            {mlAssessment || "—"}
          </span>
          {isComputingML && (
            <span style={{ color: "#888", fontSize: "0.9em", fontStyle: "italic" }}>updating...</span>
          )}
          {!isComputingML && mlLastUpdated && (
            <span style={{ fontSize: "0.85em", color: "#888", fontStyle: "italic" }}>
              (last updated {formatTimestamp(mlLastUpdated)})
            </span>
          )}
        </div>

        {/* Teacher Override Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: "bold", minWidth: "120px" }}>Teacher Override:</span>
          <select
            value={teacherOverride || ""}
            onChange={handleOverrideChange}
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "1em",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "monospace",
              fontWeight: teacherOverride ? "bold" : "normal",
              color: teacherOverride ? "#dc2626" : "#333",
            }}
          >
            <option value="">None (use automatic)</option>
            {CEFR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Display Level Row - what students will see */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingTop: "0.75rem",
            marginTop: "0.5rem",
            borderTop: "2px solid #b8d4f1",
          }}
        >
          <span style={{ fontWeight: "bold", minWidth: "120px" }}>Display Level:</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "1.3em",
              fontWeight: "bold",
              color: "#dc2626",
            }}
          >
            {effectiveLevel || "—"}
          </span>
          <span style={{ fontSize: "0.85em", color: "#666", fontStyle: "italic" }}>
            {teacherOverride
              ? "(using your override)"
              : "(conservative: max of LLM and ML-1)"
            }
          </span>
        </div>
      </div>
    </div>
  );
}
