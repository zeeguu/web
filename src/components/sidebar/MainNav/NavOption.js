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
}) {
  const Component = linkTo ? s.RouterLink : s.OptionButton;
  const isActive = currentPath?.includes(linkTo);

  return (
    <s.NavOption>
      <Component
        className={className}
        isActive={isActive}
        isOnStudentSide={isOnStudentSide}
        onClick={onClick}
        to={linkTo && linkTo}
      >
        <s.OptionContentWrapper>
          <s.IconContainer title={title ? title : text}>{icon}</s.IconContainer>
          <s.TextWrapper>{text}</s.TextWrapper>
          {notification}
        </s.OptionContentWrapper>
      </Component>
    </s.NavOption>
  );
}
