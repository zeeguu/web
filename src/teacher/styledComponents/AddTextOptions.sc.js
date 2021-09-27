import styled from "styled-components";
import { lightBlue } from "../../components/colors";

export const StyledAddTextOptions = styled.div`
  * {
    font-size: 22px;
  }

  .description {
    margin-top:1em;
    height: 2.6em;

    :hover {
      cursor: pointer;
      color: ${lightBlue};
    }
  }
  .link {
    color: black;
    font-weight: 400;

    :hover {
      color: ${lightBlue};
    }
  }

  .add-btn {
    width: 5em;
    margin-top: -0.25em;
    float: right;
    :hover {
      background-color: ${lightBlue};
      border: solid 2px ${lightBlue};
    }
  }
`;
