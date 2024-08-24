import styled from "styled-components";
import { lightGrey } from "../../../components/colors";

const SettingsItem = styled.li`
  .settings-link {
    color: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 500;
  }

  box-sizing: border-box;
  display: flex;
  list-style-type: none;
  border: 2px solid ${lightGrey};
  height: 56px;
  width: 100%;
  cursor: pointer;
  /* margin-left: auto;
  margin-right: auto; */
  &:hover {
    background-color: #f6f6f6;
  }
  &:active {
    background-color: #ededed;
  }
`;

export { SettingsItem };
