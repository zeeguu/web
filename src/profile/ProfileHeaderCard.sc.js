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
    column-gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    padding-right: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0;
      padding-right: 0;
      margin-bottom: 0.5rem;
    }
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

export const EditProfileButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: var(--streak-banner-border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--streak-banner-hover);
    color: ${orange500};
  }

  @media (max-width: 768px) {
    top: 0.75rem;
    right: 0.75rem;
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
