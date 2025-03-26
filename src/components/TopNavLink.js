import * as s from "./TopNavLink.sc";

export default function TopNavLink({
  children,
  to,
  onClick,
  logo = false,
  callToAction = false,
}) {
  return (
    <s.ListItem $logo={logo}>
      <s.TopNavLink
        $logo={logo}
        $callToAction={callToAction}
        to={to}
        onClick={onClick}
      >
        {children}
      </s.TopNavLink>
    </s.ListItem>
  );
}
