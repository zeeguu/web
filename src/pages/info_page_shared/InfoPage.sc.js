import styled from "styled-components";
import { FormContainer } from "../../components/FormPage.sc";
import {
  zeeguuOrange,
  zeeguuVeryLightYellow,
  zeeguuVeryLightOrange,
  zeeguuTransparentLightOrange,
} from "../../components/colors";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* max-height: 30dvh;
  overflow-y: scroll; */
  /* 
  img {
    width: 100%;
  } */

  /* h1 {
    margin-block-start: 0em;
    margin-block-end: 0em;
    font-size: 1.3em;
    font-weight: 700;
    font-weight: 400;
  } */

  h1 {
    font-size: 1.3em;
    line-height: 150%;
    text-align: center;
    font-weight: 700;
    margin: 0;
    @media (max-width: 576px) {
      text-align: left;
      font-size: 1.2em;
    }
  }

  p {
    font-size: 0.9em;
    margin-block-end: 0em;
  }

  .header,
  .body,
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 0;
    gap: 1.5rem;
  }

  .body-image {
    width: 80%;
  }

  @media (max-width: 576px) {
    .body-image {
      width: 100%;
    }
  }
`;

let LinkContainer = styled.div`
  /* margin: 0.8em; */
  display: flex;
  justify-content: space-evenly;
`;

let PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 40em;
  max-width: 80%;
  border-radius: 1em;

  width: 750px;
  padding: 2rem;
  margin: 1rem;

  background-color: white;

  @media (max-width: 1200px) {
    /* max-width: 800px; */
    margin: 0.5rem;
    max-width: 750px;
    width: 80%;
  }

  @media (max-width: 576px) {
    padding: 24px 24px;
    margin: 0.5rem;
    max-width: 500px;
    width: 90%;
  }
`;

const OrangeButton = styled.button`
  min-height: 4em;
  width: 20em;
  /* margin: 0em 1em 0em 1em; */
  background: ${zeeguuOrange};
  border: 0.3em solid ${zeeguuOrange};
  border-radius: 7em;

  a {
    font-weight: 600;
    font-size: 1.5em;
    color: white;
  }
`;

let PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  min-height: 100vh;
  /* margin-top: -1em; */

  /* padding-top: 0.5rem;
  padding-bottom: 0.5rem; */
  background: ${zeeguuOrange};
`;

let VideoLink = styled.p`
  margin: 0em;
  padding-bottom: 1em;
`;

export {
  ContentWrapper,
  PageContainer,
  LinkContainer,
  OrangeButton,
  PageBackground,
  VideoLink,
};
