import styled from "styled-components";
import { orange500, orange600, orange800 } from "../components/colors";

export const CenteringContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 260px);
`;

export const GenerateButton = styled.button`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${orange500};
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0px 0.3rem ${orange800};
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 30px;

  &:hover {
    background-color: ${orange600};
  }

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all 0.08s ease-in;
  }
`;
