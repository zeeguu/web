// The app's colors are CSS custom properties in index.css, switched by
// data-theme on <html> (see hooks/useTheme.js). Loading the same file and
// setting the same attribute makes every story checkable in both themes.
import "../src/index.css";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";

const preview = {
  // A Docs page per component, showing all its stories on one page.
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute("data-theme", context.globals.theme);
      // Components that navigate (useHistory, Link) need a router around them.
      return createElement(MemoryRouter, null, createElement(Story));
    },
  ],
  parameters: {
    layout: "padded",
  },
};

export default preview;
