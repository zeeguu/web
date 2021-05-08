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

let FeedbackButton = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  margin-left: 2em;

  color: #ffffff;
  height: 2.5em;
  width: 4em;
  background-color: #ffbb54;
  border-style: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 0.5em;
  user-select: none;
  outline: none;
  font-weight: 500;

  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
`;

let OrangeButton = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  color: #ffffff;
  background-color: #ffbb54;
  border-style: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 0.5em;
  user-select: none;

  font-weight: 500;

  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;

  &:disabled {
    background: none;
    color: gray;
    cursor: default;
    text-decoration: line-through;
  }
`;

let Input = styled.input`
  height: 1.5em;
  text-align: center;
`;

let BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 3em;
  flex-wrap: wrap;
`;

export { Exercise, FeedbackButton, OrangeButton, Input, BottomRow };
