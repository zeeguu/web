import * as s from "./Header.sc";
import Logo from "./Logo";
import { APP_VERSION } from "../../appVersion";

export default function Header({ children, withoutLogo, showVersion }) {
  return (
    <s.Header>
      {!withoutLogo && <Logo />}
      {showVersion && <s.Version>v{APP_VERSION}</s.Version>}
      {children}
    </s.Header>
  );
}
