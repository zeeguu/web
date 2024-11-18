import styled, { css } from "styled-components";
import { zeeguuOrange } from "../../components/colors";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100dvh;
  background: ${zeeguuOrange};

  .bold {
    font-weight: 600;
  }

  .underlined-link {
    text-decoration: underline;
  }

  ${(props) =>
    props.layoutVariant === "minimalistic-top-aligned" &&
    css`
      width: 100%;
      min-height: auto;
      background: none;
      justify-content: flex-start;
    `}
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  max-width: 80%;
  border-radius: 1em;

  width: 47rem;
  padding: 2rem 6rem;
  margin: 1rem;

  background-color: white;

  @media (max-width: 1200px) {
    padding: 2rem 4.25rem;
    margin: 0.5rem;
    max-width: 47rem;
    width: 80%;
  }

  @media (max-width: 768px) {
    padding: 2rem 2rem;
  }

  @media (max-width: 576px) {
    padding: 1.5rem;
    width: 95%;
  }

  ${(props) =>
    props.pageWidth === "narrow" &&
    css`
      width: 38rem;
      @media (max-width: 1200px) {
        max-width: 38rem;
      }
    `}

  ${(props) =>
    props.layoutVariant === "minimalistic-top-aligned" &&
    css`
      @media (max-width: 1200px) {
        margin: 1rem;
      }
      @media (max-width: 576px) {
        width: 100%;
      }
    `}
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  p {
    width: 100%;
    font-size: 0.9em;
    margin: 0;
  }

  p.centered {
    text-align: center;
  }
`;

export { ContentWrapper, PageContainer, PageBackground };
