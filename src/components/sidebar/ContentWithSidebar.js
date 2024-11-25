import * as s from "./ContentWithSidebar.sc";
import { isMobile } from "../../utils/misc/browserDetection";
import NewSidebar from "./NewSidebar";
import BottomNav from "./BottomNav";
import { useState } from "react";

export default function ContentWithSidebar(props) {
  const { children: appContent } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <s.Content isMobile={isMobile()} id="scrollHolder" className="content">
      {isMobile() ? (
        <BottomNav />
      ) : (
        <NewSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
      <s.ContentContainer isMobile={isMobile()} isCollapsed={isCollapsed}>
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
