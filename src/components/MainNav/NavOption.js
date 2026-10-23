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
  overflowEnabled = false,
  isActive: isActiveOverride,
  trailing = null,
}) {
  const Component = linkTo ? s.RouterLink : s.OptionButton;
  // Lets an option be active beyond its own link: the account row stays lit in Settings too.
  const isActive = isActiveOverride ?? isNavOptionActive(linkTo, currentPath);
  const isCollapsed = isMediumScreenWidth(screenWidth);
  const elementTitle = isCollapsed ? (title ? title : text) : "";

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
        <s.OptionContentWrapper $screenWidth={screenWidth} $overflowEnabled={overflowEnabled}>
          {icon && (
            <s.IconContainer>
              {icon}
              {isCollapsed && notification && React.cloneElement(notification, { isActive, position: "top-absolute", sidebar: false })}
            </s.IconContainer>
          )}
          <s.TextWrapper $screenWidth={screenWidth} $hasIcon={!!icon} $overflowEnabled={overflowEnabled}>{text}</s.TextWrapper>
          {!isCollapsed && notification && React.cloneElement(notification, { isActive })}
        </s.OptionContentWrapper>
      </Component>
      {trailing}
    </s.NavOption>
  );
}
