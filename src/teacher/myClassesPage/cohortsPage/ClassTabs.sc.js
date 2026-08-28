import styled from "styled-components";

export const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

export const BackLink = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.35rem;

  a {
    color: var(--text-secondary);
    text-decoration: none;
  }

  @media (hover: hover) {
    a:hover {
      text-decoration: underline;
    }
  }
`;

export const ClassName = styled.h1`
  margin: 0 0 0.3rem;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
`;
