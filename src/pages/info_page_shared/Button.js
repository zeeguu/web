import * as s from "./InfoPage.sc";

export default function Button({ children, href, type }) {
  return (
    <a href={href}>
      <s.Button>{children}</s.Button>
    </a>
  );
}
