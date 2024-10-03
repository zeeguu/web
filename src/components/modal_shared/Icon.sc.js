import styled, { css } from "styled-components";

const Icon = styled.img`
  margin: 0 0.4rem -0.1rem 0;
  height: 1.2rem;
  width: 1.2rem;

  ${(props) =>
    props.type === "small" &&
    css`
      margin: 0.1rem 0.4rem -0.1rem 0;
      height: 1rem;
      width: 1rem;
    `}
`;

export default Icon;
