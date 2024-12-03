import * as s from "./ContentWithMainNav.sc";
import { isMobile } from "../../utils/misc/browserDetection";
import MainNav from "./MainNav/MainNav";

export default function ContentWithMainNav(props) {
  const { children: appContent } = props;

  return (
    <s.Content isMobile={isMobile()} className="content">
      <MainNav />
      <s.ContentContainer id="scrollHolder" isMobile={isMobile()}>
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
