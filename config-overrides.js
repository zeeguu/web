const { override, addBabelPlugin, overrideDevServer } = require('customize-cra');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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

      // Add bundle analyzer in analyze mode
      if (process.env.ANALYZE) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: false,
          })
        );
      }

      // Enable persistent caching for faster rebuilds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      return config;
    }
  ),
  jest: overrideJest,
};