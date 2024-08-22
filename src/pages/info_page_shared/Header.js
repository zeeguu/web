import * as s from "./Header.sc";
import Logo from "./Logo";

export default function Header({ children, withoutLogo }) {
  return (
    <s.Header>
      {!withoutLogo && <Logo />}
      {children}
    </s.Header>
  );
}
