// Storybook is the catalog of shared UI components: before building a new
// one, check here whether it already exists (see CLAUDE.md).
// It reuses vite.config.js, so JSX-in-.js and styled-components work as in the app.
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx)"],
  // Serves public/ as in the app, so /static/... images load.
  staticDirs: ["../public"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  // Icons by deep import (@mui/icons-material/Close) resolve to MUI's CommonJS
  // files, whose require() of @mui/material makes esbuild wrap MUI in lazy
  // initializers that other prebundled chunks never call: every story using
  // MUI then fails with "createTheme_default is not a function". Storybook
  // takes the icons from MUI's ESM build instead.
  viteFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: [
        ...toAliasList(config.resolve?.alias),
        { find: /^@mui\/icons-material\/(?!esm\/)(.+)$/, replacement: "@mui/icons-material/esm/$1" },
      ],
    },
  }),
};

// Vite takes aliases as an object or a list; a list keeps the order.
function toAliasList(alias) {
  if (!alias) return [];
  return Array.isArray(alias) ? alias : Object.entries(alias).map(([find, replacement]) => ({ find, replacement }));
}
export default config;
