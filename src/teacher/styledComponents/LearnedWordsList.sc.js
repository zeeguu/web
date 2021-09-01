import styled from "styled-components";

export const StyledLearnedWordsList = styled.div`
  .date-of-word-learned {
    color: #808080;
  }

  .no-learned-words-string {
    font-size: medium;
  }

  .learned-words-container {
    border-left: solid 3px #5492b3;
    margin-bottom: 38px;
    min-width: 270;
    user-select: none;
  }

  .learned-word-translation {
    color: #44cdff;
    margin-bottom: -15px;
    margin-top: 0px;
    margin-left: 1em;
  }

  .learned-word-string {
    margin-left: 1em;
    margin-bottom: -5px;
  }

  .learned-words-student-feedback-container {
    display: flex;
    flex-direction: row;
    margin-left: 1em;
    font-size: small;
    margin-bottom: -25px;
  }
`;
