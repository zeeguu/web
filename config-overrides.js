const { override, addBabelPlugin, overrideDevServer } = require('customize-cra');

// Jest configuration override
const overrideJest = (config) => {
  config.roots = ['<rootDir>/src', '<rootDir>/test'];
  config.testMatch = [
    '<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ];
  return config;
};

module.exports = {
  webpack: override(
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
  ),
  jest: overrideJest,
};