import styled from "styled-components";
import { darkGrey, darkBlue, lightBlue } from "../components/colors";


export const StyledTutorialItemCard = styled.div`
font-size:22px;

.vertical-line-border-box{
    margin-top: 2em;
    padding: .05em .5em;
    border-left: solid 3px ${darkBlue}
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
    border: solid 5px ${lightBlue};

    p {margin-top: 25%}
}
`;