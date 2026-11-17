// Storybook is the catalog of shared UI components: before building a new
// one, check here whether it already exists (see CLAUDE.md).
// It reuses vite.config.js, so JSX-in-.js and styled-components work as in the app.
const config = {
  stories: ["../src/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
};
export default config;
