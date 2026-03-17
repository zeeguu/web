import styled from "styled-components";
import { almostBlack, darkGrey, lightGrey, orange600 } from "../../components/colors";

export const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const PickerSection = styled.div`
  margin-bottom: 1.5rem;

  .picker-label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    color: ${darkGrey};
    margin-bottom: 0.5rem;
    text-align: center;
  }
`;

export const PickerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const AvatarOption = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? "black" : lightGrey)};
  background: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.2s,
    transform 0.15s;
  background: ${({ $backgroundColor }) => $backgroundColor};

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 70%;
    height: 70%;
  }
`;

export const ColorOption = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? "black" : lightGrey)};
  cursor: pointer;
  padding: 0;
  transition:
    border-color 0.2s,
    transform 0.15s;
  transform: ${({ $selected }) => ($selected ? "scale(1.2)" : "none")};

  &:hover {
    transform: scale(1.2);
  }
`;
