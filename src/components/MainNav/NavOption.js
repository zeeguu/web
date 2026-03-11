import React from "react";
import * as s from "./NavOption.sc";
import { isMediumScreenWidth } from "./screenSize";
import { isNavOptionActive } from "./navigationOptions";

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
  const isActive = isNavOptionActive(linkTo, currentPath);
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
