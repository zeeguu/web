import styled from "styled-components";
import { orange500, streakFireOrange } from "../components/colors";

export const HeaderCard = styled.div`
  position: relative;
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px var(--shadow-color);
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 0.75rem;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .name-wrapper {
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
    row-gap: 0.25rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    padding-right: 2rem;

    @media (max-width: 768px) {
      justify-content: center;
      margin-top: 0;
      padding-right: 0;
      margin-bottom: 0.5rem;
    }
  }

  .username-row {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .username,
  .display-name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;

    @media (max-width: 768px) {
      justify-content: center;
      font-size: 1.25rem;
    }
  }

  .username {
    color: var(--text-primary);
    overflow-wrap: anywhere;

    &.editable {
      cursor: pointer;
    }

    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  }

  .display-name {
    color: var(--text-secondary);
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.4rem;

    @media (max-width: 768px) {
      justify-content: center;
    }

    .flag-image-wrapper {
      cursor: pointer;
    }
  }

  .label {
    font-weight: 600;
    color: var(--text-secondary);
  }
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;

  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 0.5rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--streak-banner-border);
    border-radius: 8px;
    padding: 0.6rem 1rem;
  }

  .stat-streak-wrapper {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }

  .stat-value {
    color: ${streakFireOrange};
    margin-right: 0.3rem;
  }

  .stat-label {
    color: var(--text-secondary);
  }

  .stat-value,
  .stat-label {
    font-size: 1rem;
    font-weight: 600;
  }
`;

export const InlineEditButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: none;
  background: var(--streak-banner-border);
  color: var(--text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: var(--streak-banner-hover);
    color: ${orange500};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const UsernameEditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    align-items: center;
  }

  .edit-row {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    max-width: 100%;
    min-width: 0;
  }
`;

export const UsernameInput = styled.input`
  box-sizing: border-box;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1.5px solid ${orange500};
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  width: 13rem;
  min-width: 0;
  max-width: 100%;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(240, 144, 0, 0.35);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const UsernameError = styled.span`
  color: #b91c1c;
  font-size: 0.8rem;
  font-weight: 500;

  [data-theme="dark"] & {
    color: #fca5a5;
  }
`;
