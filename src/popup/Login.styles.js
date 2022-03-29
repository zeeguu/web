import styled from "styled-components";

export const MainContainer = styled.div`
  margin-top: 10px;

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
`;

export const BottomContainer = styled.div`
  p {
    font-size: small !important;
  }
  a {
    color: #2f77ad;
    font-weight: 600;
    :hover {
      color: #4f97cf !important;
    }
  }
`;
