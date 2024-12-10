import * as s from "./BottomNavOption.sc";

export default function BottomNavOption({
  isOnStudentSide,
  currentPath,
  linkTo,
  onClick = () => {},
  icon,
  text,
  notification,
}) {
  const Component = linkTo ? s.StyledLink : s.StyledButton;
  const isActive = currentPath?.includes(linkTo);

  return (
    <s.BottomNavOption>
      <Component to={linkTo && linkTo} onClick={onClick}>
        {notification}
        <s.IconSpan isOnStudentSide={isOnStudentSide} isActive={isActive}>
          {icon}
        </s.IconSpan>
        {text}
      </Component>
    </s.BottomNavOption>
  );
}
