import styled from "styled-components";
import { darkGrey, darkBlue, lightBlue } from "../components/colors";

export const StyledTutorialItemCard = styled.div`
  /* font-size: 20px; */

  /* .vertical-line-border-box {
    margin-top: 2em;
    padding: 0.05em 0.5em;
    border-left: solid 3px ${darkBlue};
  } */

  /* .placeholder {
    margin-top: 0.5em;
    margin-left: 2em;
    border-radius: 20px;
    color: white;
    text-align: center;
    width: 644px;
    height: 362px;
    background-color: ${darkGrey};
    border: solid 5px ${lightBlue};
*/

  p {
    font-size: 1.4em;
    font-weight: 600; //700 is normal bold
  }

  .video-responsive {
    overflow: hidden;
    padding-bottom: 56.25%;
    position: relative;
    height: 0;
  }

  .video-responsive iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
    margin-top: 0.5em;
    padding: 0.05em 0.5em 0 1.5em;
    border-left: solid 3px ${darkBlue};
  }

  .video-responsive {
    margin-bottom: 3em;
  }
`;
