import * as s from "./HobbyTag.sc";
import { useState } from "react";

export default function HobbyTag({ children, className, onClick }) {
  const [tag, setTag] = useState(false);

  function toggleTag() {
    setTag(!tag);
  }

  return (
    <s.HobbyTag className={tag && "active"} onClick={toggleTag}>
      {children}
    </s.HobbyTag>
  );
}
