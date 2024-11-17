import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import * as s from "./NavLink.sc";

export default function NavLink({ children, linkTo, isOnStudentSide = true }) {
  return (
    <s.NavOption isOnStudentSide={isOnStudentSide}>
      <Link to={linkTo}>{children}</Link>
    </s.NavOption>
  );
}
