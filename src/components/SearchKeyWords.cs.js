import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

const ContainerKeywords = styled.div`
  padding: 4px;
`;

let KeyWordText = styled.p`
  color: ${zeeguuOrange};
  display: flex;
  margin-left: 10%;
  margin-top: 10%;
`;

export { KeyWordText, ContainerKeywords };
