import styled from "styled-components";

const Heading = styled.h1`
  width: 100%;
  font-size: 1.3em;
  line-height: 150%;
  text-align: center;
  font-weight: 700;
  margin: 0;
  @media (max-width: 768px) {
    text-align: left;
  }

  @media (max-width: 576px) {
    font-size: 1.2em;
  }
`;

export { Heading };
