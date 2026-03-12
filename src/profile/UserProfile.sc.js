import styled from "styled-components";
import { blue100, blue200, blue700, almostBlack, darkGrey, zeeguuOrange } from "../components/colors";

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const HeaderCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .avatar {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    background: ${blue100};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 3px solid ${blue200};

    img {
      width: 6rem;
      height: 6rem;
    }
  }

  .username {
    margin-bottom: 1rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: ${almostBlack};
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${darkGrey};
    font-size: 0.9rem;
    margin-top: 0.4rem;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .label {
    font-weight: 600;
    color: #555;
  }
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: ${blue100};
    border-radius: 8px;
    padding: 0.6rem 1rem;
  }
  
  .stat-streak-wrapper {
    display: flex;
    align-items: center;
  }

  .stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${blue700};
  }

  .stat-label {
    font-size: 0.8rem;
    color: ${darkGrey};
  }
`;

export const TabsSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #eee;
  margin-bottom: 1rem;

  button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    color: ${darkGrey};
    cursor: pointer;
    font-weight: 500;
    margin-bottom: -2px;
    transition: color 0.2s, border-color 0.2s;

    &:hover {
      color: ${almostBlack};
    }

    &.active {
      color: ${zeeguuOrange};
      border-bottom-color: ${zeeguuOrange};
      font-weight: 600;
    }
  }
`;

export const TabContent = styled.div`
  min-height: 120px;
  padding: 1rem 0 0;
`;
