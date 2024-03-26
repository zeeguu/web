import * as s from "./Button.sc";

export default function Button({ children, href, type }) {
  return (
    <a href={href}>
      <s.Button>{children}</s.Button>
    </a>
  );
}
