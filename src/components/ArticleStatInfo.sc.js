import styled from "styled-components";

let StatContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 990px) {
    margin-left: 0;
  }
`;

const Difficulty = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.5em;
  img {
    height: 1.5em;
  }
  span {
    font-weight: 450;
  }
`;

const WordCount = styled(Difficulty)``;

const ReadingTimeContainer = styled(Difficulty)``;

const ReadingTime = styled.span`
  font-size: 0.9em;
  color: #888;
`;

export { StatContainer, Difficulty, WordCount, ReadingTimeContainer, ReadingTime };
