import React from "react";
import { IconButtonRoot, IconWrapper } from "./IconButton.sc";

export default function IconButton({ onClick, ariaLabel, children, ...props }) {
  return (
    <IconButtonRoot onClick={onClick} aria-label={ariaLabel} type="button" {...props}>
      <IconWrapper>{children}</IconWrapper>
    </IconButtonRoot>
  );
}
