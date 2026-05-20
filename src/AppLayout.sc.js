import styled from "styled-components";
import { MOBILE_WIDTH } from "./components/MainNav/screenSize";

const AppLayout = styled.div`
  box-sizing: border-box;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: ${({ $screenWidth }) => ($screenWidth <= MOBILE_WIDTH ? "column" : "row")};
  overflow: hidden;
`;

const AppContent = styled.section`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  /* Article cards on Discover/Classroom/OwnArticles opt into snap via
     scroll-snap-align: start on s.ArticlePreview. Mandatory because
     proximity wasn't firing reliably on iOS WebView. Other surfaces
     (My Articles' SavedArticleRow, settings pages) have no
     snap-aligned children, so this has no effect there. */
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
`;

export { AppLayout, AppContent };
