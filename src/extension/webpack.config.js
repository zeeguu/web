const path = require("path");

module.exports = {
  module: {
    rules: [
      { 
        test: /\.js$/, 
        loader: "babel-loader", 
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
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
