import styled from "styled-components";
import { veryDarkGrey } from "../../../components/colors";

const ClassroomItem = styled.li`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  padding: 0.75rem 1rem;
  border-radius: 0.3rem;
  color: ${veryDarkGrey};
  background-color: #f6f6f6;
  font-weight: 600;
  margin: 0;
  flex: 1;
  overflow-x: break-word;

  opacity: 0;
  animation: fadeIn 0.15s ease-in forwards 0.15s;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const ClassName = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow-x: hidden;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.87rem;
  }
`;

const ClassroomButton = styled.button`
  display: flex;
  border: inherit;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 0.15rem;
  background-color: inherit;

  &:hover {
    background-color: #f6f6f6;
  }
`;

export { ClassroomItem, ClassroomButton, ClassName };
