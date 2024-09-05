import * as s from "./Tag.sc";

export default function Tag({ children, className, onClick }) {
  return (
    <s.Tag className={className} onClick={onClick}>
      {children}
    </s.Tag>
  );
}
