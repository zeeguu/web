import styled from "styled-components"; 

export const StyledLoader = styled.div`
 .wrapper {
   display: flex;
   justify-content: center;
   position: relative;
   margin-top: 80px;
 }
 
  .loader {
    border: 10px solid #ffe5b9;
    border-top: 10px solid #ffbb54;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    position: absolute;
    animation: circleAnimation 2s linear infinite;
  }

  .logo {
    height: 80px;
    width: 80px;
    position: absolute;
    top: 28px;
  }

  @keyframes circleAnimation {
    0% {
    }
    100% {
      transform: rotate(360deg);
    }
  }

`;
