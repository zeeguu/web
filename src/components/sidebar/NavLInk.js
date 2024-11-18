import React from "react";
import * as s from "./NavLink.sc";

export default function NavLink({
  linkTo,
  icon,
  isOnStudentSide = true,
  isCollapsed = false,
  text,
  title,
  isButton = false,
  onClick,
  currentPath,
}) {
  const content = (
    <>
      <s.IconContainer isCollapsed={isCollapsed} title={title ? title : text}>
        {icon}
      </s.IconContainer>
      <s.Span visibility={isCollapsed}>{text}</s.Span>
    </>
  );

  return (
    <s.NavOption
      isActive={currentPath && currentPath.includes(linkTo)}
      isOnStudentSide={isOnStudentSide}
    >
      {!isButton ? (
        <s.RouterLink to={linkTo}>{content}</s.RouterLink>
      ) : (
        <s.OptionButton onClick={onClick}>{content}</s.OptionButton>
      )}
    </s.NavOption>
  );
}
