import styled from "styled-components";
import * as s from "../components/TopMessage.sc";
import { lightOrange } from '../components/colors';

let lightGray = "#C6C9D1";
let darkerHueZeeguuOrange = "#9c7130";

const UserDashboardTopContainer = styled.div`
    text-align: center;
`;

const UserDashboardTile = styled.h1`
    font-weight: 300;
    font-size: 3em;
    line-height: 1em;
    letter-spacing: 0.05em; 
    text-align: center;
    margin-top: 1em;

@media screen and (max-width: 768px) {
    font-size: 1.5em;
    padding: 0.5em;
}

`;

const UserDashboardGraphTitle = styled.h2`
    font-size: 1.3em;
    font-weight: 400;
    letter-spacing: 0;
    text-align: center;
    margin-left: 2em;

@media screen and (max-width: 768px) {
    font-size: 1em;
    padding: 0.5em;
    text-align: left;
}

`;

const UserDashboardHelperText = styled(s.TopMessage)`
    width: auto;
    line-height: 3ex;

@media screen and (max-width: 768px) {
    font-size: 0.8em;
    line-height: 4ex;
    text-align: left;
}

`;

const UserDashBoardTabs = styled.div`
    line-height: 1.4em;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 2em;

`;

const UserDashBoardTab = styled.a`
    font-size: 1.2em;
    font-weight: ${props => props.isActive? 600 : 400};
    letter-spacing: 0;
    color: black;
    padding: 1em;

:hover{
    color: ${lightOrange};
    cursor:pointer;
}

@media screen and (max-width: 768px) {
    font-size: 0.8em;
    padding: 0.5em;
    line-height: 7ex;
}

`;

const UserDashBoardOptionsContainer = styled.div`
    width: auto;
    padding: 1em;
    text-align: center;
`;

const UserDashBoarDropdown = styled.select`
    border: none;
    font-size: 1em;
    font-weight: 400;
    letter-spacing: 0;
    color: ${props => props.disabled? lightGray: 'black'};

:hover{
    color: ${props => props.disabled? lightGray: darkerHueZeeguuOrange};
    cursor: ${props => props.disabled? 'not-allowed': 'pointer'};
}

`;

//parent container has to have height specified in order for the nivo graphs to be shown
//this is why the div has height 500; the number can be changed
const NivoGraphContainer = styled.div`
${console.log("here")};
    height: 500px;
`;

export {

    UserDashboardTile,
    UserDashboardGraphTitle,
    UserDashboardTopContainer,
    UserDashboardHelperText,
    UserDashBoardTabs,
    UserDashBoardOptionsContainer,
    UserDashBoardTab,
    UserDashBoarDropdown,
    NivoGraphContainer

};