const path = require("path");
const webpack = require("webpack");

module.exports = {
  // Use source-map devtool for development to avoid eval() usage
  devtool: process.env.NODE_ENV === "development" ? "source-map" : false,
  output: {
    publicPath: "",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
      "import.meta.env": JSON.stringify({
        DEV: process.env.NODE_ENV === "development",
      }),
    }),
  ],
  module: {
    rules: [
      { 
        test: /\.js$/, 
        loader: "babel-loader", 
        exclude: /node_modules/,
        options: {
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }], 
            '@babel/preset-env'
          ]
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.svg$/, loader: "svg-inline-loader" },
      { 
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
    ],
  },
  resolve: {
    alias: {
      react: path.resolve("../../node_modules/react"),
      "react-dom": path.resolve("../../node_modules/react-dom"),
    },
  },
};
