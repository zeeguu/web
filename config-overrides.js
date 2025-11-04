const { override, overrideDevServer } = require('customize-cra');

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

// Replace Babel with SWC for faster builds
const useSWC = () => (config) => {
  // Find and replace babel-loader with swc-loader
  const oneOfRule = config.module.rules.find(rule => Array.isArray(rule.oneOf));
  if (oneOfRule) {
    oneOfRule.oneOf.forEach(rule => {
      if (rule.loader && rule.loader.includes('babel-loader')) {
        rule.loader = require.resolve('swc-loader');
        rule.options = {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
              dynamicImport: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                development: process.env.NODE_ENV === 'development',
              },
            },
            experimental: {
              plugins: [
                ['@swc/plugin-styled-components', {
                  displayName: true,
                  fileName: true,
                }],
              ],
            },
          },
        };
      }
    });
  }
  return config;
};

module.exports = {
  webpack: override(
    useSWC(),
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