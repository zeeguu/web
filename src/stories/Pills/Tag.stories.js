import Tag from "../../pages/_pages_shared/Tag.sc";

export default {
  title: "Pills/Tag",
  component: Tag,
  args: {
    children: "Tag",
  },
};

export const Default = {};

export const Small = {
  args: {
    className: "small",
  },
};

export const OutlinedOrange = {
  args: {
    className: "outlined-orange",
  },
};

export const OutlinedBlue = {
  args: {
    className: "outlined-blue",
  },
};

export const Selected = {
  args: {
    className: "selected",
    children: "Selected tag",
  },
};
