import styled from "styled-components";

const BaseBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
`;
const StreakBannerContainer = styled(BaseBanner)`
  background: linear-gradient(135deg, #fff8e1, #fff3cd);
  color: #7a5c00;
  border-bottom: 1px solid #ffe59e;

  &:hover {
    background: linear-gradient(135deg, #fff3cd, #ffe59e);
  }
`;
const DailyFeedbackBannerContainer = styled(BaseBanner)`
  background: linear-gradient(135deg, #e1f5fe, #b3e5fc);
  color: #01579b;
  border-bottom: 1px solid #81d1f6;

  &:hover {
    background: linear-gradient(135deg, #b3e5fc, #81d4fa);
  }

  a {
    color: inherit;
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
