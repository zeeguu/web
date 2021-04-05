import styled from "styled-components";
import { darkGrey, darkBlue } from "../components/colors";


export const StyledTutorialItemCard = styled.div`
.vertical-line-border-box{
    margin-top: 2em;
    font-size:22px;
    padding: .05em .5em;
    border-left: solid 3px ${darkBlue}
}
iframe{
    margin-top: .5em;
    margin-left: 2em;
    border-radius: 20px;
}
.placeholder{
    margin-top: .5em;
    margin-left: 2em;
    border-radius: 20px;
    color:white;
    text-align:center;
    width:644px;
    height:362px;
    background-color: ${darkGrey};
    border: solid 3px ${darkBlue};
}
`;