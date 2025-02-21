import styled from "styled-components";
import { Link } from "react-router-dom";
import { orange700, orange800 } from "./colors";

const ReactLink = styled(Link)`
  display: flex;
  font-size: 1.2rem;
  font-weight: 600;
  gap: 0.25rem;
  align-items: center;
  text-underline-offset: 0.2em;
  color: ${orange700};
  transition: all 0.3s ease-in-out;
  padding: 0.5rem 0;

  &:hover {
    color: ${orange800};
  }

  &.small {
    font-size: 1rem;
  }
`;

export default ReactLink;
