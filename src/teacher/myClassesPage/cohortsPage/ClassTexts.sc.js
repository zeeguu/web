import styled from "styled-components";
import { darkBlue } from "../../../components/colors";

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
