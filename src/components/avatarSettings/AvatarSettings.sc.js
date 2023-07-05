import styled from "styled-components";

const AvatarBox = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;

  @media (min-width: 768px) {
    right: 3rem;
    top: 3rem;
  }
`;

export { AvatarBox };
