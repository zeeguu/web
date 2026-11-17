import SelectionButton from "./SelectionButton.sc";

export default {
  title: "Buttons/SelectionButton",
  component: SelectionButton,
  args: {
    children: "Continue",
  },
};

export const Default = {};

export const Selected = {
  args: {
    className: "selected",
    children: "Selected option",
  },
};
