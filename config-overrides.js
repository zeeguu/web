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

      // Disable content hashing in production filenames so sourcemaps can be built separately
      // Files will be named main.js instead of main.[hash].js
      if (config.mode === 'production') {
        config.output.filename = 'static/js/[name].js';
        config.output.chunkFilename = 'static/js/[name].chunk.js';

        // Also disable CSS hashing
        const miniCssExtractPlugin = config.plugins.find(
          plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
        );
        if (miniCssExtractPlugin) {
          miniCssExtractPlugin.options.filename = 'static/css/[name].css';
          miniCssExtractPlugin.options.chunkFilename = 'static/css/[name].chunk.css';
        }
      }

      return config;
    }
  ),
  jest: overrideJest,
};