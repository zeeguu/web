import * as s from "./HobbyTag.sc";
import { useState } from "react";

export default function HobbyTag({ children, className, onClick, topic, subscribedTopics }) {
  const [tag, setTag] = useState(false);

  function toggleTag() {
    setTag(!tag);
  }

  return (
    <s.HobbyTag className={className} onClick={onClick}>
      {children}
    </s.HobbyTag>
  );
}
