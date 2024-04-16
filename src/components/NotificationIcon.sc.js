import styled from "styled-components";
import { zeeguuRed } from "./colors";
// Source: https://loading.io/css/
const NotificationIcon = styled.div`
  display: inline-block;
  position: relative;
  top: -0.5em;
  left: 0.05em;
  cursor: default;
  div {
    display: flex;
    background: rgb(215, 38, 61);
    background: radial-gradient(
      circle,
      rgba(215, 38, 61, 1) 95%,
      rgba(42, 8, 12, 0.5) 100%
    );
    border-radius: 1000px;
    z-index: 99;
    padding: 0.1em 0.5em;
    min-width: 0.1em;
    min-height: 0.9em;
    max-height: 1.2em;
    justify-content: center;
    align-items: center;
    font-size: x-small;
    font-weight: 500;
    color: white;
    @media (max-width: 990px) {
      font-size: x-small;
    }
  }
`;

export { NotificationIcon };
