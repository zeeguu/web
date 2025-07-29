import styled from "styled-components";

const ExercisesColumn = styled.div`
  /* background-color: lightcoral; */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  height: 95%;
  @media (max-width: 700px) {
    padding-top: 0.5rem;
  }
  // VISUAL_DEBUGGING
  //background-color: aquamarine;

  #arrowAndProgress {
    display: flex;
    align-items: center;
    gap: 1rem;

    /* BackArrow takes its natural width */
    > button:first-child {
      flex-shrink: 0;
    }

    /* Progress bar takes remaining space */
    > div:last-child {
      flex: 1;
      margin-right: 1rem;
    }
  }
`;

const ExForm = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  transition: all 0.5s;
  width: 100%;
  margin: 1rem auto;
  margin-top: 0px;
  background-color: rgba(241, 240, 240, 0.274);
  min-height: 400px;
  padding-bottom: 1rem;

  box-sizing: border-box; // to ensure that padding does not expand width!
  justify-content: center;

  .bottomInput {
    margin-bottom: 1em;
  }

  button {
    font-size: large;
  }

  input {
    font-size: large;
  }
  .next-nav-feedback {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 1.5em;

    img {
      width: 60px;
      mix-blend-mode: multiply;
      height: auto;
    }
    p {
      margin-left: 1em;
    }
  }

  .next-nav-learning-cycle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 1.5em;
    margin-left: auto;
    margin-right: auto;
    border: 0.125em solid #99e47f;
    border-radius: 0.5em;
    background-color: #f1f7f2;
    width: 70%;

    img {
      width: 60px;
      mix-blend-mode: multiply;
      height: auto;
      margin: 0.5em;
    }
    p {
      margin-left: 1em;
      margin-right: 1em;
    }
  }
`;

const LittleMessageAbove = styled.div`
  padding: 0.2em;
  text-align: center;
  font-size: small;
  margin-top: -2em;
  margin-bottom: 2em;
`;

export { ExercisesColumn, ExForm, LittleMessageAbove };
