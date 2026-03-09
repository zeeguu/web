import React from "react";
import * as s from "./BottomNavOption.sc";
import { isNavOptionActive } from "../navigationOptions";

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
  const isActive = isNavOptionActive(linkTo, currentPath);

  return (
    <s.BottomNavOption>
      <Component
        to={linkTo}
        onClick={onClick}
        aria-haspopup={ariaHasPopup}
        aria-label={ariaLabel}
      >
        {notification && React.cloneElement(notification, { isActive })}
        <s.IconSpan $isActive={isActive}>{icon}</s.IconSpan>
        {text}
      </Component>
    </s.BottomNavOption>
  );
}
