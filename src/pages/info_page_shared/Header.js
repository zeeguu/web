import * as s from "./InfoPage.sc";
import Logo from "./Logo";

export default function Header({ children }) {
  return (
    <s.Header>
      <Logo />
      {children}
    </s.Header>
  );
}
