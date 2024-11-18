import React from "react";
import * as s from "./ContentWithSidebar.sc";
import NewSidebar from "./NewSidebar";
import { useState } from "react";

export default function ContentWithSidebar(props) {
  const { children: appContent } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <s.Content id="scrollHolder" className="content">
      <NewSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <s.ContentContainer isCollapsed={isCollapsed}>
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
