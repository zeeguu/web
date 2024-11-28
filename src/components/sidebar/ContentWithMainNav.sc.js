import styled from "styled-components";

const Content = styled.div`
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow-y: scroll;
`;

const ContentContainer = styled.section`
  height: 100%;
  width: 100%;
  transition: 0.3s ease-in-out;
  padding: 0 1rem 0 1rem;
  margin-left: 14rem;

  @media (max-width: 992px) {
    margin-left: ${({ isMobile }) => (isMobile ? "0" : "4.2rem")};
  }
`;

export { Content, ContentContainer };
