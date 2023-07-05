import styled from "styled-components";
import {
  zeeguuGray,
  zeeguuOrange,
  zeeguuSecondOrange,
} from "../../components/colors";

export const StyledSettings = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .current-class-of-student {
    margin: 25px 0 -5px 0;
  }

  .change-class-string {
    padding-top: 1rem;
  }
`;

const SettingContainer = styled.div`
  width: 90%;
  max-width: 42vw;
  margin: auto;

  @media (max-width: 770px) {
    max-width: 100%;
  }
`;

const SettingButton = styled.button`
  margin: 32px auto;
  height: 40px;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${zeeguuSecondOrange};
  border-radius: 50px;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: 200ms;

  &:hover {
    background-color: ${zeeguuOrange};
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  justify-content: center;
  width: 100%;
  gap: 14px;
  margin: 40px auto;

  & > li > a {
    color: ${zeeguuGray};
    padding: 5px 0;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
    transition: 100ms;

    &:hover {
      color: ${zeeguuSecondOrange};
      padding: 4px 0;
      border-bottom: 1px ${zeeguuSecondOrange} solid;
    }
  }
`;

export { SettingContainer, SettingButton, NavList };
