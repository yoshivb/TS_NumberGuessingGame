
var path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = env => 
{
  let outputPath = path.resolve(__dirname, (env.output !== undefined ? env.output : "build"));

  return {
    mode: 'production',
    target: ['web', 'es5'],
    entry: './src/index.ts',
    output: {
      path: outputPath,
      filename: 'bundle.js',
      clean: true
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
      hot: true,
      watchFiles: ['src/**/*.hbs', 'src/**/*.css'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "src/*.css", to: "[name][ext]" }
        ],
      }),
      new HandlebarsPlugin({
        entry: './src/*.hbs',
        data: path.join(__dirname, "/project.json"),
        output: outputPath + '/[name].html'
      })
    ],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          exclude: [
            /node_modules/
          ],
          loader: 'handlebars-loader'
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        }
      ]
    },
    devtool: 'inline-source-map'
  }
}
