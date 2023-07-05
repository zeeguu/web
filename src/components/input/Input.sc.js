import styled, { css } from "styled-components";

const Input = styled.input`
  margin-top: 12px;
  width: calc(100% - 32px);
  height: 40px;
  border: 1px solid #dddddd;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: #616161;

  ${({ disabled }) =>
    !!disabled
      ? css`
          cursor: auto;
        `
      : css`
          cursor: pointer;
        `}
`;

const InputContainer = styled.div`
  margin-top: 17px;
`;

const InputLabel = styled.label`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: #414141;
`;

export { Input, InputContainer, InputLabel };
