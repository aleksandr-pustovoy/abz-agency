const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }
    return config;
}

module.exports = {
    mode: 'production',
    entry: {
        'index': './src/index.js',
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: `${ path.join(__dirname, './src')}/assets/img`,
                to: `${ path.join(__dirname, './public')}/assets/img`,
            },
            {
                from: `${ path.join(__dirname, './src')}/assets/fonts`,
                to: `${ path.join(__dirname, './public')}/assets/fonts`,
            },
            {
                from: `${ path.join(__dirname, './src')}/favicon.ico`,
                to: `${ path.join(__dirname, './public')}/favicon.ico`,
            },
        ]),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[contenthash].css'
        })
    ],
    resolve: {
        alias: {
            '@js': 'src/js'
        },
        extensions: ['.js', '.jsx']
    },
    optimization: optimization(),
    devServer: {
        port: 5200,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [ { loader: "babel-loader" } ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    'css-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: '../fonts/'
                        }
                    }
                ]
            }
        ]
    }
}
