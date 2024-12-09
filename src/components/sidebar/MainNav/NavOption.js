import * as s from "./NavOption.sc";

export default function NavOption({
  linkTo,
  icon,
  isOnStudentSide,
  notification = null,
  text,
  title,
  onClick = () => {},
  currentPath,
  className,
  screenWidth,
}) {
  const Component = linkTo ? s.RouterLink : s.OptionButton;
  const isActive = currentPath?.includes(linkTo);
  const elementTitle =
    screenWidth <= 992 && screenWidth > 700 ? (title ? title : text) : "";

  return (
    <s.NavOption>
      <Component
        screenWidth={screenWidth}
        className={className}
        isActive={isActive}
        isOnStudentSide={isOnStudentSide}
        onClick={onClick}
        to={linkTo && linkTo}
        title={elementTitle}
      >
        <s.OptionContentWrapper screenWidth={screenWidth}>
          <s.IconContainer>{icon}</s.IconContainer>
          <s.TextWrapper screenWidth={screenWidth}>{text}</s.TextWrapper>
          {notification}
        </s.OptionContentWrapper>
      </Component>
    </s.NavOption>
  );
}
