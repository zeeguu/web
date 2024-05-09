import * as s from "./Button.sc";

export default function Button({ children, className, href, onClick }) {
  return (
    <s.ButtonLink href={href}>
      <s.Button className={className} role="button" onClick={onClick}>
        {children}
      </s.Button>
    </s.ButtonLink>
  );
}
