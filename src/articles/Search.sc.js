import styled from "styled-components";
import { almostBlack } from "../components/colors";

const HeadlineSearch = styled.h1`
  color: ${almostBlack};
  margin: 0;
  font-size: 34px;
  font-weight: bold;
  margin-right: 1.4em;
`;

const ContainerH1Subscribe = styled.div`
  display: flex;
`;

const RowHeadlineSearch = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: baseline;
`;

export { HeadlineSearch, RowHeadlineSearch, ContainerH1Subscribe };
