import { useState } from "react";
import * as s from "./CollapsablePanel.sc";

export default function CollapsablePanel({
  children,
  topMessage,
  defaultOpen,
}) {
  const [isOpen, setIsOpen] = useState(
    defaultOpen !== undefined ? defaultOpen : true,
  );
  const ARROW_UP = <span className="arrow">&#8593;</span>;
  const ARROW_DOWN = <span className="arrow">&#8595;</span>;
  return (
    <>
      <s.CollapsableContainer onClick={() => setIsOpen(!isOpen)}>
        <b>{topMessage}</b>
        {isOpen ? ARROW_UP : ARROW_DOWN}
      </s.CollapsableContainer>
      {isOpen && <>{children}</>}
    </>
  );
}
