import styled from "styled-components";

const Content = styled.div`
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow-y: scroll;
`;

const ContentContainer = styled.body`
  width: 100%;
  margin-left: ${({ isCollapsed }) => (isCollapsed ? "4rem" : "12rem")};
  transition: 0.3s ease-in-out;
  padding: 0 1rem 0 1rem;

  @media (max-width: 768px) {
    margin-left: 4.5rem;
  }
`;

export { Content, ContentContainer };
