const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const add = () => {
  const imageQuantity = 150;
  const entryArr = ['./src/index.js', './src/style.css', './src/audio/sound.mp3'];
  for (let i=1; i<= imageQuantity; i++) {
    entryArr.push(`./src/images/${i}.jpg`)
  }
  return entryArr
}



module.exports = (env, options) => {
    const isProduction = options.mode === 'production';

    const config = {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? !isProduction : 'source-map',
        watch: !isProduction,
        entry: add(),
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'script.js',
        },
        resolve: {
          extensions: ['.js', '.json', '.png'],
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: ['@babel/preset-env']
                      }
                    }
                }, {
                  test: /\.css$/i,
                  use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },{
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                             loader: 'file-loader',
                            options: {
                              name: 'src/images/[name].[ext]'
                            }
                        }
                    ],
                },{
                    test: /\.html$/,
                    loader: 'html-loader',
                },{
                  test: /\.(wav|mp3)$/i,
                  use: [
                    {
                      loader: 'file-loader',
                    },
                  ],
                  generator: {
                  filename: 'src/audio/sound.mp3'
                  }
                }
            ]
        },

        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'style.css'
            })
        ]
    }

    return config;
}