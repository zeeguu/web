import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import styled from "styled-components";
import { streakFireOrange } from "../colors.js";
import { CEFR_LEVELS } from "../../assorted/cefrLevels.js";
import { isCountingDown, streakCountdownHint } from "../../utils/streakCountdown.js";

const fireIconSx = { color: streakFireOrange, fontSize: "0.9rem" };
const fireIconGraySx = { color: "var(--text-faint, #999)", fontSize: "0.9rem" };

const StreakBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.2em;
  margin-left: 0.5em;
  font-size: 0.85em;
  font-weight: 600;
  color: ${({ $practiced }) => ($practiced ? streakFireOrange : "var(--text-faint, #999)")};
`;

// The name with its streak badge, and under it, until today counts, how much
// study is left to keep the streak.
const LanguageNameColumn = styled.span`
  display: flex;
  flex-direction: column;
  /* Lets the column shrink below the hint's one-line width, so the hint wraps
     instead of pushing the row past the modal's edge. */
  min-width: 0;
  padding: 0.35rem 0;
`;

const LanguageNameLine = styled.span`
  display: flex;
  align-items: center;
`;

const StreakHint = styled.span`
  font-size: 0.75em;
  font-weight: 500;
  line-height: 1.3;
  white-space: normal;
  color: var(--text-muted);
`;

const CefrSection = styled.span`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 0.75em;
  border-left: 1px solid rgba(128, 128, 128, 0.3);
  height: 1.5em;
`;

const CefrSelect = styled.select`
  font-size: 0.9em;
  font-weight: 600;
  padding: 0.2em 0.3em;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.3em;
  }

  &:focus {
    outline: none;
  }
`;

export default function LanguageOptionLabel({
  languageName,
  streak,
  practiced,
  msToStreak,
  cefrLevelValue,
  onCefrLevelChange,
}) {
  const hint = isCountingDown(practiced, msToStreak) ? streakCountdownHint(msToStreak, streak) : null;
  return (
    <>
      <LanguageNameColumn>
        <LanguageNameLine>
          {languageName}
          {streak >= 1 && (
            <StreakBadge $practiced={practiced}>
              <LocalFireDepartmentIcon sx={practiced ? fireIconSx : fireIconGraySx} />
              {streak}
            </StreakBadge>
          )}
        </LanguageNameLine>
        {hint && <StreakHint>{hint}</StreakHint>}
      </LanguageNameColumn>
      <CefrSection>
        <CefrSelect
          value={cefrLevelValue}
          onClick={(ev) => ev.stopPropagation()}
          onChange={(ev) => onCefrLevelChange(ev.target.value, ev)}
        >
          {CEFR_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label.split(" | ")[0]}
            </option>
          ))}
        </CefrSelect>
      </CefrSection>
    </>
  );
}
