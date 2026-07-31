import React, { useContext, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { APIContext } from "../../contexts/APIContext";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const FALLBACK_TARGETS = ["A1", "A2", "B1"];

// Levels strictly easier than the current one. A compound level like "B1/B2"
// is normalised to its harder end so we never offer a target that isn't simpler.
function easierLevelsThan(currentLevel) {
  if (!currentLevel) return FALLBACK_TARGETS;
  const hardestIdx = String(currentLevel)
    .split("/")
    .map((tok) => CEFR_LEVELS.indexOf(tok.trim()))
    .reduce((max, idx) => Math.max(max, idx), -1);
  if (hardestIdx <= 0) return []; // unknown, or already A1 — nothing easier
  return CEFR_LEVELS.slice(0, hardestIdx);
}

function stripHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background-color: #fff8ef;
  border: 1px solid #ffcf99;
  border-radius: 5px;

  .label {
    font-weight: bold;
    white-space: nowrap;
  }

  .hint {
    font-size: 0.85em;
    color: #666;
    font-style: italic;
  }
`;

/**
 * "Adjust to level" bar for the teacher text editor.
 *
 * A teacher's pasted text/URL is shown as-is; this lets them rewrite it to an
 * easier CEFR level on demand. The rewrite is non-destructive until saved:
 * onAdjusted replaces the editor content and marks the draft unsaved, so the
 * teacher reviews it and hits Save (or Cancel to restore the original).
 */
export default function AdjustLevelBar({
  currentLevel,
  title,
  content, // HTML from the editor
  language, // language code, or "default"/"" when not chosen yet
  disabled,
  onAdjusted,
}) {
  const api = useContext(APIContext);
  const [busyLevel, setBusyLevel] = useState(null);

  const targets = easierLevelsThan(currentLevel);
  const languageMissing = !language || language === "default";
  const contentMissing = !stripHtml(content).trim();

  // Nothing simpler to offer (e.g. the text is already A1): hide the bar.
  if (targets.length === 0) return null;

  const barDisabled = disabled || languageMissing || contentMissing || busyLevel !== null;

  const handleAdjust = (targetLevel) => {
    setBusyLevel(targetLevel);
    api.simplifyOwnText(
      title || "Untitled",
      stripHtml(content),
      language,
      targetLevel,
      (data) => {
        setBusyLevel(null);
        onAdjusted(data.title || title, data.content, targetLevel);
        toast.success(`Text adapted to ${targetLevel}. Review it and click Save to keep it.`);
      },
      (error) => {
        setBusyLevel(null);
        toast.error(typeof error === "string" ? error : "Could not adapt this text.");
      },
    );
  };

  return (
    <Bar>
      <span className="label">Adjust to level:</span>
      {targets.map((level) => (
        <StyledButton
          key={level}
          $primary
          onClick={() => handleAdjust(level)}
          $disabled={barDisabled}
          disabled={barDisabled}
          style={{ minWidth: "3.5rem", fontFamily: "monospace", fontWeight: "bold" }}
        >
          {busyLevel === level ? "…" : level}
        </StyledButton>
      ))}
      {languageMissing && <span className="hint">Choose a language first</span>}
      {!languageMissing && busyLevel && (
        <span className="hint">Adapting to {busyLevel}… this can take a moment</span>
      )}
    </Bar>
  );
}
