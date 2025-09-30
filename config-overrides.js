const { override, addBabelPlugin } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-styled-components',
    {
      displayName: true,
      fileName: true
    }
  ]),
  (config) => {
    // Fix for Tiptap ESM imports
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  }
);