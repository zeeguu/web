import * as s from "./ContentWithMainNav.sc";
import { useState } from "react";
import { isMobile } from "../../utils/misc/browserDetection";
import MainNav from "./MainNav/MainNav";

export default function ContentWithMainNav(props) {
  const { children: appContent } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <s.Content isMobile={isMobile()} id="scrollHolder" className="content">
      <MainNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <s.ContentContainer isMobile={isMobile()} isCollapsed={isCollapsed}>
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
