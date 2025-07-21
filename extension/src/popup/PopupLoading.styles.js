import styled from "styled-components";
import colors from "../JSInjection/colors";
import { zeeguuOrange } from "../zeeguu-react/src/components/colors";
export const LoadingCircle = styled.div`
    margin-top: 15%;
    align-self: center;
    border: 6px solid ${colors.circleBorderGray};
    border-top: 6px solid ${zeeguuOrange};
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
