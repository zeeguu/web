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
        <s.IconContainer title={title ? title : text}>
          {icon}
          {notification}
        </s.IconContainer>
        <s.Span>{text}</s.Span>
      </Component>
    </s.NavOption>
  );
}
