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
    align-self: left;
`;

export {

    UserDashboardTile,
    UserDashboardGraphTile,
    UserDashboardTopContainer,
    UserDashboardHelperText

};