const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
  plugins: [new HtmlWebpackPlugin(), new HtmlInlineScriptPlugin({
		scriptMatchPattern: [/runtime~.+[.]js$/],
	})],
};