import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import styled from "styled-components";
import { streakFireOrange } from "../colors.js";
import { CEFR_LEVELS } from "../../assorted/cefrLevels.js";

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
  cefrLevelValue,
  onCefrLevelChange,
}) {
  return (
    <>
      {languageName}
      {streak >= 1 && (
        <StreakBadge $practiced={practiced}>
          <LocalFireDepartmentIcon sx={practiced ? fireIconSx : fireIconGraySx} />
          {streak}
        </StreakBadge>
      )}
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
