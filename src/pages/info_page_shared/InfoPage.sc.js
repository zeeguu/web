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
    props.pageLocation === "settings" &&
    css`
      width: auto;
      min-height: auto;
      background: none;
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
    props.type === "narrow" &&
    css`
      width: 38rem;
      @media (max-width: 1200px) {
        max-width: 38rem;
      }
    `}
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  p {
    font-size: 0.9em;
    margin: 0;
  }
`;

export { ContentWrapper, PageContainer, PageBackground };
