import styled from "styled-components";

export const LanguagesGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.5rem;
  padding: 0;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    max-height: none;
    overflow-y: visible;
  }
`;

export const LanguageCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.1rem 0.75rem 0.1rem 0.5rem;
  min-height: 2.75rem;
  min-width: 11rem;
  border-radius: 2rem;
  border: solid 0.1rem var(--border-color);
  box-shadow: 0 0.1rem var(--border-color);
  white-space: nowrap;
  background: var(--card-bg);
  margin-bottom: 0.2rem;

  .language-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-primary);
    text-transform: capitalize;
    flex: 1;
    white-space: wrap;
  }

  .streaks-info {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-left: 0.75em;
    border-left: 1px solid var(--border-light);
    height: 1.5em;
    gap: 0.4rem;
    justify-content: end;
  }

  .streak-item {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    font-weight: 600;
    font-size: 0.9rem;
    justify-content: center;
  }
`;
