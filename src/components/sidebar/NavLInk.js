import React from "react";
import * as s from "./NavLink.sc";

export default function NavLink({
  linkTo,
  icon,
  isOnStudentSide = true,
  isCollapsed = false,
  title,
  text,
}) {
  return (
    <s.NavOption isOnStudentSide={isOnStudentSide}>
      <s.RouterLink to={linkTo}>
        <s.IconContainer title={title}>{icon}</s.IconContainer>
        <s.Span visibility={isCollapsed}>{text}</s.Span>
      </s.RouterLink>
    </s.NavOption>
  );
}
