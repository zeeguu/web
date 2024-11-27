import * as s from "./NavOption.sc";

export default function NavOption({
  linkTo,
  icon,
  isOnStudentSide = true,
  isCollapsed = false,
  notification = null,
  text,
  title,
  onClick = () => {},
  currentPath,
  className,
}) {
  const Component = linkTo ? s.RouterLink : s.OptionButton;

  return (
    <s.NavOption
      isActive={currentPath && currentPath.includes(linkTo)}
      isOnStudentSide={isOnStudentSide}
      className={className}
    >
      <Component onClick={onClick} to={linkTo && linkTo}>
        <s.IconContainer isCollapsed={isCollapsed} title={title ? title : text}>
          {icon}
          {notification}
        </s.IconContainer>
        <s.Span visibility={isCollapsed}>{text}</s.Span>
      </Component>
    </s.NavOption>
  );
}
