import * as s from "./HobbyTag.sc";

export default function HobbyTag({ children, className, onClick }) {
  return (
    <s.HobbyTag className={className} onClick={onClick}>
      {children}
    </s.HobbyTag>
  );
}
