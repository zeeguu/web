import styled from "styled-components";

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  min-height: 70vh;
  padding: 2rem;
  overflow: hidden;

  h2 {
    margin-bottom: 1.5rem;
  }

  p {
    max-width: 400px;
    line-height: 1.5;
  }
`;

export default function OutOfWordsMessage({ goBackAction }) {
  return (
    <CenteredMessage>
      <h2>Nothing more to study at the moment :)</h2>
      <p>
        Words are scheduled for exercises according to spaced-repetition principles and you already practiced the
        words that were due at this moment 🎉
      </p>
    </CenteredMessage>
  );
}
