import styled from "styled-components";

const Input = styled.input`
  margin-top: 12px;
  width: calc(100% - 32px);
  height: 40px;
  border: 1px solid #DDDDDD;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: #616161;
`;

const InputContainer = styled.div`
  margin-top: 17px;
`

const InputLabel = styled.label`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: #414141;
`

export {
  Input,
  InputContainer,
  InputLabel
}