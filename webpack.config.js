const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'capsule.js',
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
  },
 
};
