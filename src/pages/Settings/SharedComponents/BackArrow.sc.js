import styled from "styled-components";

const BackArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-self: center;
  cursor: pointer;
  color: var(--text-secondary);
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  &:hover {
    color: var(--text-secondary);
  }
  &:active {
    color: var(--text-secondary);
  }
`;

export { BackArrow };
