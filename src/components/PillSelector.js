import styled from "styled-components";
import { blue100, blue700, blue900, darkGrey, zeeguuRed } from "./colors";

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`;

const FieldLabel = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const PillRow = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const Pill = styled.button`
  /* A uniform scale (A1..C2) reads best as equal columns; a handful of labels of
     different lengths reads better sized to its own words. */
  flex: ${({ $equalWidth }) => ($equalWidth ? "1" : "0 1 auto")};
  min-width: 0;
  /* A pill sized to its own words needs real padding around them. A stretched
     one must not have it: six equal pills plus 1.8rem each stopped fitting a
     375px row, and the CEFR bands ellipsised to "A...". */
  padding: ${({ $equalWidth }) => ($equalWidth ? "0.45rem 0.2rem" : "0.45rem 0.9rem")};
  border-radius: 2rem;
  border: 1.5px solid ${({ $selected }) => ($selected ? blue700 : "var(--border-color)")};
  background: ${({ $selected }) => ($selected ? blue100 : "var(--bg-primary)")};
  color: ${({ $selected }) => ($selected ? blue900 : "var(--text-primary)")};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  /* Country names are longer than "A1" and the row has to survive 375px. */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition:
    border-color 150ms,
    background-color 150ms;

  &:active {
    transform: scale(0.96);
    transition: transform 80ms;
  }
`;

// Reserved even when nothing is selected, so choosing a pill does not shove the
// rest of the form down. Absent entirely when no option has anything to say --
// a hint that only restates its own pill is worse than no hint.
const HintBox = styled.div`
  min-height: 2.4rem;
  padding: 0.3rem 0.1rem;
`;

const HintLabel = styled.span`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${blue900};
`;

const HintDescription = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${darkGrey};
`;

const ErrorMsg = styled.p`
  font-size: 0.8rem;
  color: ${zeeguuRed};
  margin: 0;
`;

/**
 * A row of pills, one selected, with a line underneath saying what the selected
 * one means. Every option is visible at once, which is the point: the choice is
 * small and worth seeing without opening anything.
 *
 * Options are `{ value, pillLabel, title?, hintLabel?, hintDescription? }`. Callers map
 * their own data into that shape rather than this knowing about levels or
 * countries -- a pill is short by necessity, and only the caller can say which
 * part of its data is short enough to be one.
 */
export default function PillSelector({
  options,
  selectedValue,
  onChange,
  label,
  isError,
  errorMessage,
  id,
  equalWidth = true,
}) {
  const selected = options.find((option) => option.value === selectedValue);
  const hasHints = options.some((option) => option.hintLabel || option.hintDescription);

  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <PillRow role="radiogroup" aria-label={label} id={id}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <Pill
              key={option.value}
              type="button"
              $selected={isSelected}
              $equalWidth={equalWidth}
              onClick={() => onChange(option.value)}
              role="radio"
              aria-checked={isSelected}
              title={option.title || option.hintLabel || option.pillLabel}
            >
              {option.pillLabel}
            </Pill>
          );
        })}
      </PillRow>
      {hasHints && (
        <HintBox>
          {selected && (
            <>
              {selected.hintLabel && <HintLabel>{selected.hintLabel}</HintLabel>}
              {selected.hintDescription && <HintDescription>{selected.hintDescription}</HintDescription>}
            </>
          )}
        </HintBox>
      )}
      {isError && errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
    </Field>
  );
}
