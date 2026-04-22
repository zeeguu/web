import styled from "styled-components";

export const FriendActionsContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    align-items: center;
    margin-bottom: 0.75rem;
  }
`;
