const path = require("path");

module.exports = {
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.svg$/, loader: "svg-inline-loader" },
    ],
  },
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
};
