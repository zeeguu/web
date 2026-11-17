// The app's colors are CSS custom properties in index.css, switched by
// data-theme on <html> (see hooks/useTheme.js). Loading the same file and
// setting the same attribute makes every story checkable in both themes.
import "../src/index.css";

const preview = {
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
      return Story();
    },
  ],
  parameters: {
    layout: "padded",
  },
};

export default preview;
