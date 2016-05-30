'use strict';
import path from 'path'
import fs from 'fs'

import webpack from 'webpack'
import _ from 'lodash'
import glob from 'glob'

// webpack plugins
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

let vue = require('vue')

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

const rootPath = path.join(process.cwd(), '..')

const srcDir = path.resolve(rootPath, path.join(rootPath, '/src/client'))
const nodeModPath = path.resolve(rootPath, path.join(rootPath, '/node_modules'))
const assets = path.join(rootPath, '/assets/')

// 插件列表
let plugins = []
module.exports = (options) => {
    options = options || {}

    // 声明变量
    let debug = options.debug !== undefined ? options.debug : true,
        publicPath = '',
        cssLoader,
        lessLoader

    if (debug) {
        // 开发阶段，css直接内嵌
        cssLoader = 'style!css'
        lessLoader = 'style!css!less'

        // html
        plugins.push(new HtmlWebpackPlugin({
            filename: '../views/pages/index.html',
            template: srcDir + '/index.html',
            inject: 'body'
        }))
    } else {
        // 编译阶段，css分离出来单独引入
        cssLoader = ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
        lessLoader = ExtractTextPlugin.extract('style', 'css?minimize','less')

        // css plugins
        plugins.push(
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
        )

        // js plugins
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        )

        // js plugins
        plugins.push(
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        )

        plugins.push(new webpack.optimize.OccurenceOrderPlugin())

        // html plugings
        plugins.push(
            new HtmlWebpackPlugin({
                filename: '../views/pages/index.html',
                template: srcDir + '/index.html',
                inject: 'body',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                }
            })
        )
    }
    let config = {
        entry: srcDir + '/main.js',
        devtool: debug ? '#source-map' : false,
        output: {
            path: path.resolve(assets + 'public'),
            filename: debug ? 'js/[name].js' : 'js/[name].[chunkhash:8].min.js',
            chunkFilename: debug ? 'js/chunk.[chunkhash:8].js' : 'js/chunk.[chunkhash:8].min.js',
            hotUpdateChunkFilename: debug ? 'js/[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },
        resolve: {
            root: [srcDir, './node_modules'],
            extensions: ['', '.vue', '.js', '.css', '.less', '.tpl',
                '.png', '.jpg'
            ]
        },
        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },
        module: {
            preLoaders: [{
                test: /\.vue$/,
                loader: 'eslint',
                include: srcDir,
                exclude: /node_modules/
            }, {
                test: /\.js$/,
                include: srcDir,
                exclude: /node_modules/,
                loader: 'eslint'
            }],
            loaders: [{
                test: /\.(jpe?g|png|gif)$/i,
                loaders: [
                    'image?{bypassOnDebug: true, progressive:true, \
    optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                    // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                    // 否则则调用file-loader，参数直接传入
                    'url?limit=10000&name=img/[hash:8].[name].[ext]',
                ]
            }, {
                test: /\.(woff|eot|ttf)$/i,
                loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
            }, {
                test: /\.html$/,
                loader: 'vue-html'
            }, {
                test: /\.css$/,
                loader: cssLoader
            }, {
                test: /\.less$/,
                loader: lessLoader
            }, {
                test: /\.(woff|woff2|ttf|eot|svg|otf)(\?t=[0-9]*(\#[a-zA-Z]*)?)?$/,
                loader: "file"
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=es2015,presets[]=stage-3'
            }, {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue'
            }]
        },
        vue: {
            extract: debug ? true : false,
            loaders: ['vue-style-loader', 'less-loader',
                'css-loader',
                'babel?presets[]=es2015,presets[]=stage-3'
            ],
            autoprefixer: {
                browsers: ['Firefox >= 2', 'Safari >= 3', 'Explorer >= 8', 'Chrome >= 4', "ChromeAndroid >= 2.0"]
            }
        },
        eslint: {
            formatter: require('eslint-friendly-formatter')
        },
        plugins: [
            new CommonsChunkPlugin({
                name: 'vender'
            })
        ].concat(plugins),
        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    }

    return config

}
