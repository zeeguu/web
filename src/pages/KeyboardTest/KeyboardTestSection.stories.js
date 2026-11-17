import KeyboardTestSection from "./KeyboardTestSection";

export default {
  title: "Dialogs/KeyboardTestSection",
  component: KeyboardTestSection,
};

export const Danish = {
  args: {
    title: "Danish Keyboard (da)",
    value: "",
    onChange: () => {},
    placeholder: "Type or use the virtual keyboard below...",
    languageCode: "da",
    infoText: "Danish keyboard includes special characters: æ, ø, å",
    inputMode: "none",
    initialCollapsed: false,
  },
};
