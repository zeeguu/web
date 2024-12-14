import styled from "styled-components";

let StatContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 990px) {
    margin-left: 0;
  }
`;

const Difficulty = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  gap: 0.5em;
  margin-right: 2em;
  img {
    height: 1.5em;
  }
  span {
    font-weight: 450;
  }
`;

const WordCount = styled(Difficulty)``;

const ReadingTimeContainer = styled(Difficulty)``;

export { StatContainer, Difficulty, WordCount, ReadingTimeContainer };
