import styled from "styled-components";

export const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 2.5rem;
  padding: 2rem;
`;

export const BadgeCard = styled.div`
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 140px;
  padding: 1.2em;

  background: white;
  border-radius: 8px;

  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  }

  div {
    text-align: center;
    font-size: 0.85rem;
  }
`;

export const AchievedAtBox = styled.div`
  margin-top: auto;
  display: inline-block;
  background-color: rgba(90, 189, 92, 0.35);
  color: #555;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
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
  background-color: #e5e5e5;
  border-radius: 6px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background-color: #F0A030;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  margin-top: 6px;
  font-size: 0.85rem;
  text-align: right;
  color: #666;
`;
