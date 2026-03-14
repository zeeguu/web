import styled from "styled-components";

const ExercisesColumn = styled.div`
  /* background-color: lightcoral; */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  @media (max-width: 700px) {
    padding-top: 0.5rem;
  }
  // VISUAL_DEBUGGING
  //background-color: aquamarine;

  #exerciseTopbar {
    width: 100%;
    padding: 0.5rem 0;
  }

  #topbarRow {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0;
    min-height: 1.25rem;
    padding: 0 0.25rem;
  }
`;

const ExForm = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  transition: all 0.5s;
  width: 100%;
  margin: 0 auto;
  background-color: var(--exercise-card-bg, rgba(241, 240, 240, 0.274));
  min-height: 500px;
  padding-bottom: 1rem;

  box-sizing: border-box; // to ensure that padding does not expand width!

  .bottomInput {
    margin-bottom: 1em;
  }

  button {
    font-size: large;
  }

  .highlightedWord {
    color: orange;
    font-weight: 800;
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
    border: 0.125em solid var(--success-border);
    border-radius: 0.5em;
    background-color: var(--success-bg);
    width: 70%;

    img {
      width: 60px;
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
