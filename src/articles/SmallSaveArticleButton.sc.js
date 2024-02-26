import styled from "styled-components";
import { lightGrey } from "../components/colors";
import { zeeguuOrange } from "../components/colors";

let SaveButton = styled.button`
  font-size: small;
  font-weight: bold;
  color: orange;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  border: inherit;
  background-color: inherit;
  padding: 0.25rem 0;
  cursor: pointer;
  &:hover {
    color: ${zeeguuOrange};
  }
`;

let SavedLabel = styled.div`
  font-size: small;
  font-weight: bold;
  color: ${lightGrey};
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0;
`;

export { SaveButton, SavedLabel };
