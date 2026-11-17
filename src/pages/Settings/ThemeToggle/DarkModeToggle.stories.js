import DarkModeToggle from "./DarkModeToggle";
import { ThemeContext } from "../../../contexts/ThemeContext";

const ThemeDecorator = (Story, { args }) => (
  <ThemeContext.Provider value={{ preference: args.value, setPreference: () => {} }}>
    <Story />
  </ThemeContext.Provider>
);

export default {
  title: "Toggles/DarkModeToggle",
  component: DarkModeToggle,
  decorators: [ThemeDecorator],
};

export const Default = {
  args: {
    value: "auto",
  },
};
export const LightMode = {
  args: {
    value: "light",
  },
};
export const DarkMode = {
  args: {
    value: "dark",
  },
};
