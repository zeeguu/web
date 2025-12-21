import styled from "styled-components";
// Source: https://loading.io/css/
const NotificationIcon = styled.div`
  &.top {
    top: -0.5em;
    left: 0.05em;
    margin-right: -0.6em;
  }

  &.top-absolute {
    top: 0;
    right: 0.25rem;
    position: absolute;
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
    background: radial-gradient(
      circle,
      rgb(255 67 92) 95%,
      rgba(42, 8, 12, 0.5) 100%
    );
    border-radius: 1000px;
    border: 0.12rem solid white;
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
