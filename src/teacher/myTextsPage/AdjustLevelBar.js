import React from "react";
import styled, { keyframes } from "styled-components";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Levels strictly easier than the given one. A compound level like "B1/B2" is
// normalised to its harder end so we never offer a target that isn't simpler.
function easierLevelsThan(level) {
  if (!level) return [];
  const hardestIdx = String(level)
    .split("/")
    .map((tok) => CEFR_LEVELS.indexOf(tok.trim()))
    .reduce((max, idx) => Math.max(max, idx), -1);
  if (hardestIdx <= 0) return []; // unknown, or already A1 — nothing easier
  return CEFR_LEVELS.slice(0, hardestIdx);
}

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`;

// Green dot next to a level. Solid = already generated (instant switch);
// blinking = generating right now.
const Dot = styled.span`
  color: #16a34a;
  margin-left: 0.25rem;
`;

const BlinkingDot = styled(Dot)`
  animation: ${blink} 1s ease-in-out infinite;
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
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

  .sep {
    color: #b45309;
    font-size: 0.9em;
    margin-left: 0.25rem;
  }

  .hint {
    font-size: 0.85em;
    color: #666;
    font-style: italic;
  }
`;

/**
 * "Rewrite to make easier" bar for the teacher text editor.
 *
 * Presentational: it renders one button per reachable level (every level below
 * the original, plus the original itself) and reports clicks via onPick. The
 * parent (EditText) owns the original text, the per-level cache and the
 * generating state, and always regenerates from the original — so any level is
 * reachable at any time, and levels already generated switch instantly.
 *
 * A solid green dot marks a level that's already been generated (instant
 * switch); a blinking green dot marks the level currently generating; the active
 * level is filled. While a rewrite runs the other buttons are visibly dimmed.
 */
export default function AdjustLevelBar({
  originalLevel, // assessed level of the original text — defines the button range
  activeLevel, // level currently loaded in the editor (originalLevel when untouched)
  cachedLevels = [], // levels already generated this session
  busyLevel, // level currently generating, or null
  language, // language code, or "default"/"" when not chosen yet
  contentMissing,
  disabled,
  onPick, // (level) => void
}) {
  const languageMissing = !language || language === "default";
  const easierTargets = easierLevelsThan(originalLevel);

  // Nothing simpler to offer (unknown level, or the original is already A1).
  if (easierTargets.length === 0) return null;

  const barDisabled = disabled || languageMissing || contentMissing || busyLevel != null;

  const renderButton = (level, isOriginal) => {
    const isActive = level === activeLevel;
    const isBusy = busyLevel === level;
    const isCached = !isBusy && !isActive && (isOriginal || cachedLevels.includes(level));
    // While one level generates, the others are unclickable — dim them so that
    // reads clearly. The generating button stays full-strength (it's working).
    const dimmed = barDisabled && !isBusy;
    return (
      <StyledButton
        key={level}
        $primary={isActive}
        $secondary={!isActive}
        onClick={() => onPick(level)}
        $disabled={barDisabled}
        disabled={barDisabled}
        style={{
          minWidth: "3.5rem",
          fontFamily: "monospace",
          fontWeight: "bold",
          opacity: dimmed ? 0.4 : 1,
          cursor: barDisabled ? "not-allowed" : "pointer",
        }}
      >
        {level}
        {isBusy && <BlinkingDot>•</BlinkingDot>}
        {isCached && <Dot>•</Dot>}
      </StyledButton>
    );
  };

  return (
    <Bar>
      <span className="label">Rewrite to make easier:</span>
      {easierTargets.map((level) => renderButton(level, false))}
      <span className="sep">original:</span>
      {renderButton(originalLevel, true)}
      {languageMissing && <span className="hint">Choose a language first</span>}
    </Bar>
  );
}
