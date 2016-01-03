const autoprefixer = require('autoprefixer'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path')

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './client')
]

module.exports = {
  entry: './client/js/sample.js',
  output: {
    path: path.join(__dirname, './server/public/mrw/'),
    filename: 'app.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-1', 'react']
        }
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  eslint: {
    configFile: '.eslintrc'
  },
  resolve: {
    extensions: ['', '.js', '.sass', '.css'],
    modulesDirectories: ['client', 'node_modules']
  }
}
