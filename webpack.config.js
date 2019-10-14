const path = require('path');

module.exports = {
  entry: './src/popup.js',
  watch: true,
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'url_rearrange'),
  },
};
