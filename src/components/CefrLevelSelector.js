import styled from "styled-components";
import { blue100, blue700, blue900, lightGrey, darkGrey } from "./colors";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`;

const Label = styled.label`
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
  flex: 1;
  padding: 0.45rem 0;
  border-radius: 2rem;
  border: 1.5px solid ${({ $selected }) => ($selected ? blue700 : lightGrey)};
  background: ${({ $selected }) => ($selected ? blue100 : "#fff")};
  color: ${({ $selected }) => ($selected ? blue900 : "black")};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;

  &:active {
    transform: scale(0.96);
    transition: transform 80ms;
  }
`;

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
  color: #d7263d;
  margin: 0;
`;

export default function CefrLevelSelector({ levels, selectedValue, onChange, label, isError, errorMessage }) {
  const selected = levels.find((l) => l.value === selectedValue);

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <PillRow role="radiogroup" aria-label={label}>
        {levels.map((level) => {
          const band = level.label.split(" | ")[0];
          const isSelected = level.value === selectedValue;
          return (
            <Pill
              key={level.value}
              type="button"
              $selected={isSelected}
              onClick={() => onChange(level.value)}
              role="radio"
              aria-checked={isSelected}
            >
              {band}
            </Pill>
          );
        })}
      </PillRow>
      <HintBox>
        {selected && (
          <>
            <HintLabel>{selected.label}</HintLabel>
            {selected.description && <HintDescription>{selected.description}</HintDescription>}
          </>
        )}
      </HintBox>
      {isError && errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
    </Wrapper>
  );
}
