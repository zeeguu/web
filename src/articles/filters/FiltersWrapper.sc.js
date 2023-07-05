import styled from "styled-components";
import {
  zeeguuGray,
  zeeguuSecondGray,
  zeeguuSecondOrange,
  zeeguuThirdGray,
} from "../../components/colors";

const FiltersWrapperContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: 1000ms;
  padding-bottom: 5vh;
`;

const FiltersButtonBox = styled.div`
  width: 100%;
  height: 50px;
  background-color: white;
  position: relative;
  z-index: 1;
  display: flex;
  gap: 5px;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  color: ${zeeguuSecondGray};
  cursor: pointer;
  user-select: none;
`;

const FiltersWrapperBox = styled.div`
  margin-top: 30px;
  width: 100%;
  position: absolute;
  padding-top: 10px;
  padding-bottom: 10vh;
`;

const Filters = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  margin: 0;
  user-select: none;
`;

const FilterColumn = styled.li`
  width: calc((100% - 25%) / 4);
  display: flex;
  flex-direction: column;
  user-select: none;

  :first-child {
    width: 25%;
  }

  .selected {
    color: ${zeeguuSecondOrange};
    font-weight: 500;
  }
`;

const Title = styled.span`
  padding-bottom: 10px;
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: ${zeeguuGray};
  border-bottom: 1px solid ${zeeguuThirdGray};
`;

const Filter = styled.span`
  margin-top: 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  color: ${zeeguuSecondGray};
  cursor: pointer;
  user-select: none;

  :hover {
    color: ${zeeguuSecondOrange};
  }
`;

export {
  FiltersWrapperContainer,
  FiltersButtonBox,
  FiltersWrapperBox,
  Filters,
  FilterColumn,
  Title,
  Filter,
};
