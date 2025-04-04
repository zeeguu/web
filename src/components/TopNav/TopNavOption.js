import * as s from "./TopNavOption.sc";

export default function TopNavOption({
  children,
  to,
  onClick,
  logo = false,
  callToAction = false,
  ariaLabel,
}) {
  return (
    <s.ListItem $logo={logo}>
      <s.TopNavLink
        aria-label={ariaLabel}
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
