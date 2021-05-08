import styled from "styled-components";

const Exercise = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  transition: all 0.5s;

  .bottomInput {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;
    margin-top: 3em;
    flex-wrap: wrap;
  }

  .bottomInput button {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  .bottomInput input {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
  }

  .highlightedWord {
    color: orange;
    font-weight: 800;
  }

  .contextExample {
    margin-top: 2em;
    margin-left: 2em;
    margin-right: 2em;
  }

  /* Mobile version */
  @media screen and (max-width: 768px) {
    .contextExample {
      margin-top: 0.5em;
      margin-left: 0.5em;
      margin-right: 0.5em;
    }

    .bottomInput {
      margin-top: 0.5em;
    }

    .bottomInput input {
      width: 6em;
    }

    h1 {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  }
`;

let SpeakButton = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  margin-left: 2em;

  width: 55px;
  height: 2.5em;
  background-color: #ffe086;
  border-style: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 5px;
  user-select: none;
`;

let NextButton = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: #ffffff;
  height: 2.5em;
  background-color: #ffbb54;
  border-style: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 5px;
  user-select: none;
  outline: none;

  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
`;

let YellowButton = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: #ffffff;
  background-color: #ffe086;
  border-style: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 5px;
  user-select: none;

  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;

  &:disabled {
    background: none;
    color: gray;
  }
`;

export { Exercise, SpeakButton, NextButton, YellowButton };
