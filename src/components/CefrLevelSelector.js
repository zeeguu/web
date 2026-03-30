import styled from "styled-components";
import { blue100, blue700, blue900, lightGrey, darkGrey, veryLightGrey } from "./colors";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border-radius: 0.4rem;
  border: 1.5px solid ${({ $selected }) => ($selected ? blue700 : lightGrey)};
  background-color: ${({ $selected }) => ($selected ? blue100 : "#fff")};
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;
  user-select: none;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? blue700 : darkGrey)};
    background-color: ${({ $selected }) => ($selected ? blue100 : veryLightGrey)};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const Band = styled.span`
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ $selected }) => ($selected ? blue900 : darkGrey)};
  width: 1.8rem;
  text-align: center;
`;

const LevelName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $selected }) => ($selected ? blue900 : "black")};
`;

const Description = styled.span`
  font-size: 0.8rem;
  color: ${({ $selected }) => ($selected ? blue700 : darkGrey)};
  display: block;
`;

const ErrorMsg = styled.p`
  font-size: 0.8rem;
  color: #d7263d;
  margin: 0;
`;

export default function CefrLevelSelector({ levels, selectedValue, onChange, label, isError, errorMessage }) {
  return (
    <Wrapper role="radiogroup" aria-label={label}>
      {label && <Label>{label}</Label>}
      {levels.map((level) => {
        const [band, name] = level.label.split(" | ");
        const isSelected = level.value === selectedValue;
        return (
          <Card
            key={level.value}
            $selected={isSelected}
            onClick={() => onChange(level.value)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onChange(level.value)}
          >
            <Band $selected={isSelected}>{band}</Band>
            <div>
              <LevelName $selected={isSelected}>{name}</LevelName>
              {level.description && <Description $selected={isSelected}>{level.description}</Description>}
            </div>
          </Card>
        );
      })}
      {isError && errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
    </Wrapper>
  );
}
