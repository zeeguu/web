import styled from "styled-components";

const AddToSavesButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.25rem;
  color: orange;
  background-color: none;
  font: inherit;
  text-align: left;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  border: none;
  font-weight: 600;

  @media (max-width: 576px) {
    justify-content: center;
    margin-left: -0.5em;
    flex: 0;
  }
`;

export default AddToSavesButton;
