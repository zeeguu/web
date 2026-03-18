import styled from "styled-components";

const MoreInfoBoxContainer = styled.div`
  background-color: #fff2dd;
  padding: 1.5em 2em;
  margin-top: 1em;
  margin-bottom: 1em;
  max-width: 430px;
  width: fit-content;
  border-radius: 0 1.5em 1.5em 1.5em;

  @media (max-width: 768px) {
    border-radius: 1.5em 1.5em 0 1.5em;
  }

  h3 {
    margin: 0 0 0.5em 0;
    font-size: 1em;
    color: #1f2937;
  }

  p {
    margin: 0.5em 0;
    color: #4b5563;
    line-height: 1.6;
    font-size: 0.9em;
  }

  @media (max-width: 576px) {
    padding: 1em 1.5em;
    margin: 1em 0;
    max-width: 100%;
  }
`;

export { MoreInfoBoxContainer };
