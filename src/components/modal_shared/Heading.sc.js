import styled from "styled-components";

const Heading = styled.h1`
  font-size: 1.3em;
  line-height: 150%;
  text-align: center;
  font-weight: 700;
  margin: 0;
  @media (max-width: 576px) {
    text-align: left;
    font-size: 1.2em;
  }
`;

export { Heading };
