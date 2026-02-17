import styled from "styled-components";

const StreakBannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #fff8e1, #fff3cd);
  border-bottom: 1px solid #ffe59e;
  font-size: 0.85rem;
  color: #7a5c00;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #fff3cd, #ffe59e);
  }
`;
const DailyFeedbackBannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #fff8e1, #fff3cd);
  border-bottom: 1px solid #ffe59e;
  font-size: 0.85rem;
  color: #7a5c00;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #fff3cd, #ffe59e);
  }
`;

const StreakValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
`;

const StreakLabel = styled.span`
  font-weight: 400;
`;

const FlagImage = styled.img`
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
  border-radius: 50%;
  object-fit: cover;
  border: 0.05rem solid #ccc;
`;

export { StreakBannerContainer, StreakValue, StreakLabel, FlagImage, DailyFeedbackBannerContainer };
