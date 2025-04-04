import * as s from "./TopNavOption.sc";
// More info on why links are wrapped in <li> is available here:
// https://www.w3.org/WAI/tutorials/menus/structure/#identify-menus
// https://www.w3.org/WAI/tutorials/menus/structure/#menu-representation

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
