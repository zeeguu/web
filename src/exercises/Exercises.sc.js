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
`;

const ExForm = styled.div`
  background-color: rgba(241, 240, 240, 0.274);
  min-height: 250px;
  border-radius: 10px;
  transition: all 0.5s;
  width: 100%;
  margin: 1rem auto;
  @media (max-width: 700px) {
    height: 90%;
  }

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
`;

const LittleMessageAbove = styled.div`
  padding: 0.2em;
  text-align: center;
  font-size: small;
  margin-top: -2em;
  margin-bottom: 2em;
`;

export { ExercisesColumn, ExForm, LittleMessageAbove };
