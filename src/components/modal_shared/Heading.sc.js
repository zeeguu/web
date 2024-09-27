import styled from "styled-components";

const Heading = styled.h1`
  font-size: 1.3rem;
  line-height: 150%;
  text-align: center;
  font-weight: 700;
  margin: 0;

  &.small {
    font-size: 1.125rem;
  }

  @media (max-width: 576px) {
    text-align: left;
    font-size: 1.2rem;
    &.small {
      font-size: 1rem;
    }
  }
`;

export { Heading };
