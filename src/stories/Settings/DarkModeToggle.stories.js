import DarkModeToggle from "../../pages/Settings/ThemeToggle/DarkModeToggle";
import { ThemeContext } from "../../contexts/ThemeContext";
import "../../index.css";

const ThemeDecorator = (Story, { args }) => (
  <ThemeContext.Provider value={{ preference: args.value, setPreference: () => {} }}>
    <Story />
  </ThemeContext.Provider>
);

export default {
  title: "Settings/DarkModeToggle",
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
