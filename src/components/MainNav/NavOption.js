import React from "react";
import * as s from "./NavOption.sc";
import { isMediumScreenWidth } from "./screenSize";

export default function NavOption({
  linkTo,
  icon,
  notification = null,
  text,
  title,
  onClick = () => {},
  currentPath,
  className,
  screenWidth,
  ariaHasPopup,
  ariaLabel,
}) {
  const Component = linkTo ? s.RouterLink : s.OptionButton;
  // Special case: Home should be active for both /articles and /swiper
  const isActive = linkTo === "/articles" 
    ? (currentPath?.includes("/articles") || currentPath?.includes("/swiper"))
    : currentPath?.includes(linkTo);
  const elementTitle = isMediumScreenWidth(screenWidth) ? (title ? title : text) : "";

  return (
    <s.NavOption>
      <Component
        $screenWidth={screenWidth}
        $isActive={isActive}
        className={className}
        onClick={onClick}
        to={linkTo}
        title={elementTitle}
        aria-haspopup={ariaHasPopup}
        aria-label={ariaLabel}
      >
        <s.OptionContentWrapper $screenWidth={screenWidth}>
          {icon && <s.IconContainer>{icon}</s.IconContainer>}
          <s.TextWrapper $screenWidth={screenWidth} $hasIcon={!!icon}>{text}</s.TextWrapper>
          {notification && React.cloneElement(notification, { isActive })}
        </s.OptionContentWrapper>
      </Component>
    </s.NavOption>
  );
}
