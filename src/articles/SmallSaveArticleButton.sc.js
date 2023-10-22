import styled from "styled-components";

let SaveButton = styled.button`
  font-size: small;
  color: orange;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  border: inherit;
  background-color: inherit;
  /* margin: 1rem 0; */
  padding: 0.25rem 0;
`;

let SavedLabel = styled.div`
  font-size: small;
  font-weight: bold;
  color: brown;
  /* margin: 0.6em; */
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export { SaveButton, SavedLabel };
