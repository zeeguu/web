import styled from "styled-components";

export const StyledStudentTranslations = styled.div`
  .sentences-containing-translated-word {
    border-left: solid 3px #4492b3;
    margin: 0 20px 20px 30px;
    line-height: 2;
    padding-left: 15px;
  }

  .translated-exercised-word {
    display: inline;
    border: solid 2px #54cdff;
    margin: 15px 0px 0px 0px;
    padding: 5px;
    border-radius: 25px;
  }

  .star-indicating-translated-word-being-exercised {
    color: #54cdff;
    font-size: 25px;
  }

  .dropdown-headline-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .information-icon {
    color: #5492b3;
    font-size: 45px;
  }
`;
