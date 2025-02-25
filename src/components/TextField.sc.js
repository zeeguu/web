import styled from "styled-components";
import { lightGrey } from "./colors";
import { TextField } from "@mui/material";

const TextFieldWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TextFieldContainer = styled.div`
  width: 100%;
  border-radius: 0.25em;
  background-color: #fff;
  display: grid;
  grid-template-areas: "select";
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  box-sizing: border-box;
  height: 2.69rem;
  appearance: none;
  border: 1.5px solid ${lightGrey};
  border-radius: 0.3rem;
  background-color: transparent;
  padding: 0 2.25rem 0 1rem;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: inherit;
  line-height: inherit;
`;
const Label = styled.label`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

export { TextFieldWrapper, TextFieldContainer, Label, StyledTextField };
