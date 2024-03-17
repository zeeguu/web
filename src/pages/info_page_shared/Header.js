import * as s from "./InfoPage.sc";
import Logo from "./Logo";

export default function Header({ children }) {
  return (
    <s.Header>
      <Logo />
      <s.Heading>{children}</s.Heading>
    </s.Header>
  );
}
