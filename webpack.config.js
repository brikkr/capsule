const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
  },
  resolve: {
    fallback: {
      http : require.resolve("stream-http"),
      https : require.resolve("https-browserify"),
      crypto : require.resolve("crypto-browserify"),
      querystring : require.resolve("querystring-es3"),
      stream: require.resolve("stream-browserify")
    }, 
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
 
};
