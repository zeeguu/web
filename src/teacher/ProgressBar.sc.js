import styled from "styled-components";
import { darkBlue, lightOrange } from "../components/colors";

export const ProgressBar = styled.div`

.activity-bar {
    height: 20px;
    display: flex;
    color: black;
    display:flex;
    justify-content:center;
  }
  
  .activity-bar#reading{
    border-radius:25px 0 0 25px;
    background-color: ${darkBlue}; 
  }
  .activity-bar#exercises{
    
    border-radius:0 25px 25px 0;
    background-color: ${lightOrange}; 
  }

  `;