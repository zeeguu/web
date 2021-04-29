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

  .matchInput {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .matchButtons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .matchButton {
    width: fit-content;
    margin: 2em;
    border-radius: 1em;
    padding: 0.5em;
    background-color: none;
    color: black;
    border: 0.125em solid #ffbb54;
    cursor: pointer;
    font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
  }

  .matchButton:focus {
    outline: 0;
  }

  .matchButton:hover {
    background-color: #ffbb5440;
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

export { Exercise };
