import styled from "styled-components";
import { blue700 } from "../colors";

const NavOption = styled.li`
  box-sizing: border-box;
  width: 100%;
  list-style-type: none;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  border-radius: 0.25rem;
  border: solid 0.1rem transparent;
  transition: 0.3s ease-in-out;
  cursor: pointer;

  :hover {
    border: solid 0.1rem rgba(255, 255, 255, 0.9);
    background-color: rgba(255, 255, 255, 0.05);
  }

  :active {
    background-color: white;
    color: ${(props) =>
      props.isOnStudentSide === true ? "#ffa41a" : `${blue700}`};
    opacity: 100%;
  }

  a {
    font: inherit;
    color: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
  }
`;

export { NavOption };
