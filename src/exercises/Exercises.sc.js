import styled from "styled-components";

const ExercisesColumn = styled.div`
  /* background-color: lightcoral; */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2em;
  display: flex;
  flex-direction: column;
`;

const ExForm = styled.div`
  position: relative;
  margin: auto;
  background-color: rgba(241, 240, 240, 0.274);
  min-height: 500px;

  border-radius: 10px;
  overflow: hidden;
  transition: all 0.5s;
  width: 100%;

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
