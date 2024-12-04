import React from "react";
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
  return (
    <s.BottomNavOption>
      <Component to={linkTo && linkTo} onClick={onClick}>
        {notification}
        <s.IconSpan
          isOnStudentSide={isOnStudentSide}
          isActive={currentPath && currentPath.includes(linkTo)}
        >
          {icon}
        </s.IconSpan>
        {text}
      </Component>
    </s.BottomNavOption>
  );
}
