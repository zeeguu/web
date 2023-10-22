import styled from "styled-components";

let SaveButton = styled.button`
  font-size: small;
  font-weight: bold;
  color: orange;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  border: inherit;
  background-color: inherit;
  /* margin: 1rem 0; */
  padding: 0.25rem 0;
  cursor: pointer;
`;

let SavedLabel = styled.div`
  font-size: small;
  font-weight: bold;
  color: brown;
  /* margin: 0.6em; */
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0;
`;

export { SaveButton, SavedLabel };
