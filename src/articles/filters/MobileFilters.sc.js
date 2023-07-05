import styled from "styled-components";
import {
  gray,
  lightGray,
  zeeguuGray,
  zeeguuSecondGray,
  zeeguuSecondOrange,
} from "../../components/colors";

const MobileFilters = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background-color: ${lightGray};
  z-index: 100;
  transition: all 400ms ease-in-out 0s;

  @media (min-width: 768px) {
    display: none;
  }

  .selected {
    color: ${zeeguuSecondOrange};
    font-weight: 500;
  }
`;

const FiltersHeader = styled.div`
  margin: 0;
  background-color: white;
  width: calc(100% - 30px);
  height: 20px;
  padding: 15px 20px;
  border-bottom: 1px solid ${gray};
  display: flex;
  align-items: center;

  span {
    margin-left: 15px;
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 100%;
    color: ${zeeguuGray};
  }
`;

const FilterColumn = styled.div`
  background-color: white;
  width: 90%;
  margin: 20px auto;
  border-radius: 5px;
  overflow: hidden;
`;

const Title = styled.div`
  background-color: #fafafa;
  padding: 10px 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-transform: uppercase;
`;

const Filter = styled.div`
  padding: 10px 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 100%;
  color: ${zeeguuSecondGray};
`;

export { MobileFilters, FiltersHeader, FilterColumn, Title, Filter };
