import SpeakButton from "../../exercises/exerciseTypes/SpeakButton";

export default {
  title: "Buttons/SpeakButton",
  component: SpeakButton,
};

export const Default = {
  render: () => <SpeakButton />,
};
export const Small = {
  args: { styling: "small" },
};

export const Inline = {
  args: { styling: "inline" },
};

export const Large = {
  args: { styling: "large" },
};

export const Selected = {
  args: {
    styling: "selected",
    isSelected: true,
  },
};

export const Square = {
  args: { styling: "square" },
};

export const Speaking = {
  args: {
    styling: "next",
    parentIsSpeakingControl: true,
  },
};
