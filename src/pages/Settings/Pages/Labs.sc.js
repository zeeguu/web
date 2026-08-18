import styled from "styled-components";

const Intro = styled.p`
  max-width: 37rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 1.5rem 0;
`;

const Experiment = styled.section`
  box-sizing: border-box;
  max-width: 37rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;

  h3 {
    margin: 0 0 0.35rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: var(--text-muted);
  }
`;

export { Intro, Experiment };
