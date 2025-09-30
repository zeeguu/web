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
  // const isActive = currentPath?.includes(linkTo);
  // changed to this, because the path for swipe is in 'path/swipe'
  const isActive = !!linkTo && currentPath === linkTo;
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
          <s.IconContainer>{icon}</s.IconContainer>
          <s.TextWrapper $screenWidth={screenWidth}>{text}</s.TextWrapper>
          {notification}
        </s.OptionContentWrapper>
      </Component>
    </s.NavOption>
  );
}
