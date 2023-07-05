import styled from "styled-components";
import { zeeguuSecondOrange } from "../../../components/colors";

const InterestsContainer = styled.div`
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 32px;
`;

const InterestsBox = styled.div`
  display: flex;
  margin-bottom: 12px;
  gap: 10px;
`;

const AddInterestBtn = styled.div`
  border: 1px solid ${zeeguuSecondOrange};
  border-radius: 50px;
  padding: 4px 22px;
  padding-left: 26px;
  font-weight: 500;
  font-size: 13px;
  line-height: calc(15.6 / 13);
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${zeeguuSecondOrange};
  cursor: pointer;
  position: relative;
  &:hover {
    background: ${zeeguuSecondOrange};
    color: #fff;
    & span {
      background: #fff;
    }
  }
  &:active {
    opacity: 0.8;
  }
`;

const Plus = styled.div`
  position: relative;
  width: 9.5px;
  height: 9.5px;
  & span {
    width: 100%;
    height: 2px;
    background: ${zeeguuSecondOrange};
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  & span:last-child {
    transform: translateY(-50%) rotate(90deg);
  }
`;

export { InterestsContainer, InterestsBox, AddInterestBtn, Plus };
