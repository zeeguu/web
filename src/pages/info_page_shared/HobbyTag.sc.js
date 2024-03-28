import styled from "styled-components";

const HobbyTag = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 1rem;
  line-height: 150%;
  font-weight: 500;
  margin: 0.5rem;
  border: 1px solid gray;
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  background: none;
  cursor: pointer;

  &:hover {
    border: 1px solid orange;
  }

  &:active {
    border: 1px solid orange;
    background-color: orange;
    color: white;
  }
`;

export { HobbyTag };
