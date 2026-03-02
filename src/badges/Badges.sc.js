import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
`;

export const BadgesRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const BadgeCard = styled.div`
  width: 140px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.15s ease;
  position: relative;

  &:hover {
    transform: translateY(-3px);
  }

  .icon-container {
    width: 80px;        // fixed width for all icons
    height: 80px;       // fixed height for all icons
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  h3 {
    text-align: center;
    font-size: 0.9rem;
    line-height: 1.2;
  }
  
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Level = styled.div`
  padding: 0.6rem 0;
  opacity: ${(p) => (p.achieved ? 1 : 0.4)};
`;

export const BadgePanel = styled.div`
  position: relative; // important for absolute children
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  text-align: center;
  width: 360px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .level-info {
    flex: 1;
    overflow-y: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }
`;

export const CarouselButtons = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;  // lets clicks go to buttons
  button {
    pointer-events: auto; // re-enable buttons
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

export const AchievedAtBox = styled.div`
  margin-top: 0.5rem;
  display: inline-block;
  background-color: #eee;
  color: #555;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
`;
