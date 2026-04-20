import styled from "styled-components";
import { orange500, zeeguuOrange } from "../components/colors";

export const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2.5rem;
  padding: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem;
  }

  .card-bottom {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
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
  gap: 10px;
  cursor: pointer;

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

export const IconContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem auto;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

export const BadgeIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;

  ${({ $achieved }) =>
    !$achieved &&
    `
    filter: grayscale(100%);
    opacity: 0.4;
  `}
`;

export const BadgeTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 6px 0;
  color: var(--text-primary);
`;

export const LevelTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 3px 0;
  color: var(--text-primary);
`;

export const BadgeDescription = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const AchievedAtBox = styled.div`
  margin-top: 3px;
  align-self: center;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  margin-top: 6px;
  width: 100%;
`;

export const ProgressBar = styled.div`
  width: 6rem;
  height: 0.6rem;
  background-color: var(--badge-progress-bg);
  border-radius: 6px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background-color: ${({ $isCurrent }) => ($isCurrent ? zeeguuOrange : "var(--text-primary)")};
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

export const NewTag = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;

  background: ${orange500};
  color: var(--card-bg);

  padding: 0.2em 0.6em;
  font-size: 0.7rem;
  font-weight: 700;

  border-radius: 0 8px 0 8px;
`;

export const LevelRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 32px;
  margin-bottom: 24px;
  min-width: 16em;

  background: var(--card-bg);
  box-shadow: 0 1px 3px var(--shadow-color);
  border-radius: 16px;
  border: 2px
    ${({ $achieved, $isCurrent }) => {
      if ($achieved) return "";
      if ($isCurrent) return "";
      return "dashed var(--text-muted)";
    }};

  opacity: ${({ $achieved, $isCurrent }) => ($achieved || $isCurrent ? 1 : 0.4)};
`;
