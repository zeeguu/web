import React from "react";
import * as s from "./AdjustLevelBar.sc";
import { isInBetweenLevel, rewriteTargets } from "./rewriteTargets";

/**
 * "Rewrite to make easier" bar for the teacher text editor.
 *
 * Presentational: it renders one button per reachable level (every level below
 * the original, the in-between level just below it, plus the original itself) and reports clicks via onPick. The
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
  const easierTargets = rewriteTargets(originalLevel);

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
      <s.LevelButton
        key={level}
        $primary={isActive}
        $secondary={!isActive}
        $disabled={barDisabled}
        disabled={barDisabled}
        $dimmed={dimmed}
        $barDisabled={barDisabled}
        onClick={() => onPick(level)}
        title={
          isInBetweenLevel(level)
            ? `Between ${level.replace("/", " and ")}: a lighter rewrite than ${level.split("/")[0]}`
            : undefined
        }
      >
        {level}
        {isBusy && <s.BlinkingGreenDot>•</s.BlinkingGreenDot>}
        {isCached && <s.GreenDot>•</s.GreenDot>}
      </s.LevelButton>
    );
  };

  return (
    <s.Bar>
      <span className="label">Rewrite to make easier:</span>
      {easierTargets.map((level) => renderButton(level, false))}
      <span className="sep">original:</span>
      {renderButton(originalLevel, true)}
      {languageMissing && <span className="hint">Choose a language first</span>}
    </s.Bar>
  );
}
