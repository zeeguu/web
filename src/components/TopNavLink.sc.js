import styled, { css } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { orange600, orange700, orange800 } from "./colors";

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
  gap: 0.7rem;
  align-items: center;
  color: ${orange600};
  font-weight: 700;
  white-space: nowrap;
  transition: all 300ms ease-in-out;
  &:hover {
    color: ${orange700};
  }

  ${({ $callToAction }) =>
    $callToAction &&
    css`
      padding: 0.75rem 1.5rem;
      gap: 0.6rem;
      border: solid 0.1rem ${orange600};
      border-radius: 4em;
      box-shadow: 0px 0.1rem ${orange600};
      transition: all ease-in 0.08s;

      &:hover {
        color: white;
        background-color: ${orange600};
        border: solid 0.1rem ${orange600};
        box-shadow: 0px 0.1rem ${orange800};
      }

      &:active {
        border: solid 0.1rem ${orange600};
        box-shadow: none;
        transform: translateY(0.2em);
      }
    `}

  ${({ $logo }) =>
    $logo &&
    css`
      font-size: 1.6rem;
      font-weight: 600;
      &:hover {
        color: ${orange600};
      }
    `}
`;

export { TopNavLink, ListItem };
