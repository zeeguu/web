import styled from "styled-components";
import { darkBlue, lightBlue } from "../../components/colors";

export const StyledStudentTranslations = styled.div`
  .sentences-containing-translated-word {
    border-left: solid 3px ${darkBlue};
    margin: 0 20px 20px 30px;
    line-height: 2;
    padding-left: 15px;
  }

  .translated-exercised-word {
    display: inline;
    border: solid 2px ${lightBlue};
    margin: 15px 0px 0px 0px;
    padding: 5px;
    border-radius: 25px;
  }

  .star-indicating-translated-word-being-exercised {
    color: ${lightBlue};
    font-size: 25px;
  }

  .dropdown-headline-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .information-icon {
    color: ${darkBlue};
    font-size: 45px;
  }
`;
