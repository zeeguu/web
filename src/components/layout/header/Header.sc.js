import styled from "styled-components";
import { gray } from "../../colors";

const HeaderContainer = styled.header`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 10;
  height: 18px;
  overflow: hidden;
  background-color: white;
  width: calc(100% - 16px * 2);
  border-bottom: 1px solid ${gray};

  svg {
    position: absolute;
    z-index: 100;
    left: 16px;
    top: 18px;
    cursor: pointer;
  }

  span {
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.0043em;
    color: #616161;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export { HeaderContainer };
