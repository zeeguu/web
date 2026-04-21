import styled from "styled-components";
export { ErrorText } from "../profile/UserProfile.sc";

export const UnstyledList = styled.ul`
  padding: 0;
  margin-bottom: ${({ $mb }) => $mb || 0};
`;

export const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;
