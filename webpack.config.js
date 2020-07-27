const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelOptions = require('./.babelrc.js');

babelOptions.plugins = [
  'react-hot-loader/babel',
  ...(babelOptions.plugins || []),
];

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Slider',
      template: './src/index.ejs',
    }),
  ],
};
