import styled from "styled-components";
import { darkBlue } from "../../../components/colors";

export const Subtitle = styled.div`
  margin: -0.4rem 0 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

export const Notice = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.8rem 0.95rem;
  margin-bottom: 1rem;
  border-radius: 9px;
  font-size: 0.85rem;
  line-height: 1.5;
  border: 1px solid ${({ $tone }) => ($tone === "bad" ? "#d99" : "#dcb")};
  background-color: ${({ $tone }) => ($tone === "bad" ? "#fbeceb" : "#fdf5e6")};
  color: ${({ $tone }) => ($tone === "bad" ? "#8c2b22" : "#7a4e00")};

  strong {
    font-weight: 700;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.4rem;
`;

export const SectionLabel = styled.h2`
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 0 0.2rem;
`;

export const StudentView = styled.div`
  border: 1px solid ${darkBlue}33;
  border-radius: 10px;
  padding: 0.5rem 1rem 1rem;
`;
