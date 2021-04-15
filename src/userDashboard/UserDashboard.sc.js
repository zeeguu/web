import styled from "styled-components";
import * as s from "../components/TopMessage.sc";

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
`;

const UserDashboardGraphTile = styled.h2`
    font-size: 1.5em;
    font-weight: 400;
    letter-spacing: 0;
    text-align: center;
    margin-left: 2em;
`;

const UserDashboardHelperText = styled(s.TopMessage)`
`;

const UserDashBoardTabs = styled.div`
    line-height: 1.4em;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 2em;

.userdashboard_tab_list{
    /* background-color: lightcoral; */
    line-height: 1.4em;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
}

`;

const UserDashBoardTab = styled.a`
    font-size: 1.2em;
    font-weight: ${props => props.isActive? 600 : 400};
    letter-spacing: 0;
    color: black;
    padding: 1em;

:hover{
    color: #ffbb54;
}


`;

const UserDashBoardOptions = styled.div`
    padding: 2em;
`;

export {

    UserDashboardTile,
    UserDashboardGraphTile,
    UserDashboardTopContainer,
    UserDashboardHelperText,
    UserDashBoardTabs,
    UserDashBoardOptions,
    UserDashBoardTab

};