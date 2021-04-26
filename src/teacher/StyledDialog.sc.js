import styled from "styled-components";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import {darkBlue} from "../components/colors";

export const StyledDialog = styled(Dialog)`
  max-width: ${(props) => props.max_width};
  border-radius: 15px;

  .centered{
    display:flex;
    flex-direction: column;
    align-items: center;
  }

  .bold-blue{
    margin:0;
    font-size: 1.2em;
    font-weight: 600;
    color:${darkBlue};
  }

  .name-box{
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    padding: 0 1em;
  }
`;