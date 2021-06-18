import styled, { css } from "styled-components";


export const StudentActivityDataCircleWrapper = styled.div`
  display: flex;
  width: 30em;
  padding: 0.5vw;
  


${(props) =>
        props.isFirst &&
        css`

.data-circle-title {
    margin:-3vh 0 3vh 0;
    justify-content: center;
    text-align: center;
    font-size: medium;
    font-family: "Montserrat";
}
      



    `}

`;

