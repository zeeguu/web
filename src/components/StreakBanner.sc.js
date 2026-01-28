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
`;

const StreakValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
`;

const StreakLabel = styled.span`
  font-weight: 400;
`;

export { StreakBannerContainer, StreakValue, StreakLabel };
