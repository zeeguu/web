import styled, { css } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { orange600, orange700 } from "./colors";

const ListItem = styled.li`
  list-style-type: none;
  all: unset;

  ${({ $logo }) =>
    $logo &&
    css`
      margin-right: auto;
    `}
`;

const TopNavLink = styled(Link)`
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  color: ${orange600};
  font-weight: 700;
  white-space: nowrap;
  &:hover {
    color: ${orange700};
  }

  ${({ $callToAction }) =>
    $callToAction &&
    css`
      padding: 0.75rem 1.5rem;
      gap: 0.6rem;
      border: solid 2px ${orange600};
      border-radius: 4em;
      box-shadow: 0px 0.1em ${orange600};
      transition: all ease-in 0.08s;

      &:hover {
        border: solid 2px ${orange700};
        box-shadow: 0px 0.1em ${orange700};
      }

      &:active {
        border: solid 2px ${orange700};
        box-shadow: none;
        transform: translateY(0.2em);
      }
    `}

  ${({ $logo }) =>
    $logo &&
    css`
      font-size: 1.25em;
      font-weight: 600;
      &:hover {
        color: ${orange600};
      }
    `}
`;

export { TopNavLink, ListItem };
