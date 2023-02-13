import styled from "styled-components";
import { blue, blueDark, iconsGray, zeeguuSecondOrange } from "../colors";

const AvatarBox = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;

  @media (min-width: 768px) {
    right: 2rem;
    top: 2rem;
  }
`;

const NavigationLink = styled.div`
  width: 160px;
  display: flex;
  align-items: center;
  color: ${iconsGray};
  padding: 14px 0 14px 12px;
  font-size: medium;
  background-color: ${blue};
  font-weight: 400;
  line-height: 120%;

  :hover {
    background-color: ${blueDark};
  }

  span {
    align-self: flex-end;
  }

  svg {
    margin-bottom: 2px;
  }

  a {
    color: ${iconsGray};
    text-decoration: none;
    padding-left: 10px;
    display: flex;
    align-items: flex-end;
  }
`;

const Avatar = styled.div`
  width: 21px;
  height: 21px;
`;

export { AvatarBox, Avatar, NavigationLink };
