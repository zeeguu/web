import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import * as s from "./NavLink.sc";

export default function NavLink({ children, linkTo }) {
  return (
    <s.NavOption>
      <Link to={linkTo}>{children}</Link>
    </s.NavOption>
  );
}
