import React from "react";
import * as s from "./ContentWithSidebar.sc";
import NewSidebar from "./NewSidebar";

export default function ContentWithSidebar(props) {
  const { children: appContent } = props;
  return (
    <s.Content id="scrollHolder" className="content">
      <NewSidebar />
      {appContent}
    </s.Content>
  );
}
