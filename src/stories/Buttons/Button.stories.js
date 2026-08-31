import React from "react";
import Button from "../../pages/_pages_shared/Button.sc";

export default {
  title: "Buttons/Button",
  component: Button,
  args: {
    children: "Continue",
  },
};

export const Default = {};

export const Small = {
  args: {
    className: "small",
  },
};

export const LeftAligned = {
  args: {
    className: "left-aligned",
  },
};

export const Warning = {
  args: {
    className: "warning small",
  },
};

export const Grey = {
  args: {
    className: "grey small",
  },
};

export const Pressed = {
  args: {
    className: "pressed",
  },
};

export const FullWidth = {
  args: {
    className: "full-width-btn",
  },
};

export const SmallSquare = {
  args: {
    className: "small-square-btn",
  },
};

export const SmallBorder = {
  args: {
    className: "small-border-btn",
  },
};

export const Blue = {
  args: {
    className: "blue-btn",
  },
};

export const White = {
  args: {
    className: "small-border-btn white-btn",
  },
};

export const BlueOutline = {
  args: {
    className: "small-border-btn blue-outline-btn",
  },
};
