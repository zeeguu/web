import * as s from "./Button.sc";

export default function Button({ children, href, onClick }) {
  return (
    <s.ButtonLink href={href}>
      <s.Button onClick={onClick}>{children}</s.Button>
    </s.ButtonLink>
  );
}
