import styled, { css } from "styled-components";

export const ErrorText = styled.p`
  margin: 0.5rem 0;
  color: #c0392b;

  :root[data-theme="dark"] & {
    color: #ff8a80;
  }
`;

let horizontalCentering = css`
  margin-left: auto;
  margin-right: auto;
`;

export { horizontalCentering };
