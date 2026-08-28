import styled from "styled-components";
import { zeeguuOrange, lightOrange } from "../components/colors";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 1.15rem;
`;

export const Explanation = styled.p`
  margin: 0 0 0.8rem;
  max-width: 34ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-secondary);
`;

export const ClassList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 26rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ClassRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-secondary);

  /* On a phone the class name and the "Switch to Norwegian" label are both too
     long to sit side by side; side-by-side they each wrap to two ragged lines. */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
`;

export const ClassName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

export const TextCount = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  margin-top: 0.15rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

export const SwitchButton = styled.button`
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  background-color: ${zeeguuOrange};
  color: black;

  @media (hover: hover) {
    &:hover {
      background-color: ${lightOrange};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
