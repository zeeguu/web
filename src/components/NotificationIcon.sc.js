import styled from "styled-components";
import { orange500 } from "./colors";
// Source: https://loading.io/css/
const NotificationIcon = styled.div`
  &.top {
    top: -0.5em;
    left: 0.05em;
    margin-left: -0.5em;
    margin-right: -0.6em;
  }

  &.top-absolute {
    top: 0;
    right: 0.25rem;
    position: absolute;
    z-index: 1;
  }

  &.bottom {
    top: 0.15em;
    left: 0.05em;
    margin-right: -0.6em;
  }
  display: inline-block;
  position: relative;

  cursor: default;
  div {
    display: flex;
    background: ${({ $isActive }) => ($isActive ? orange500 : "white")};
    border-radius: 1000px;
    border: 0.12rem solid ${({ $isActive }) => ($isActive ? "white" : orange500)};
    z-index: 99;
    padding: 0.1em 0.5em;
    min-width: 0.1em;
    min-height: 0.9em;
    max-height: 1.2em;
    justify-content: center;
    align-items: center;
    font-size: x-small;
    font-weight: 800;
    color: ${({ $isActive }) => ($isActive ? "white" : orange500)};
    @media (max-width: 990px) {
      font-size: x-small;
    }
  }
`;

export { NotificationIcon };
