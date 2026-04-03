import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2.5rem;
  padding: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem;
  }
`;

export const BadgeCard = styled.div`
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 140px;
  padding: 1.2em;

  background: var(--card-bg);
  border-radius: 8px;

  box-shadow: 0 1px 3px var(--shadow-color);
  transition: transform 0.15s ease;
  gap: 10px;
  cursor: default;

  .icon-container {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  h3 {
    text-align: center;
    font-size: 0.9rem;
    margin: 6px 0;
    color: var(--text-primary);
  }

  div {
    text-align: center;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    min-width: auto;
    padding: 0.8em;
    gap: 6px;

    .icon-container {
      margin-bottom: 0.25rem;
    }

    h3 {
      font-size: 0.9rem;
      margin: 3px 0;
    }
  }
`;

export const AchievedAtBox = styled.div`
  margin-top: auto;
  display: inline-block;
  background-color: var(--achieved-bg);
  color: var(--text-secondary);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;

  @media (max-width: 768px) {
    padding: 0.2rem 0.4rem;
  }
`;

export const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ProgressBar = styled.div`
  width: 60%;
  height: 10px;
  background-color: var(--progress-bar-bg);
  border-radius: 6px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 6px;
  }
`;

export const ProgressFill = styled.div`
  height: 100%;
  background-color: ${zeeguuOrange};
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  margin-top: 6px;
  font-size: 0.85rem;
  text-align: right;
  color: var(--text-muted);

  @media (max-width: 768px) {
    margin-top: 3px;
  }
`;