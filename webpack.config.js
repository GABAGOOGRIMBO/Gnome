const path = require("path");

const config = {
  entry: './src/main.js',
  mode: 'none',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
};

module.exports = config