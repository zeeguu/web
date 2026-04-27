import styled from "styled-components";
import { orange500, streakFireOrange } from "../components/colors";

export const TabsSection = styled.div`
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--shadow-color);
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 1rem;

  button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 500;
    margin-bottom: -2px;
    transition:
      color 0.3s,
      border-color 0.5s;

    &.active {
      color: ${streakFireOrange};
      border-bottom-color: ${streakFireOrange};
      font-weight: 600;
    }

    &:hover {
      color: ${orange500};
    }

    &.active:hover {
      border-bottom-color: ${orange500};
    }

    @media (max-width: 768px) {
      padding-left: 0.8rem;
      padding-right: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

export const TabContent = styled.div`
  min-height: 100vh;
  padding: 1rem 0 0;
`;
