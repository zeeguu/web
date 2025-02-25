import styled from "styled-components";
import { darkBlue } from "../../components/colors";

export const TimeSelector = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 20px 25px;
  margin: auto;
  width: 40em;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.12),
    0 2px 4px 0 rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  line-height: 2;
  font-size: large;

  b {
    color: ${darkBlue};
  }
`;
