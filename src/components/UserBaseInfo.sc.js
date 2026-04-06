import styled from "styled-components";
import { AvatarBackground} from "../profile/UserProfile.sc";

export const Avatar = styled(AvatarBackground)`
  width: 2.5rem;
  height: 2.5rem;
  padding: 3px;
`;

export const UserNameWrapper = styled.div`
  display: flex;
  gap: 0.1rem 1rem;
  min-width: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Username = styled.span`
  font-weight: 600;
  margin-left: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const Name = styled.span`
  margin-left: 0.25rem;
  color: #777;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;