import styled from "styled-components";

const LoadingAnimation = styled.div`
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: darkgray;

  margin-top: 5em;

  @keyframes fadeInAndOut {
    0% {
      opacity: 00;
    }
    50% {
      opacity: 100;
    }
    100% {
      opacity: 0;
    }
  }

  animation: fadeInAndOut;
  animation-duration: 4s;
  animation-iteration-count: 3;
`;

export { LoadingAnimation };
