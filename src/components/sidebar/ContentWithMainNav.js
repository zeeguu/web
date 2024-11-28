import * as s from "./ContentWithMainNav.sc";
import { isMobile } from "../../utils/misc/browserDetection";
import MainNav from "./MainNav/MainNav";

export default function ContentWithMainNav(props) {
  const { children: appContent } = props;

  return (
    <s.Content isMobile={isMobile()} id="scrollHolder" className="content">
      <MainNav />
      <s.ContentContainer isMobile={isMobile()}>
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
