import * as s from "./Button.sc";

export default function Button({ children, className, href, onClick }) {
  return (
    <s.Button className={className} role="button" onClick={onClick}>
      {children}
    </s.Button>
  );
}
