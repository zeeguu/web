const path = require('path');

module.exports = {
  entry: './src/JSInjection/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
    ]
  },
  resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
      },
},
}; 
