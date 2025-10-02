import * as s from "./BottomNavOption.sc";

export default function BottomNavOption({
  currentPath,
  linkTo,
  onClick = () => {},
  icon,
  text,
  notification,
  ariaHasPopup,
  ariaLabel,
}) {
  const Component = linkTo ? s.StyledLink : s.StyledButton;
  // Special case: Home/Articles should be active for both /articles and /articles/swiper
  const isActive = linkTo === "/articles"
    ? currentPath?.startsWith("/articles")
    : !!linkTo && currentPath === linkTo;

  return (
    <s.BottomNavOption>
      <Component
        to={linkTo}
        onClick={onClick}
        aria-haspopup={ariaHasPopup}
        aria-label={ariaLabel}
      >
        {notification}
        <s.IconSpan isActive={isActive}>{icon}</s.IconSpan>
        {text}
      </Component>
    </s.BottomNavOption>
  );
}
