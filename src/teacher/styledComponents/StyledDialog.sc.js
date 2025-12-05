import styled from "styled-components";
import { Dialog } from "../../components/DialogWrapper";
import { darkBlue } from "../../components/colors";

export const StyledDialog = styled(Dialog)`
  margin:${(props) => props.margin};
  max-width: ${(props) => props.max_width};
  border-radius: 15px;

  .centered{
    display:flex;
    flex-direction: column;
    align-items: center;
  }
  .centered#row{
    justify-content:center;
    flex-direction:row;
  }

  .bold-blue{
    margin:0;
    font-size: 1.2em;
    font-weight: 600;
    color:${darkBlue};
  }

  .name-box{
    text-align:center;
    min-width: 300px;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    padding: 0 1em;
  }
  .change-time{
    font-size:x-large;
    margin-left: 22px;
  }
`;