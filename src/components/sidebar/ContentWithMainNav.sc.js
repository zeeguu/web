import styled from "styled-components";

const Content = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const ContentContainer = styled.section`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  transition: 0.3s ease-in-out;
  padding: 0 1rem 0 1rem;
  margin-left: 14rem;
  overflow-x: hidden;
  top: 0;

  @media (max-width: 992px) {
    margin-left: ${({ isMobile }) => (isMobile ? "0" : "4.2rem")};
    padding-bottom: 5rem;
  }
`;

export { Content, ContentContainer };
