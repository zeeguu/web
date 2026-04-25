import styled from "styled-components";
import { Input } from "./InputField.sc";
import { zeeguuOrange } from "./colors";

export const SearchBarContainer = styled.div`
  display: flex;
  gap: 0.5em;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1em;
`;

export const SearchInput = styled(Input)`
  &:focus {
    outline: transparent;
    border: 1.5px solid ${zeeguuOrange}
  }
`;
