import styled from "styled-components";
import { blue400, blue600 } from "../components/colors";

// Topic pill styling for the modal's two example chips (dashed
// "inferred" and solid "gold"). Mirrors the styling still in use on
// VideoPreview so the explanations match what users see there.
const UrlTopics = styled.div`
  display: inline-block;
  cursor: help;
  margin-top: 1em;

  .inferred {
    border: dashed 1px ${blue400};
  }

  .gold {
    border: solid 1px ${blue600};
  }

  span {
    height: 1.2em;
    margin-left: 0.2em;
    margin-bottom: 0.5em;
    border-radius: 2em;
    padding: 0.4em 1.35em;
    font-size: 0.85em;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    background-color: var(--tag-bg);
  }

  .cancelButton {
    cursor: pointer;
    padding-left: 0.3em;
    margin-bottom: -0.3em;
    margin-right: -0.3em;
  }

  @media (max-width: 990px) {
    margin-bottom: 1.2em;
  }
`;

export { UrlTopics };
